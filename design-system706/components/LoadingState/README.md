加载状态。初载骨架；刷新保留内容，仅给轻量说明；减少动态偏好关闭动画。

## 调用参数

`refresh:boolean`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"LoadingState",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- feed · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- discover · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- messages · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- me · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- manage · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- create-space · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- event · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- member · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- space · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- org · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- entity-events · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- entity-members · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- edit-entity · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- admins · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- edit-profile · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- relations · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- onboarding · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- calendar · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- spaces · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- campaign · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- campaign-edit · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- campaign-create · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- campaign-approval-detail · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- campaign-review-progress · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- event-access · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- activity-preview · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- publish · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- approvals · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- approval-detail · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- approval-progress · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- registrations · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- my-events · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- drafts · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- following · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- more · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- login · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- attendees · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- invitations · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- my-campaigns · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- privacy · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- feedback · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30
- review-lab · LoadingState · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:30

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
