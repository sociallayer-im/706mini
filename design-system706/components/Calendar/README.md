日历。支持传入年月、选日与日期计数；月切换与再点取消日期。默认2026年11月7日活动点为演示数据，非线上统计。

## 调用参数

`year,month,value:number; events:Record<YYYY-MM-DD,number>; onChange:(detail)=>void; datechange事件:{selected,year,month}`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"Calendar",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- calendar · calendar-box · miniprogram/templates/screen.wxml:49

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
