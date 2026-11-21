# Vue + Element Plus 迁移清单

## 分支与基线

- 当前静态组件化工作已保存为提交 `2274a4b`。
- Vue 重构分支：`refactor/vue-element-plus`。
- 新应用位于 `vue-app/`，原 `HTML/`、静态组件源码及旧工具保留为回退基线。
- 开发、构建和部署方式见 [vue-app/README.md](vue-app/README.md)。

## 覆盖与实现策略

原 101 个 HTML 入口全部映射至 Vue 路由，按 17 个原模块组织导航。
页面使用真实 Vue 组件，不加载原页面、不注入原 HTML、不运行 jQuery 或 Bootstrap JS。
原表格和图标示例数据按页收录在 `vue-app/src/data/pages.json`，公共结构和操作由 Element Plus 组件组合实现。

这是功能与信息结构迁移，不是旧插件 API 或像素级样式复刻：

- Bootstrap 的按钮、表单、表格、弹窗、标签页等统一改为 Element Plus。
- Morris/Flot/C3/Chartist/NVD3/Peity 等图表演示统一为 Chart.js 实现；示例图表类型按路由配置。
- Summernote/TinyMCE 演示统一为 Tiptap，旧拖拽排序统一为 Element Plus Tree，旧滚动插件退出新应用。
- 布局变体、账户变体和同类控件演示通过共享布局与配置收敛，每个原入口仍可访问。
- 邮件、业务表格、商品、联系人、日历等沿用演示性质，没有新增后台接口或真实认证。
- Google Maps 保留显式配置入口；没有外部密钥时说明缺失配置，不伪造地图或连接成功。

## 路由映射

| 原入口 | Vue 地址 | 实现归属 |
| --- | --- | --- |
| `/apps-calendar.html` | `/apps/calendar` | FullCalendar Vue + Element Plus 事件编辑 |
| `/apps-contact.html` | `/apps/contacts` | 联系人卡片与新增表单 |
| `/apps-email-compose.html` | `/mail/compose` | Pinia 邮件示例与草稿预览 |
| `/apps-email-read.html` | `/mail/read` | Pinia 邮件示例与草稿预览 |
| `/apps-inbox.html` | `/mail/inbox` | Pinia 邮件示例与草稿预览 |
| `/chart-c3.html` | `/charts/c3` | Chart.js Vue 生命周期组件 |
| `/chart-chartist.html` | `/charts/chartist` | Chart.js Vue 生命周期组件 |
| `/chart-chartjs.html` | `/charts/chartjs` | Chart.js Vue 生命周期组件 |
| `/chart-flot.html` | `/charts/flot` | Chart.js Vue 生命周期组件 |
| `/chart-morris.html` | `/charts/morris` | Chart.js Vue 生命周期组件 |
| `/chart-nvd3.html` | `/charts/nvd3` | Chart.js Vue 生命周期组件 |
| `/chart-other.html` | `/charts/other` | Chart.js Vue 生命周期组件 |
| `/chart-peity.html` | `/charts/peity` | Chart.js Vue 生命周期组件 |
| `/chart-radial.html` | `/charts/radial` | Chart.js Vue 生命周期组件 |
| `/chart-sparkline.html` | `/charts/sparkline` | Chart.js Vue 生命周期组件 |
| `/components-animation.html` | `/examples/animation` | Element Plus 控件与示例组合 |
| `/components-grid.html` | `/examples/grid` | Element Plus 控件与示例组合 |
| `/components-nestable-list.html` | `/examples/nestable-list` | Element Plus 控件与示例组合 |
| `/components-range-sliders.html` | `/examples/range-sliders` | Element Plus 控件与示例组合 |
| `/components-sweet-alert.html` | `/examples/sweet-alert` | Element Plus 控件与示例组合 |
| `/components-widgets.html` | `/examples/widgets` | Element Plus 控件与示例组合 |
| `/crm-contact.html` | `/crm/contact` | 联系人卡片与新增表单 |
| `/crm-customers.html` | `/crm/customers` | Element Plus 表格与记录编辑 |
| `/crm-dashboard.html` | `/crm/dashboard` | 仪表盘与统计组件 |
| `/crm-leads.html` | `/crm/leads` | Element Plus 表格与记录编辑 |
| `/crm-opportunities.html` | `/crm/opportunities` | Element Plus 表格与记录编辑 |
| `/dashboard_2.html` | `/dashboard/analytics` | 仪表盘与统计组件 |
| `/dashboard_3.html` | `/dashboard/performance` | 仪表盘与统计组件 |
| `/ecommerce-dashboard.html` | `/ecommerce/dashboard` | 仪表盘与统计组件 |
| `/ecommerce-orders.html` | `/ecommerce/orders` | Element Plus 表格与记录编辑 |
| `/ecommerce-product-detail.html` | `/ecommerce/product-detail` | 商品表单与 Tiptap 编辑器 |
| `/ecommerce-products.html` | `/ecommerce/products` | 商品目录、筛选和本地预览篮 |
| `/ecommerce-sellers.html` | `/ecommerce/sellers` | Element Plus 表格与记录编辑 |
| `/extra-coming-soon.html` | `/extras/coming-soon` | 资料、FAQ、画廊、发票等 Vue 页面 |
| `/extra-email-template.html` | `/extras/email-template` | 资料、FAQ、画廊、发票等 Vue 页面 |
| `/extra-faq.html` | `/extras/faq` | 资料、FAQ、画廊、发票等 Vue 页面 |
| `/extra-gallery.html` | `/extras/gallery` | 资料、FAQ、画廊、发票等 Vue 页面 |
| `/extra-invoice.html` | `/extras/invoice` | 资料、FAQ、画廊、发票等 Vue 页面 |
| `/extra-maintenance.html` | `/extras/maintenance` | 资料、FAQ、画廊、发票等 Vue 页面 |
| `/extra-pricing.html` | `/extras/pricing` | 资料、FAQ、画廊、发票等 Vue 页面 |
| `/extra-profile.html` | `/extras/profile` | 资料、FAQ、画廊、发票等 Vue 页面 |
| `/extra-search-result.html` | `/extras/search-result` | 资料、FAQ、画廊、发票等 Vue 页面 |
| `/extra-sitemap.html` | `/extras/sitemap` | 资料、FAQ、画廊、发票等 Vue 页面 |
| `/extra-timeline.html` | `/extras/timeline` | 资料、FAQ、画廊、发票等 Vue 页面 |
| `/form-advanced.html` | `/forms/advanced` | Element Plus 表单及专用输入组件 |
| `/form-elements.html` | `/forms/elements` | Element Plus 表单及专用输入组件 |
| `/form-image-crop.html` | `/forms/image-crop` | Element Plus 表单及专用输入组件 |
| `/form-mask.html` | `/forms/mask` | Element Plus 表单及专用输入组件 |
| `/form-pickers.html` | `/forms/pickers` | Element Plus 表单及专用输入组件 |
| `/form-summernote.html` | `/forms/summernote` | Element Plus 表单及专用输入组件 |
| `/form-uploads.html` | `/forms/uploads` | Element Plus 表单及专用输入组件 |
| `/form-validation.html` | `/forms/validation` | Element Plus 表单及专用输入组件 |
| `/form-wizard.html` | `/forms/wizard` | Element Plus 表单及专用输入组件 |
| `/form-wysiwig.html` | `/forms/wysiwig` | Element Plus 表单及专用输入组件 |
| `/form-xeditable.html` | `/forms/xeditable` | Element Plus 表单及专用输入组件 |
| `/icons-fontawesome.html` | `/icons/fontawesome` | Vue 图标目录 + 原字体资源 |
| `/icons-glyphicons.html` | `/icons/glyphicons` | Vue 图标目录 + 原字体资源 |
| `/icons-ionicons.html` | `/icons/ionicons` | Vue 图标目录 + 原字体资源 |
| `/icons-materialdesign.html` | `/icons/materialdesign` | Vue 图标目录 + 原字体资源 |
| `/icons-simple-line.html` | `/icons/simple-line` | Vue 图标目录 + 原字体资源 |
| `/icons-themifyicon.html` | `/icons/themifyicon` | Vue 图标目录 + 原字体资源 |
| `/icons-weather.html` | `/icons/weather` | Vue 图标目录 + 原字体资源 |
| `/index.html` | `/dashboard` | 仪表盘与统计组件 |
| `/layout-header_2.html` | `/layouts/header-2` | 共享响应式布局配置 |
| `/layout-leftbar_2.html` | `/layouts/leftbar-2` | 共享响应式布局配置 |
| `/layout-menu-collapsed.html` | `/layouts/menu-collapsed` | 共享响应式布局配置 |
| `/layout-menu-small.html` | `/layouts/menu-small` | 共享响应式布局配置 |
| `/map-google.html` | `/maps/google` | 本地世界地图 / 可配置 Google Maps |
| `/map-vector.html` | `/maps/vector` | 本地世界地图 / 可配置 Google Maps |
| `/page-400.html` | `/errors/400` | 错误状态与恢复入口 |
| `/page-403.html` | `/errors/403` | 错误状态与恢复入口 |
| `/page-404.html` | `/errors/404` | 错误状态与恢复入口 |
| `/page-404_alt.html` | `/errors/404-alt` | 错误状态与恢复入口 |
| `/page-500.html` | `/errors/500` | 错误状态与恢复入口 |
| `/page-503.html` | `/errors/503` | 错误状态与恢复入口 |
| `/page-lock-screen.html` | `/account/lock` | 账户表单本地校验 |
| `/page-login-v2.html` | `/account/login-v2` | 账户表单本地校验 |
| `/page-login.html` | `/login` | 账户表单本地校验 |
| `/page-recoverpw.html` | `/account/recover` | 账户表单本地校验 |
| `/page-register-v2.html` | `/account/register-v2` | 账户表单本地校验 |
| `/page-register.html` | `/register` | 账户表单本地校验 |
| `/page-signup-signin.html` | `/account/access` | 账户表单本地校验 |
| `/page-starter.html` | `/layouts/starter` | 共享响应式布局配置 |
| `/tables-basic.html` | `/tables/basic` | Element Plus 表格与记录编辑 |
| `/tables-bootstrap.html` | `/tables/bootstrap` | Element Plus 表格与记录编辑 |
| `/tables-datatable.html` | `/tables/datatable` | Element Plus 表格与记录编辑 |
| `/tables-editable.html` | `/tables/editable` | Element Plus 表格与记录编辑 |
| `/tables-foo-tables.html` | `/tables/foo-tables` | Element Plus 表格与记录编辑 |
| `/tables-responsive.html` | `/tables/responsive` | Element Plus 表格与记录编辑 |
| `/ui-bootstrap.html` | `/ui/bootstrap` | Element Plus 控件与示例组合 |
| `/ui-buttons.html` | `/ui/buttons` | Element Plus 控件与示例组合 |
| `/ui-carousel.html` | `/ui/carousel` | Element Plus 控件与示例组合 |
| `/ui-checkbox-radio.html` | `/ui/checkbox-radio` | Element Plus 控件与示例组合 |
| `/ui-images.html` | `/ui/images` | Element Plus 控件与示例组合 |
| `/ui-modals.html` | `/ui/modals` | Element Plus 控件与示例组合 |
| `/ui-notification.html` | `/ui/notification` | Element Plus 控件与示例组合 |
| `/ui-panels.html` | `/ui/panels` | Element Plus 控件与示例组合 |
| `/ui-portlets.html` | `/ui/portlets` | Element Plus 控件与示例组合 |
| `/ui-progressbars.html` | `/ui/progressbars` | Element Plus 控件与示例组合 |
| `/ui-tabs.html` | `/ui/tabs` | Element Plus 控件与示例组合 |
| `/ui-typography.html` | `/ui/typography` | Element Plus 控件与示例组合 |

## 验证入口

在 `vue-app/` 中运行 `npm test`、`npm run build`、`npm run test:e2e`。
浏览器套件覆盖全部旧入口的重定向、未知路由恢复、无旧运行库加载，以及主要交互。
Google Maps 的页面说明可以离线验证，实际外部地图加载需要有效的 API 配置和网络。
