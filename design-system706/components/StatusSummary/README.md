结果摘要。待审/成功/失败要按业务事实输入；摘要本身不可点击。

## 调用参数

`title,description,state,action:string; compact:boolean; onPress:()=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"StatusSummary",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- onboarding · 新人引导 · StatusSummary语义需求 · miniprogram/templates/screen.wxml:160
- campaign-create · 创建专题 · StatusSummary语义需求 · miniprogram/templates/screen.wxml:160
- campaign-approval-detail · 专题审核详情 · StatusSummary语义需求 · miniprogram/templates/screen.wxml:147
- campaign-review-progress · 专题审核进度 · StatusSummary语义需求 · miniprogram/templates/screen.wxml:157
- event-access · ui-status-summary · miniprogram/templates/screen.wxml:130
- event-access · ui-status-summary · miniprogram/templates/screen.wxml:132
- publish · 发布活动 · StatusSummary语义需求 · miniprogram/templates/screen.wxml:160
- approval-detail · 活动审核详情 · StatusSummary语义需求 · miniprogram/templates/screen.wxml:147
- approval-progress · 活动审核进度 · StatusSummary语义需求 · miniprogram/templates/screen.wxml:157
- registrations · 我报名的活动 · StatusSummary语义需求 · miniprogram/templates/screen.wxml:194
- my-campaigns · 我的专题 · StatusSummary语义需求 · miniprogram/templates/screen.wxml:203

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
