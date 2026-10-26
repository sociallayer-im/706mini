活动邀请卡。活动自身状态与个人报名状态分开；海报3:4，点击图可独立预览。

## 调用参数

`title,status,date,venue,host,fee,cover:string; large:boolean; onOpen:()=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"EventCard",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- feed · feed-entry · miniprogram/templates/screen.wxml:199
- discover · 发现 · EventCard语义需求 · miniprogram/templates/screen.wxml:39
- event · 活动详情 · EventCard语义需求 · miniprogram/templates/screen.wxml:74
- member · is="eventCard" · miniprogram/templates/screen.wxml:205
- space · 空间主页 · EventCard语义需求 · miniprogram/templates/screen.wxml:113
- org · 组织主页 · EventCard语义需求 · miniprogram/templates/screen.wxml:113
- entity-events · 全部活动 · EventCard语义需求 · miniprogram/templates/screen.wxml:205
- calendar · is="eventCard" · miniprogram/templates/screen.wxml:205
- campaign · is="eventCard" · miniprogram/templates/screen.wxml:205
- campaign-create · hero-title · miniprogram/templates/screen.wxml:184
- campaign-approval-detail · 专题审核详情 · EventCard语义需求 · miniprogram/templates/screen.wxml:147
- activity-preview · 活动预览 · EventCard语义需求 · miniprogram/templates/screen.wxml:74
- publish · hero-title · miniprogram/templates/screen.wxml:184
- approval-detail · 活动审核详情 · EventCard语义需求 · miniprogram/templates/screen.wxml:147
- registrations · 我报名的活动 · EventCard语义需求 · miniprogram/templates/screen.wxml:194
- my-events · 我发起的活动 · EventCard语义需求 · miniprogram/templates/screen.wxml:194
- drafts · 草稿 · EventCard语义需求 · miniprogram/templates/screen.wxml:202

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
