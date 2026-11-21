# Ubold Vue + Element Plus

分支约束：本版本在 `refactor/vue-element-plus` 独立维护，与静态版本
`upgrade/stable-dependencies` 长期并存，两个分支互不合并、互不覆盖、不得删除。
具体规则见 [双版本维护策略](../BRANCH-POLICY.md)。

独立的 Vue 3 重构版本。原 `HTML/` 和静态组件 `src/` 保留为迁移基线；新应用不加载旧页面、
jQuery、Bootstrap JavaScript 或兼容层，也不通过 iframe/v-html 包装原模板。

## 启动与构建

需要 Node.js 22.12+ 或兼容的更新 LTS（本次验证使用 Node.js 24.16.0）。

```sh
cd vue-app
npm ci --ignore-scripts
npm run dev
```

访问 `http://127.0.0.1:5173`。

```sh
npm run build     # vue-tsc 类型检查 + Vite 生产构建
npm run preview   # http://127.0.0.1:4174
npm test          # Vitest 单元/组件测试
npm run test:e2e  # Playwright 启动独立生产预览服务执行验收
```

浏览器验收前先构建；首次运行需 `npx playwright install chromium`。
可以通过 `PLAYWRIGHT_CHROMIUM_EXECUTABLE` 指定已安装的 Chromium 可执行文件。

## 目录职责

- `src/app/`：路由、导航目录、Pinia 布局状态。
- `src/layouts/`：后台、账户、独立页面布局。
- `src/components/`：公共导航、统计卡、表格、图表、富文本、文件选择、裁剪、向导和弹窗示例。
- `src/features/`：仪表盘、日历、CRM 联系人、电商、邮件业务组合。
- `src/pages/`：表单、UI、图标、地图、额外页面、账户和错误页等路由页面。
- `src/data/pages.json`：101 个旧地址、Vue 路由及原页面示例数据。39 组原表格数据被保留。
- `src/styles/`：主题变量、全局布局、响应式及打印样式。
- `public/assets/`：原项目图片、字体和独立图标字体 CSS。这里没有 Bootstrap UI 样式或旧运行脚本。

Element Plus 组件通过命名导入使用，构建插件按需加入组件样式。路由页面懒加载。
Chart.js 统一封装在 `ChartView.vue` 中，组件卸载时销毁图表。
FullCalendar 使用官方 Vue 3 集成及 Vue 管理的事件集合。

## 迁移边界

- 原 101 个 `.html` 地址重定向到对应 Vue 地址；完整映射见仓库根目录 `MIGRATION.md`。
- 旧图表库示例统一用 Chart.js 重建，旧富文本示例统一使用 Tiptap；不保留各旧插件的专有 API。
- Bootstrap 控件样式统一改为 Element Plus；布局和主题延续 Ubold 的青绿色、暗色顶栏和侧栏结构。
- 静态表格示例共用支持排序、筛选、分页和当前页选择的 Vue 表格。CRM/电商记录与可编辑表格提供本地增删改。
- 原布局、账户和错误页变体仍有各自入口；重复的结构通过共享组件和配置合并，不做像素级复刻。
- 图标目录保留原字体及图标类；新应用操作控件使用 Element Plus Icons。
- 日历、表格、联系人和个人资料修改保存在当前页面内存中；邮件草稿及邮件操作保存在 Pinia 会话中。
- 登录注册只验证表单，不认证、不创建账户、不发送找回邮件。可直接打开演示工作区。
- 文件选择和裁剪在本机完成；邮件只有草稿和预览；商品篮为预览，不下单、不支付。
- Google Maps 需要外部配置；未配置时显示明确说明，页面本身可以正常使用。世界矢量地图不依赖外部服务。

## Google Maps

将 `.env.example` 复制为 `.env.local`，配置 `VITE_GOOGLE_MAPS_API_KEY` 后重新构建。
需要启用 Maps Embed API，并将浏览器密钥限制到实际站点来源。`VITE_*` 值会出现在浏览器构建中，
不能存放服务端秘密。没有密钥时不会请求 Google Maps。

## 部署

仅部署 `dist/`。Vue Router 使用 History 模式，服务器需将未知路径回退到 `index.html`：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

静态资源正常按文件返回；旧 `.html` 地址不存在于构建目录，由 SPA 回退和路由重定向处理。
部署在域名子目录时，需要同时调整 Vite `base`、静态图片路径和服务器前缀；当前默认部署于域名根目录。

## 版本管理

依赖使用精确版本和独立锁文件。TypeScript 固定为 6.0.3：当前 `vue-tsc` 使用的 Volar peer 范围为 `<7`，
因此不强行安装不兼容的 TypeScript 7。运行 `npm ls --depth=0` 可检查实际依赖。
原静态工程与新 Vue 工程的 npm 命令在各自目录执行，不能混用构建输出。
