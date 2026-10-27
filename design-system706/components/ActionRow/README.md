操作行。只有传onPress才是按钮；navigation显式表示前往内容，复制与状态操作不画箭头；信息行不伪装可点击。

## 调用参数

`title,description,value,icon:string; navigation,danger:boolean; onPress?:()=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"ActionRow",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- discover · 发现 · ActionRow语义需求 · miniprogram/templates/screen.wxml:39
- me · 我的 · ActionRow语义需求 · miniprogram/templates/screen.wxml:55
- manage · 管理 · ActionRow语义需求 · miniprogram/templates/screen.wxml:61
- event · ui-action-row · miniprogram/templates/screen.wxml:92
- event · ui-action-row · miniprogram/templates/screen.wxml:93
- event · ui-action-row · miniprogram/templates/screen.wxml:94
- space · 空间主页 · ActionRow语义需求 · miniprogram/templates/screen.wxml:113
- org · 组织主页 · ActionRow语义需求 · miniprogram/templates/screen.wxml:113
- admins · 管理员 · ActionRow语义需求 · miniprogram/templates/screen.wxml:193
- event-access · ui-action-row · miniprogram/templates/screen.wxml:131
- event-access · participation-management · miniprogram/templates/screen.wxml:145
- approvals · 审核待办 · ActionRow语义需求 · miniprogram/templates/screen.wxml:207
- more · 更多设置 · ActionRow语义需求 · miniprogram/templates/screen.wxml:66
- invitations · 管理邀请 · ActionRow语义需求 · miniprogram/templates/screen.wxml:207

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
