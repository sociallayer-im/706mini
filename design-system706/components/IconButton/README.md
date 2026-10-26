图标按钮。必须提供可读label；返回/关闭复用真实本地图标。

## 调用参数

`icon:string; label:string; size:number; surface:surface|plain|glass; disabled:boolean; onPress:()=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"IconButton",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- feed · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- discover · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- messages · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- me · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- manage · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- create-space · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- event · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- member · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- space · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- org · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- entity-events · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- entity-members · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- edit-entity · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- admins · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- edit-profile · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- relations · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- onboarding · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- calendar · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- spaces · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- campaign · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- campaign-edit · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- campaign-create · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- campaign-approval-detail · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- campaign-review-progress · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- event-access · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- activity-preview · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- publish · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- approvals · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- approval-detail · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- approval-progress · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- registrations · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- my-events · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- drafts · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- following · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- more · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- login · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- attendees · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- invitations · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- my-campaigns · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- privacy · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- feedback · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24
- review-lab · IconButton · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:24

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
