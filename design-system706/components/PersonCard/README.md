人物推荐卡。复用IdentityRow：名称typeSection、辅助说明typeBody、两行间spaceUnit，文字组沿头像居中；关注按钮独立居中。取消关注需确认，整卡不抢独立操作。

## 调用参数

`name,bio:string; following:boolean`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"PersonCard",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- feed · people-strip discovery-people · miniprogram/templates/screen.wxml:37

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
