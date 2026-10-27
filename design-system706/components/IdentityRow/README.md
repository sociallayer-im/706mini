身份行。组合Avatar与文字：整行width100%，navigation将箭头置于最右，头像与姓名左侧相邻；kind/type标识实际个人/空间/组织，空元信息过滤后join。文字组沿头像垂直居中，名称typeSection、辅助说明typeBody，两行间spaceUnit、图文间identityGap；全局卡片与主页复用，不附加无依据的身份或活跃程度。

## 调用参数

`name,description,src,kind,type,typeLabel,bio,city:string; navigation:boolean; size:number; onPress:()=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"IdentityRow",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- me · 我的 · IdentityRow语义需求 · miniprogram/templates/screen.wxml:55
- event · section event-person-card · miniprogram/templates/screen.wxml:84
- member · 成员主页 · IdentityRow语义需求 · miniprogram/templates/screen.wxml:105
- space · 空间主页 · IdentityRow语义需求 · miniprogram/templates/screen.wxml:113
- org · 组织主页 · IdentityRow语义需求 · miniprogram/templates/screen.wxml:113
- entity-members · member-row · miniprogram/templates/screen.wxml:200
- admins · 管理员 · IdentityRow语义需求 · miniprogram/templates/screen.wxml:193
- relations · member-row · miniprogram/templates/screen.wxml:200
- following · member-row · miniprogram/templates/screen.wxml:200
- attendees · 报名管理 · IdentityRow语义需求 · miniprogram/templates/screen.wxml:207

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
