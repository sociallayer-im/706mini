空内容承接。说明为什么为空与可采取的动作，不造假内容。

## 调用参数

`title,description,action:string; onPress:()=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"EmptyState",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置

- feed · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- discover · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- messages · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- me · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- manage · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- create-space · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- event · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- member · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- space · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- org · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- entity-events · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- entity-members · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- edit-entity · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- admins · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- edit-profile · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- relations · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- onboarding · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- calendar · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- spaces · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- campaign · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- campaign-edit · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- campaign-create · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- campaign-approval-detail · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- campaign-review-progress · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- event-access · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- activity-preview · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- publish · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- approvals · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- approval-detail · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- approval-progress · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- registrations · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- my-events · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- drafts · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- following · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- more · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- login · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- attendees · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- invitations · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- my-campaigns · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- privacy · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- feedback · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215
- review-lab · EmptyState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:215

实现：独立Web组件，未替换小程序。
