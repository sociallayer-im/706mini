偏好开关。仅用于立即生效偏好；业务保存失败时由使用方复原。

## 调用参数

`label,hint:string; checked,disabled:boolean; onChange:(checked)=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"Switch",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置

- publish · <switch · miniprogram/templates/screen.wxml:166
- more · 更多设置 · Switch语义需求 · miniprogram/templates/screen.wxml:66
- privacy · 隐私与可见性 · Switch语义需求 · miniprogram/templates/screen.wxml:191

实现：独立Web组件，未替换小程序。
