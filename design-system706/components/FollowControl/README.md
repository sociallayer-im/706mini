关注控件。点击关注；已关注触发取消确认；异步失败由使用方回滚。

## 调用参数

`following,disabled,loading:boolean; onChange:(following)=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"FollowControl",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置

- member · row member-actions · miniprogram/templates/screen.wxml:107
- space · meta entity-address · miniprogram/templates/screen.wxml:117
- org · meta entity-address · miniprogram/templates/screen.wxml:117
- entity-members · member-row · miniprogram/templates/screen.wxml:200
- relations · member-row · miniprogram/templates/screen.wxml:200
- following · member-row · miniprogram/templates/screen.wxml:200

实现：独立Web组件，未替换小程序。
