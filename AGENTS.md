# 分支与版本约束

本项目同时维护两个独立版本，必须遵守 [BRANCH-POLICY.md](BRANCH-POLICY.md)。

- `upgrade/stable-dependencies`：静态页面版本。
- `refactor/vue-element-plus`：Vue 3 + Element Plus 版本。
- 两个版本长期并存，Vue 版不是等待合并的临时重构分支。
- 禁止将这两个分支相互 merge、rebase 或创建以对方为目标的合并 PR。
- 禁止以 cherry-pick 整批迁移、reset、强制推送等方式用一个版本覆盖另一个版本。
- 禁止在完成开发、发布或清理时删除任何一个版本分支。
- 修改、提交和推送必须留在对应版本分支；提交前检查当前分支。
- 共同问题应分别分析并在各版本独立实现与验证，不自动跨分支同步。
- `master` 是原始基线，不自动将任何版本合并回 `master`。
- 只有用户明确修改这项分支策略，才能改变以上约束；普通的“提交”“推送”“完成重构”不构成变更授权。
