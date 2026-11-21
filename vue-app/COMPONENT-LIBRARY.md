# 公共组件库接入记录

独立项目位于同级 `admin-ui/`，初始化为独立本地 Git 仓库（main）。
消费端保持在 `refactor/vue-element-plus`；静态分支未修改，无 merge/rebase/cherry-pick。

## 使用方式

依赖固定为 `@jaedons/admin-ui@0.1.0` 的本地 tgz，存放于 vendor/，并由锁文件记录完整性。
库源码不是运行依赖；新机器从本仓库 npm ci 即可构建 Vue 版。

- SectionCard、DataTable：页面直接从包导入，原本地实现已移除。
- StatCard：由薄适配层将原数字 icon 属性映射到组件库 icon 插槽。
- DataRow、TableColumn：从组件库统一导出，避免消费方类型重复定义。
- main.ts：统一加载 Element Plus 基础样式、暗色变量、组件库样式，再加载应用样式。
- 应用保留自身主题、图标和布局覆盖；组件库独立文档页面不加载这些样式。

## 更新步骤（PowerShell）

在组件库项目执行：

```powershell
npm ci --ignore-scripts
npm run pack:local
npm test
npm run build:docs
```

修改发布包内容时提升组件库版本号，并复制对应 tgz 到本项目 vendor/，随后执行：

```powershell
npm install ./vendor/jaedons-admin-ui-0.1.0.tgz --ignore-scripts
npm run build
npm test
npm run test:e2e
```

示例文件名适用于首批 0.1.0；更新时替换为新版本。暂不发布 npm，也不自动推送任何仓库。

## 本批验证

- 独立库：ESM 构建、类型声明、8 项组件测试、文档站构建通过。
- 真实 tgz 接入：Vue 构建、9 项单元测试、120 项浏览器回归通过。
- 独立文档：桌面/390px 手机视口核验，编辑事件、空状态已验证，无页面级横向溢出。
- 组件库 private=true，Vue/Element Plus 作为 peer dependencies；没有路由、Pinia、图片和字体依赖。
