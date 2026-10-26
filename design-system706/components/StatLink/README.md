可打开统计。真实数量含0；只读统计应直接文字而非按钮。

## 调用参数

`value:number; label:string; onPress:()=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"StatLink",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置

- me · self-profile · miniprogram/templates/screen.wxml:56
- member · 成员主页 · StatLink语义需求 · miniprogram/templates/screen.wxml:105

实现：独立Web组件，未替换小程序。
