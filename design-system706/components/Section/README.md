内容区块。区块留白与标题统一，嵌套正文不机械多层套卡。

## 调用参数

`title,action:string; children:Node; onPress:()=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"Section",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置

- event · event-overview · miniprogram/templates/screen.wxml:76
- event · section event-information · miniprogram/templates/screen.wxml:78
- event · detail-facts section · miniprogram/templates/screen.wxml:79
- event · section event-person-card · miniprogram/templates/screen.wxml:84
- event · detail-series-links · miniprogram/templates/screen.wxml:86
- event · section event-discussion · miniprogram/templates/screen.wxml:88
- event · section-title · miniprogram/templates/screen.wxml:90
- campaign · section series-about · miniprogram/templates/screen.wxml:103
- activity-preview · event-overview · miniprogram/templates/screen.wxml:76
- activity-preview · section event-information · miniprogram/templates/screen.wxml:78
- activity-preview · detail-facts section · miniprogram/templates/screen.wxml:79
- activity-preview · section event-person-card · miniprogram/templates/screen.wxml:84
- activity-preview · detail-series-links · miniprogram/templates/screen.wxml:86
- activity-preview · section event-discussion · miniprogram/templates/screen.wxml:88
- activity-preview · section-title · miniprogram/templates/screen.wxml:90
- privacy · settings-menu · miniprogram/templates/screen.wxml:191

实现：独立Web组件，未替换小程序。
