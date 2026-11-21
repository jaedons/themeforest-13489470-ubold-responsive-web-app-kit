# 组件划分与开发指南

项目保持 HTML + Bootstrap + jQuery 的技术栈，采用**构建时组件组合**。
组件在构建时展开成完整 HTML，不增加浏览器端请求，也不改变原页面 URL。

## 目录与职责

```text
src/
  components.json                 组件注册、默认参数
  pages.json                      101 个页面的输入/输出映射及 5 个脚本的输出映射
  components/
    layout/                       公共布局及侧栏行为
      topbar.html                 顶栏（标准/紧凑参数）
      sidebar.html                默认左侧导航
      sidebar-profile.html        带用户信息的导航变体
      sidebar-compact.html        紧凑导航变体
      rightbar.html               右侧聊天栏
      footer.html                 页脚（对齐参数）
      shell.js                    侧栏、全屏和窗口尺寸行为
    runtime/                      依赖加载顺序与旧插件兼容边界
      styles.html
      scripts.html
      theme-scripts.html
      legacy-compat.js
    ui/
      plugins.js                  公共 UI 插件初始化
    dashboard/
      stat-card.html              参数化统计卡片
  features/
    calendar/calendar.js          日历模块行为
    charts/chartjs.js             Chart.js 模块行为
  pages/                          按业务模块组织的页面模板
    dashboard/                    仪表盘
    applications/                 日历、邮件、联系人
    crm/                          CRM
    ecommerce/                    电商
    charts/ forms/ tables/ ui/     图表、表单、表格、基础 UI
    authentication/ errors/       登录注册、错误页
    layouts/ extras/ icons/ maps/ examples/
HTML/                             可直接部署的页面与资源
scripts/build-pages.mjs            构建和输出同步检查
scripts/component-renderer.mjs     组件组合与参数转义
scripts/dev.mjs                    监听源文件并重建
```

共抽取 **10 个 HTML 公共组件**。其中 85 页共用默认侧栏，2 页使用侧栏变体；
87 页共用顶栏、右侧聊天栏和页脚；101 页共用资源引用；12 张统计卡片共用同一模板。
其余页面主体按模块保留，避免将每个一次性演示区域都拆成难以维护的小组件。

## 常用命令

```sh
npm run build:pages       # 展开组件并同步应用脚本到原静态路径
npm run build            # 构建页面和 LESS 样式
npm run dev              # http://127.0.0.1:4173，监听 src/；保存后刷新浏览器
npm start                # 启动前构建一次，再提供静态页面
npm test                 # 输出同步、组件测试及原静态校验
npm run test:browser     # 页面巡检
npm run test:interaction # 主要交互验证
```

依赖未安装时先运行 `npm ci --ignore-scripts`。首次浏览器测试需运行
`npx playwright install chromium`，或配置已有的 `PLAYWRIGHT_BROWSERS_PATH`。
`npm run dev` 监听源文件并重建，不自动刷新浏览器、不自动编译 LESS。
样式修改后运行 `npm run build:css`。

## 使用组件

编辑 `src/pages/` 下的页面模板，使用注释指令引用组件：

```html
<!-- @component layout/topbar -->
<!-- @component layout/footer {"alignment":" text-right"} -->
<!-- @component dashboard/stat-card {"tone":"info","icon":"md md-attach-money","value":"31,570","label":"Total Revenue"} -->
```

组件文件使用 `{{参数名}}` 或 `{{嵌套.参数名}}`。所有值进行 HTML 转义，
不会作为 HTML、JavaScript 或另一个组件指令执行。省略的可选值使用注册表默认值。
未注册组件、缺失参数、无效指令和循环引用会阻止构建；构建在写入前先验证全部源文件。

### 导航选中状态

```html
<!-- @component layout/sidebar {"nav":{"group-apps":" active","page-apps-calendar":" active"}} -->
```

页面只提供选中的分组与链接。其他导航状态来自组件注册表中的空值默认参数。
新增菜单链接时，在侧栏组件中添加对应占位符，并在 `src/components.json` 的
`defaults.nav` 中增加默认空字符串。三个导航变体各自维护，避免互相改变布局。

### 新增页面或组件

1. 在合适的 `src/pages/<模块>/` 下创建完整页面模板，可参考 `layouts/page-starter.html`。
2. 在 `src/pages.json` 中登记 `source`、`output` 和 `module`；输出仍为 `HTML/<名称>.html`。
3. 新增复用组件时创建 `src/components/<分类>/<名称>.html`，并在 `src/components.json`
   中登记 `source` 和可选的 `defaults`。
4. 执行 `npm run build:pages` 和 `npm test`，检查实际使用组件的页面。

不要直接修改生成的 HTML 或已登记输出映射的 5 个 JavaScript 文件；下一次构建会覆盖它们。
其他第三方库仍由 `npm run vendor` 管理，样式源码仍为现有 LESS。
`Documentation/` 和 `HTML/email-templates/` 的原文档、独立邮件模板保持原维护方式。

## 本次验证范围

迁移前后对 101 页的标签结构、属性和非空文本进行了规范化比对，结果一致。
比对忽略注释、格式化空白和空的 class 属性。另提供组件参数转义、嵌套合成、错误处理、
路由完整性和重复构建一致性测试。原有浏览器巡检与主要交互测试继续适用。
Google Maps 演示需要外部 API，离线巡检跳过，不计作通过。
