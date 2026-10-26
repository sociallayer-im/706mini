通知条目。点击标记演示已读；状态通过文字而非仅颜色表达。

## 调用参数

`title,description:string; read:boolean; read事件`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"NotificationItem",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置

- messages · message-group-title · miniprogram/templates/screen.wxml:204

实现：独立Web组件，未替换小程序。
