只读状态标签。不绑定点击；必须有状态文字，不与FilterChip混用。

## 调用参数

`label:string`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"Badge",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- event · 活动详情 · Badge语义需求 · miniprogram/templates/screen.wxml:74
- member · 成员主页 · Badge语义需求 · miniprogram/templates/screen.wxml:105
- admins · 管理员 · Badge语义需求 · miniprogram/templates/screen.wxml:193
- activity-preview · 活动预览 · Badge语义需求 · miniprogram/templates/screen.wxml:74
- approvals · 审核待办 · Badge语义需求 · miniprogram/templates/screen.wxml:207
- attendees · 报名管理 · Badge语义需求 · miniprogram/templates/screen.wxml:207
- invitations · 管理邀请 · Badge语义需求 · miniprogram/templates/screen.wxml:207

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
