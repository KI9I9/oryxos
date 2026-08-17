import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadAssetManifest,
  readPngDimensions,
  validateAssetManifest,
  validateSvgSource,
} from "./export-assets.mjs";

function dimensionsMatch(left, right) {
  return left.width === right.width && left.height === right.height;
}

function formatDimensions(dimensions) {
  return `${dimensions.width}x${dimensions.height}`;
}

function resolvePathInsideWebsite(websiteRoot, relativePath) {
  const resolvedPath = path.resolve(websiteRoot, relativePath);
  const remainsInsideWebsite =
    resolvedPath === websiteRoot || resolvedPath.startsWith(`${websiteRoot}${path.sep}`);

  if (!remainsInsideWebsite) {
    throw new Error(`Declared asset output resolves outside the website: ${relativePath}`);
  }

  return resolvedPath;
}

export async function verifyDeclaredAssetOutputs(options) {
  const websiteRoot = path.resolve(options.websiteRoot);
  const manifestPath = path.resolve(
    options.manifestPath ?? path.join(websiteRoot, "public", "brand", "asset-manifest.json"),
  );
  const manifest = options.manifest ?? (await loadAssetManifest(manifestPath));
  const validation = validateAssetManifest(manifest, {
    requireCompleteInventory: options.requireCompleteInventory ?? true,
  });
  const errors = [...validation.errors];
  const verifiedOutputs = [];

  if (validation.errors.length > 0) {
    return { errors, outputs: verifiedOutputs };
  }

  for (const asset of validation.assets) {
    const sourcePath = resolvePathInsideWebsite(websiteRoot, asset.sourcePath);
    try {
      const svgSource = await readFile(sourcePath);
      errors.push(...validateSvgSource(svgSource, `${asset.assetId} (${asset.sourcePath})`));
    } catch (error) {
      errors.push(
        `${asset.assetId} SVG source is missing or unreadable at ${sourcePath}: ${error.message}`,
      );
    }

    for (const output of asset.outputs) {
      const outputPath = resolvePathInsideWebsite(websiteRoot, output.path);
      let pngBuffer;

      try {
        pngBuffer = await readFile(outputPath);
      } catch (error) {
        errors.push(
          `${asset.assetId} output is missing or unreadable at ${outputPath}: ${error.message}`,
        );
        continue;
      }

      let actualDimensions;
      try {
        actualDimensions = readPngDimensions(pngBuffer, outputPath);
      } catch (error) {
        errors.push(error.message);
        continue;
      }

      const expectedDimensions = { width: output.width, height: output.height };
      if (!dimensionsMatch(actualDimensions, expectedDimensions)) {
        errors.push(
          `${outputPath} is ${formatDimensions(
            actualDimensions,
          )}; the manifest requires ${formatDimensions(expectedDimensions)}.`,
        );
        continue;
      }

      if (pngBuffer.length <= 24) {
        errors.push(`${outputPath} is empty beyond its PNG header.`);
        continue;
      }

      verifiedOutputs.push({
        assetId: asset.assetId,
        path: output.path,
        width: actualDimensions.width,
        height: actualDimensions.height,
        bytes: pngBuffer.length,
      });
    }
  }

  return { errors, outputs: verifiedOutputs };
}

async function runCommandLine() {
  const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

  try {
    const verification = await verifyDeclaredAssetOutputs({ websiteRoot });
    if (verification.errors.length > 0) {
      console.error("Asset verification failed:");
      for (const error of verification.errors) {
        console.error(`- ${error}`);
      }
      process.exitCode = 1;
      return;
    }

    console.log(`Verified ${verification.outputs.length} PNG asset(s).`);
  } catch (error) {
    console.error(`Asset verification failed: ${error.message}`);
    process.exitCode = 1;
  }
}

const invokedScriptPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedScriptPath === fileURLToPath(import.meta.url)) {
  await runCommandLine();
}
