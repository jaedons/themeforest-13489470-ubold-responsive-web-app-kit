# 稳定版本升级（2026-11-03）

分支：`upgrade/stable-dependencies`。范围：原 Ubold 模板；旁边的 PlainAdmin 项目未修改。

## 核心运行依赖

| 依赖 | 原版本 | 本次锁定版本 |
| --- | --- | --- |
| Bootstrap | 3.3.5 | 5.3.8（包含 Popper 的 bundle） |
| jQuery | 2.1.4 | 4.0.0 |
| jQuery Migrate | 未使用 | 4.0.2 |
| Chart.js | 旧式 v1 API | 4.6.1 |
| FullCalendar | 旧式 jQuery API | 7.1.3 |
| Moment.js | 原内置版本 | 2.31.0 |
| jQuery UI | 原内置版本 | 1.13.3（npm jquery-ui-dist 的 latest） |
| Less 编译器 | 未锁定 | 4.9.1 |

版本来源为升级时 npm 官方仓库的 `latest` 标签，不安装 alpha/beta/rc。
完整版本及构建工具见 `DEPENDENCIES.json`，可复现安装见 `package-lock.json`。
Sass 1.107.1、Gulp 5.0.1 等工具已经锁定；现有 Ubold 样式仍由 Less 编译。

## 使用

需要 Node.js（本次验证环境为 24.16.0）和 npm。

```sh
npm ci --ignore-scripts
npm run vendor
npm run build:css
npm test
npm start
```

访问 `http://127.0.0.1:4173`。分发时仍可仅部署 `HTML`，不依赖生产服务器安装 Node.js。
`vendor` 从锁定的 npm 包复制依赖到原静态资源路径，并保留许可证。
Less 构建保留 Google Fonts 的 CSS 引用，编译过程不需要访问字体服务。

## 迁移方式

- 全部模板页面迁移至 Bootstrap 5 的 `data-bs-*` 属性，折叠面板的 `in` 状态改为 `show`。
- Bootstrap 3 的布局、标签、面板等已移除样式由 `legacy-layout.css` 保留；只运行 Bootstrap 5 的 JavaScript。
- `legacy-compat.js` 和官方 Migrate 保留旧插件所需的少量 jQuery 接口，并适配同步初始化的 Bootstrap 调用。
- Chart.js 使用新版配置和响应式 API，避免旧代码在 resize 时重复创建图表。
- FullCalendar 改为新版原生 API，支持视图切换、外部拖入、日期选择、新建、编辑和删除事件。
- 修复 Waypoints 对 window 调用 offset 的问题，以及页面中的旧 load 事件写法。
- 移动布局直接初始化尺寸状态，不依赖 body resize 事件冒泡。

`scripts/migrate.mjs` 是早期依赖升级的一次性迁移工具，从仓库原始提交提取已移除的布局规则。
组件化后应编辑 `src/` 中的页面和应用脚本源码，再执行 `npm run build:pages`。
完整构建可运行 `npm run build`；公共组件和输出路径说明见 [COMPONENTS.md](COMPONENTS.md)。

## 验证

```sh
npx playwright install chromium
npm run test:browser
npm run test:interaction
```

- 静态校验：锁文件版本、核心分发文件一致性、页面引用顺序和新语法。
- 浏览器校验：遍历 101 个顶层页面；Google Maps 演示由于依赖外部 API 单独跳过。
- 交互校验：侧栏、下拉菜单、弹窗、标签页、日历增删改、移动侧栏。
- 测试报告及桌面/移动截图输出至被 Git 忽略的 `test-results/`。

## 边界

这次升级的是核心技术依赖，并非对 `assets/plugins` 中所有历史插件的全量换代。
其他图表库、编辑器、表单插件暂保留原分发版本，通过兼容层维持原演示功能。
原目录中未被页面引用的历史插件源码/分发文件仍可能包含旧版本。
浏览器巡检检查页面加载时未捕获异常，不代表每个第三方组件的全部功能都已覆盖。
Google 地图演示仍需可用的外部 Maps API 配置；字体服务被阻断时使用系统回退字体。
日历事件与原模板一样只保存在当前页面内存中，刷新后恢复示例数据。
