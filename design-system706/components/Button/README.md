动作按钮。执行单一动作；主按钮一组最多一个。点击区与可见面分开，loading保留底色并阻止重复。align:start用于正文左缘文字操作，保留44px透明点击区。

## 调用参数

`label:string; variant:primary|secondary|text|danger|selected; compact,block,disabled,loading:boolean; align:center|start; onPress:()=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"Button",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置

- feed · 关注 · Button语义需求 · miniprogram/templates/screen.wxml:31
- discover · 发现 · Button语义需求 · miniprogram/templates/screen.wxml:39
- me · 我的 · Button语义需求 · miniprogram/templates/screen.wxml:55
- create-space · 创建空间 · Button语义需求 · miniprogram/templates/screen.wxml:160
- event · row event-secondary-actions · miniprogram/templates/screen.wxml:87
- event · section event-discussion · miniprogram/templates/screen.wxml:88
- member · 成员主页 · Button语义需求 · miniprogram/templates/screen.wxml:105
- space · 空间主页 · Button语义需求 · miniprogram/templates/screen.wxml:113
- org · 组织主页 · Button语义需求 · miniprogram/templates/screen.wxml:113
- edit-entity · 编辑实体 · Button语义需求 · miniprogram/templates/screen.wxml:160
- admins · 管理员 · Button语义需求 · miniprogram/templates/screen.wxml:193
- edit-profile · 编辑资料 · Button语义需求 · miniprogram/templates/screen.wxml:160
- onboarding · 新人引导 · Button语义需求 · miniprogram/templates/screen.wxml:160
- calendar · 活动日历 · Button语义需求 · miniprogram/templates/screen.wxml:39
- campaign · 专题详情 · Button语义需求 · miniprogram/templates/screen.wxml:100
- campaign-edit · 编辑专题 · Button语义需求 · miniprogram/templates/screen.wxml:160
- campaign-create · 创建专题 · Button语义需求 · miniprogram/templates/screen.wxml:160
- campaign-approval-detail · 专题审核详情 · Button语义需求 · miniprogram/templates/screen.wxml:147
- campaign-review-progress · 专题审核进度 · Button语义需求 · miniprogram/templates/screen.wxml:157
- event-access · 参与方式 · Button语义需求 · miniprogram/templates/screen.wxml:129
- publish · 发布活动 · Button语义需求 · miniprogram/templates/screen.wxml:160
- approval-detail · 活动审核详情 · Button语义需求 · miniprogram/templates/screen.wxml:147
- approval-progress · 活动审核进度 · Button语义需求 · miniprogram/templates/screen.wxml:157
- registrations · 我报名的活动 · Button语义需求 · miniprogram/templates/screen.wxml:194
- my-events · 我发起的活动 · Button语义需求 · miniprogram/templates/screen.wxml:194
- drafts · 草稿 · Button语义需求 · miniprogram/templates/screen.wxml:202
- more · 更多设置 · Button语义需求 · miniprogram/templates/screen.wxml:66
- login · 登录 · Button语义需求 · miniprogram/templates/screen.wxml:190
- attendees · 报名管理 · Button语义需求 · miniprogram/templates/screen.wxml:207
- invitations · 管理邀请 · Button语义需求 · miniprogram/templates/screen.wxml:207
- my-campaigns · 我的专题 · Button语义需求 · miniprogram/templates/screen.wxml:203
- feedback · 反馈 · Button语义需求 · miniprogram/templates/screen.wxml:192
- review-lab · 开发者目录 · Button语义需求 · miniprogram/templates/screen.wxml:26

实现：独立Web组件，未替换小程序。
