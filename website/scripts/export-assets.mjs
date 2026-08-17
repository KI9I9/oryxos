import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Resvg } from "@resvg/resvg-js";

export const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

const ALLOWED_ASSET_KINDS = new Set([
  "logo-mark",
  "wordmark",
  "lockup",
  "favicon",
  "touch-icon",
  "social",
  "diagram",
]);

export const REQUIRED_ASSET_INVENTORY = Object.freeze({
  "brand-logo-mark": {
    kind: "logo-mark",
    sourcePath: "public/brand/logo-mark.svg",
    requiredOutputDimensions: [],
  },
  "brand-wordmark-en": {
    kind: "wordmark",
    sourcePath: "public/brand/wordmark-en.svg",
    requiredOutputDimensions: [],
  },
  "brand-lockup-horizontal": {
    kind: "lockup",
    sourcePath: "public/brand/lockup-horizontal.svg",
    requiredOutputDimensions: [],
  },
  "brand-mark-monochrome": {
    kind: "logo-mark",
    sourcePath: "public/brand/logo-mark-monochrome.svg",
    requiredOutputDimensions: [],
  },
  "icon-favicon-svg": {
    kind: "favicon",
    sourcePath: "public/icons/favicon.svg",
    requiredOutputDimensions: [
      { width: 16, height: 16 },
      { width: 32, height: 32 },
    ],
  },
  "icon-apple-touch": {
    kind: "touch-icon",
    sourcePath: "public/icons/apple-touch-icon.svg",
    requiredOutputDimensions: [{ width: 180, height: 180 }],
  },
  "social-default-en": {
    kind: "social",
    sourcePath: "public/social/og-default-en.svg",
    requiredOutputDimensions: [{ width: 1200, height: 630 }],
  },
  "social-default-zh": {
    kind: "social",
    sourcePath: "public/social/og-default-zh.svg",
    requiredOutputDimensions: [{ width: 1200, height: 630 }],
  },
  "diagram-system-architecture": {
    kind: "diagram",
    sourcePath: "public/diagrams/system-architecture.svg",
    requiredOutputDimensions: [],
  },
  "diagram-agent-definition": {
    kind: "diagram",
    sourcePath: "public/diagrams/agent-skill-profile.svg",
    requiredOutputDimensions: [],
  },
  "diagram-react-loop": {
    kind: "diagram",
    sourcePath: "public/diagrams/react-loop.svg",
    requiredOutputDimensions: [],
  },
});

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getAssetRecords(manifest) {
  if (Array.isArray(manifest)) {
    return manifest;
  }

  if (isPlainObject(manifest) && Array.isArray(manifest.assets)) {
    return manifest.assets;
  }

  return null;
}

function normalizeRelativeAssetPath(value) {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim().replace(/^\.\//, "");
}

function resolveDimensionsFromAsset(asset, outputPath, outputIndex) {
  const dimensions = asset.dimensions;

  if (Array.isArray(dimensions)) {
    return dimensions[outputIndex] ?? null;
  }

  if (!isPlainObject(dimensions)) {
    return null;
  }

  if (Number.isInteger(dimensions.width) && Number.isInteger(dimensions.height)) {
    return dimensions;
  }

  for (const dimensionsKey of [
    outputPath,
    path.posix.basename(outputPath),
    `${outputIndex}`,
  ]) {
    if (isPlainObject(dimensions[dimensionsKey])) {
      return dimensions[dimensionsKey];
    }
  }

  if (isPlainObject(dimensions.outputs)) {
    return (
      dimensions.outputs[outputPath] ??
      dimensions.outputs[path.posix.basename(outputPath)] ??
      null
    );
  }

  return null;
}

function normalizeAssetOutputs(asset) {
  const declaredOutputs = Array.isArray(asset.outputs)
    ? asset.outputs
    : Array.isArray(asset.outputPaths)
      ? asset.outputPaths
      : [];

  return declaredOutputs.map((declaredOutput, outputIndex) => {
    if (typeof declaredOutput === "string") {
      const outputPath = normalizeRelativeAssetPath(declaredOutput);
      const dimensions = resolveDimensionsFromAsset(asset, outputPath, outputIndex);
      return {
        path: outputPath,
        width: dimensions?.width,
        height: dimensions?.height,
      };
    }

    if (isPlainObject(declaredOutput)) {
      const outputPath = normalizeRelativeAssetPath(
        declaredOutput.path ?? declaredOutput.outputPath,
      );
      const dimensions = isPlainObject(declaredOutput.dimensions)
        ? declaredOutput.dimensions
        : declaredOutput;
      return {
        path: outputPath,
        width: dimensions.width,
        height: dimensions.height,
      };
    }

    return { path: null, width: undefined, height: undefined };
  });
}

function hasOwnershipStatement(asset) {
  if (
    typeof asset.originalityNote === "string" &&
    asset.originalityNote.trim().length > 0
  ) {
    return true;
  }

  if (typeof asset.ownership === "string" && asset.ownership.trim().length > 0) {
    return true;
  }

  if (isPlainObject(asset.ownership)) {
    return Object.values(asset.ownership).some(
      (value) => typeof value === "string" && value.trim().length > 0,
    );
  }

  return false;
}

function pathIsSafeRepositoryRelative(assetPath, expectedExtension) {
  return (
    typeof assetPath === "string" &&
    assetPath.length > 0 &&
    !path.isAbsolute(assetPath) &&
    !assetPath.includes("\\") &&
    !assetPath.split("/").includes("..") &&
    assetPath.toLowerCase().endsWith(expectedExtension)
  );
}

function dimensionsMatch(left, right) {
  return left.width === right.width && left.height === right.height;
}

function formatDimensions(dimensions) {
  return `${dimensions.width}x${dimensions.height}`;
}

export function validateAssetManifest(manifest, options = {}) {
  const requireCompleteInventory = options.requireCompleteInventory ?? true;
  const assets = getAssetRecords(manifest);
  const errors = [];
  const normalizedAssets = [];

  if (!assets) {
    return {
      assets: [],
      errors: ["asset-manifest.json must be an array or an object with an assets array."],
    };
  }

  const assetIds = new Set();

  assets.forEach((asset, assetIndex) => {
    const location = `asset-manifest.json assets[${assetIndex}]`;
    if (!isPlainObject(asset)) {
      errors.push(`${location} must be an object.`);
      return;
    }

    const assetId = asset.assetId;
    const sourcePath = normalizeRelativeAssetPath(asset.sourcePath ?? asset.source);
    const outputs = normalizeAssetOutputs(asset);

    if (typeof assetId !== "string" || assetId.trim() === "") {
      errors.push(`${location}.assetId must be a non-empty string.`);
    } else if (assetIds.has(assetId)) {
      errors.push(`${location}.assetId duplicates ${assetId}.`);
    } else {
      assetIds.add(assetId);
    }

    if (!ALLOWED_ASSET_KINDS.has(asset.kind)) {
      errors.push(`${location}.kind must be one of ${[...ALLOWED_ASSET_KINDS].join(", ")}.`);
    }
    if (!pathIsSafeRepositoryRelative(sourcePath, ".svg")) {
      errors.push(
        `${location}.sourcePath must be a safe website-relative SVG path using forward slashes.`,
      );
    }
    if (!Array.isArray(asset.outputs) && !Array.isArray(asset.outputPaths)) {
      errors.push(`${location} must declare outputs or outputPaths, even when the array is empty.`);
    }
    if (![null, "en", "zh", "zh-Hans"].includes(asset.locale ?? null)) {
      errors.push(`${location}.locale must be null, en, zh, or zh-Hans.`);
    }
    if (typeof asset.decorative !== "boolean") {
      errors.push(`${location}.decorative must be a boolean.`);
    }
    if (asset.decorative === false && (!asset.altKey || typeof asset.altKey !== "string")) {
      errors.push(`${location}.altKey is required for informative assets.`);
    }
    if (!hasOwnershipStatement(asset)) {
      errors.push(
        `${location} must include originalityNote or ownership describing project ownership and the original generation process.`,
      );
    }

    const outputPaths = new Set();
    outputs.forEach((output, outputIndex) => {
      const outputLocation = `${location}.outputs[${outputIndex}]`;
      if (!pathIsSafeRepositoryRelative(output.path, ".png")) {
        errors.push(
          `${outputLocation}.path must be a safe website-relative PNG path using forward slashes.`,
        );
      } else if (outputPaths.has(output.path)) {
        errors.push(`${outputLocation}.path duplicates ${output.path} for this asset.`);
      } else {
        outputPaths.add(output.path);
      }

      if (!Number.isInteger(output.width) || output.width <= 0) {
        errors.push(`${outputLocation}.width must be a positive integer.`);
      }
      if (!Number.isInteger(output.height) || output.height <= 0) {
        errors.push(`${outputLocation}.height must be a positive integer.`);
      }
    });

    normalizedAssets.push({
      assetId,
      kind: asset.kind,
      sourcePath,
      outputs,
      locale: asset.locale ?? null,
      altKey: asset.altKey ?? null,
      decorative: asset.decorative,
    });
  });

  if (requireCompleteInventory) {
    for (const [requiredAssetId, requiredAsset] of Object.entries(
      REQUIRED_ASSET_INVENTORY,
    )) {
      const declaredAsset = normalizedAssets.find(
        (asset) => asset.assetId === requiredAssetId,
      );

      if (!declaredAsset) {
        errors.push(`Required brand asset ${requiredAssetId} is missing from asset-manifest.json.`);
        continue;
      }

      if (declaredAsset.kind !== requiredAsset.kind) {
        errors.push(
          `${requiredAssetId}.kind must be ${requiredAsset.kind}; found ${declaredAsset.kind}.`,
        );
      }
      if (declaredAsset.sourcePath !== requiredAsset.sourcePath) {
        errors.push(
          `${requiredAssetId}.sourcePath must be ${requiredAsset.sourcePath}; found ${declaredAsset.sourcePath}.`,
        );
      }

      for (const requiredDimensions of requiredAsset.requiredOutputDimensions) {
        const matchingOutputs = declaredAsset.outputs.filter((output) =>
          dimensionsMatch(output, requiredDimensions),
        );
        if (matchingOutputs.length !== 1) {
          errors.push(
            `${requiredAssetId} must declare exactly one ${formatDimensions(
              requiredDimensions,
            )} PNG output; found ${matchingOutputs.length}.`,
          );
        }
      }
    }
  }

  const allOutputOwners = new Map();
  for (const asset of normalizedAssets) {
    for (const output of asset.outputs) {
      if (!output.path) {
        continue;
      }
      if (allOutputOwners.has(output.path)) {
        errors.push(
          `PNG output ${output.path} is declared by both ${allOutputOwners.get(output.path)} and ${asset.assetId}.`,
        );
      } else {
        allOutputOwners.set(output.path, asset.assetId);
      }
    }
  }

  return { assets: normalizedAssets, errors };
}

export function readPngDimensions(pngBuffer, label = "PNG output") {
  if (!Buffer.isBuffer(pngBuffer)) {
    throw new TypeError(`${label} must be provided as a Buffer.`);
  }
  if (pngBuffer.length < 24) {
    throw new Error(`${label} is too short to contain a PNG signature and IHDR chunk.`);
  }
  if (!pngBuffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    throw new Error(`${label} does not have the required PNG file signature.`);
  }
  if (pngBuffer.toString("ascii", 12, 16) !== "IHDR") {
    throw new Error(`${label} does not begin with a valid PNG IHDR chunk.`);
  }

  return {
    width: pngBuffer.readUInt32BE(16),
    height: pngBuffer.readUInt32BE(20),
  };
}

export function validateSvgSource(svgSource, label = "SVG source") {
  const sourceText = Buffer.isBuffer(svgSource)
    ? svgSource.toString("utf8")
    : String(svgSource);
  const errors = [];

  if (!/<svg\b/i.test(sourceText)) {
    errors.push(`${label} does not contain an SVG root element.`);
  }
  if (!/\bviewBox\s*=\s*["'][^"']+["']/i.test(sourceText)) {
    errors.push(`${label} must declare a viewBox for deterministic scaling.`);
  }
  if (/<script\b/i.test(sourceText)) {
    errors.push(`${label} must not contain scripts.`);
  }
  if (/(?:href|xlink:href)\s*=\s*["'](?:https?:)?\/\//i.test(sourceText)) {
    errors.push(`${label} must not reference remote linked resources.`);
  }
  if (/(?:url\(|@import\s+)[^)]*(?:https?:)?\/\//i.test(sourceText)) {
    errors.push(`${label} must not reference remote fonts, styles, or images.`);
  }

  return errors;
}

export function renderSvgToPng(svgSource, dimensions, label = "SVG source") {
  if (!Number.isInteger(dimensions.width) || !Number.isInteger(dimensions.height)) {
    throw new TypeError(`${label} requires integer width and height values.`);
  }

  const renderer = new Resvg(svgSource, {
    fitTo: {
      mode: "width",
      value: dimensions.width,
    },
  });
  const pngBuffer = renderer.render().asPng();
  const renderedDimensions = readPngDimensions(pngBuffer, label);

  if (!dimensionsMatch(renderedDimensions, dimensions)) {
    throw new Error(
      `${label} rendered at ${formatDimensions(
        renderedDimensions,
      )}, but the manifest requires ${formatDimensions(
        dimensions,
      )}. Ensure the SVG viewBox has the intended aspect ratio.`,
    );
  }

  return pngBuffer;
}

function resolvePathInsideWebsite(websiteRoot, relativePath, label) {
  const resolvedPath = path.resolve(websiteRoot, relativePath);
  const remainsInsideWebsite =
    resolvedPath === websiteRoot || resolvedPath.startsWith(`${websiteRoot}${path.sep}`);

  if (!remainsInsideWebsite) {
    throw new Error(`${label} resolves outside the website directory: ${relativePath}`);
  }

  return resolvedPath;
}

export async function loadAssetManifest(manifestPath) {
  let manifestSource;

  try {
    manifestSource = await readFile(manifestPath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        `Asset manifest is missing at ${manifestPath}. Create public/brand/asset-manifest.json before exporting assets.`,
      );
    }
    throw new Error(`Cannot read asset manifest ${manifestPath}: ${error.message}`);
  }

  try {
    return JSON.parse(manifestSource);
  } catch (error) {
    throw new Error(`Asset manifest ${manifestPath} is not valid JSON: ${error.message}`);
  }
}

export async function exportDeclaredAssets(options) {
  const websiteRoot = path.resolve(options.websiteRoot);
  const manifestPath = path.resolve(
    options.manifestPath ?? path.join(websiteRoot, "public", "brand", "asset-manifest.json"),
  );
  const manifest = options.manifest ?? (await loadAssetManifest(manifestPath));
  const validation = validateAssetManifest(manifest, {
    requireCompleteInventory: options.requireCompleteInventory ?? true,
  });

  if (validation.errors.length > 0) {
    throw new Error(
      `Asset manifest validation failed:\n${validation.errors.map((error) => `- ${error}`).join("\n")}`,
    );
  }

  const writtenOutputs = [];

  for (const asset of validation.assets) {
    const sourcePath = resolvePathInsideWebsite(
      websiteRoot,
      asset.sourcePath,
      `${asset.assetId}.sourcePath`,
    );
    let svgSource;
    try {
      // Resvg's native binding expects UTF-8 SVG text. Passing a Node Buffer can
      // be interpreted as opaque binary data by some platform builds.
      svgSource = await readFile(sourcePath, "utf8");
    } catch (error) {
      throw new Error(
        `Cannot read SVG source for ${asset.assetId} at ${sourcePath}: ${error.message}`,
      );
    }

    const svgErrors = validateSvgSource(svgSource, `${asset.assetId} (${asset.sourcePath})`);
    if (svgErrors.length > 0) {
      throw new Error(svgErrors.join("\n"));
    }

    if (asset.outputs.length === 0) {
      continue;
    }

    if (/<text\b/i.test(svgSource)) {
      throw new Error(
        `${asset.assetId} (${asset.sourcePath}) declares PNG outputs but contains SVG text. ` +
          "Use project-owned vector paths for rasterized lettering, or keep the asset SVG-only, " +
          "so exports do not depend on machine-specific fonts.",
      );
    }

    for (const output of asset.outputs) {
      const outputPath = resolvePathInsideWebsite(
        websiteRoot,
        output.path,
        `${asset.assetId} output`,
      );
      const pngBuffer = renderSvgToPng(
        svgSource,
        { width: output.width, height: output.height },
        `${asset.assetId} (${asset.sourcePath})`,
      );
      const temporaryOutputPath = `${outputPath}.tmp-${process.pid}`;

      await mkdir(path.dirname(outputPath), { recursive: true });
      try {
        await writeFile(temporaryOutputPath, pngBuffer);
        await rename(temporaryOutputPath, outputPath);
      } finally {
        await rm(temporaryOutputPath, { force: true });
      }

      writtenOutputs.push({
        assetId: asset.assetId,
        path: output.path,
        width: output.width,
        height: output.height,
        bytes: pngBuffer.length,
      });
    }
  }

  return writtenOutputs;
}

async function runCommandLine() {
  const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

  try {
    const writtenOutputs = await exportDeclaredAssets({ websiteRoot });
    console.log(`Exported ${writtenOutputs.length} deterministic PNG asset(s).`);
  } catch (error) {
    console.error(`Asset export failed: ${error.message}`);
    process.exitCode = 1;
  }
}

const invokedScriptPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedScriptPath === fileURLToPath(import.meta.url)) {
  await runCommandLine();
}
