主导航。仅主浏览上下文使用，任务页隐藏；此网页示例点击改变选中状态。

## 调用参数

`items:string[]; value:string; navigate事件`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"Navigation",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置

- feed · Navigation · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:221
- discover · Navigation · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:221
- messages · Navigation · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:221
- me · Navigation · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:221

实现：独立Web组件，未替换小程序。
