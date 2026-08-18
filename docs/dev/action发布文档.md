# OryxOS 官网 GitHub Actions 发布说明

## 1. 发布信息

- 官网地址：<https://ki9i9.github.io/oryxos/>
- 中文地址：<https://ki9i9.github.io/oryxos/zh/>
- 开发分支：`learn-class-14`
- 发布分支：`learn-main`
- 发布 Workflow：`.github/workflows/website-pages.yml`
- 验证 Workflow：`.github/workflows/website-ci.yml`

OryxOS 使用 GitHub Pages 项目站点 `/oryxos/`，不会覆盖位于
<https://ki9i9.github.io/> 的个人博客。需要避免个人博客自行占用 `/oryxos/` 路径。

## 2. 仓库一次性配置

### GitHub Pages

进入仓库的：

```text
Settings -> Pages -> Build and deployment
```

将 Source 设置为：

```text
GitHub Actions
```

不需要配置 Jekyll、Static HTML、`gh-pages` 分支或自定义域名。

### Deployment Environment

进入：

```text
Settings -> Environments -> github-pages
```

在 **Deployment branches and tags** 中选择：

```text
Selected branches and tags
```

添加允许部署的分支：

```text
learn-main
```

如果启用了 Required reviewers，每次部署都需要人工批准；如需全自动发布，应关闭该规则。

## 3. 日常发布流程

1. 在 `learn-class-14` 开发并提交修改。
2. 推送开发分支：

   ```bash
   git push origin learn-class-14
   ```

3. 创建 Pull Request，必须使用以下方向：

   ```text
   base: learn-main
   compare: learn-class-14
   ```

4. 等待 `Validate website` 验证通过。
5. 将 Pull Request 合并到 `learn-main`。
6. 合并后自动运行：
   - `Validate website | push | learn-main`
   - `Publish website | learn-main | run <number>`
7. 确认发布 Workflow 的三个 Job 全部成功：
   - `Build and validate website`
   - `Deploy GitHub Pages`
   - `Verify published website`
8. 访问英文和中文地址确认页面正常。

## 4. Workflow 分工

### Validate website

- 在开发分支 Push、Pull Request 和发布分支 Push 时运行。
- 执行完整的 `npm run test:quality`。
- 安装 Chromium 并运行 Playwright E2E。
- 只负责验证，没有 Pages 部署权限。

### Publish OryxOS website

- 只在相关修改进入 `learn-main` 时自动运行，也支持手动运行。
- 执行无浏览器的 `npm run test:publish` 静态发布门禁。
- 上传 `website/.vitepress/dist` 并部署到 GitHub Pages。
- 部署后检查英文和中文首页。

## 5. 本地验证

完整验证，包括 Chromium E2E：

```bash
cd website
nvm use 24.11.0
npm ci
npx playwright install --with-deps chromium
npm run test:quality
```

只验证发布所需的静态构建：

```bash
cd website
nvm use 24.11.0
npm ci
npm run test:publish
```

## 6. 常见问题

### `There isn't anything to compare`

检查 Pull Request 方向是否反了，并确认开发分支已经推送：

```text
base: learn-main
compare: learn-class-14
```

### `Get Pages site failed: Not Found`

进入 `Settings -> Pages`，确认 Source 已设置为 `GitHub Actions`。

### `Branch "learn-main" is not allowed to deploy`

进入 `Settings -> Environments -> github-pages`，将 `learn-main` 加入允许部署的分支。

### 为什么一次合并会出现多个 Action？

开发分支 Push、Pull Request、合并后的 `learn-main` Push 都会分别触发验证；此外，
`learn-main` 还会单独触发 Pages 发布。只有 `Publish OryxOS website` 会部署官网。

### 如何重新发布？

可以在失败的 Workflow 中选择：

```text
Re-run jobs -> Re-run failed jobs
```

也可以在 Actions 页面手动运行 `Publish OryxOS website`。
