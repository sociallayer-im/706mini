分段单选。固定单选tags变体，用于本周/本月等互斥视角。radio零margin，20px指示符、8px文字间隔、左右12px对称内边距。

## 调用参数

`ChoiceGroup参数`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"SegmentedControl",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- messages · 消息 · SegmentedControl语义需求 · miniprogram/templates/screen.wxml:204
- relations · chips · miniprogram/templates/screen.wxml:158
- calendar · 活动日历 · SegmentedControl语义需求 · miniprogram/templates/screen.wxml:39
- spaces · 空间目录 · SegmentedControl语义需求 · miniprogram/templates/screen.wxml:197
- approvals · 审核待办 · SegmentedControl语义需求 · miniprogram/templates/screen.wxml:207
- following · chips · miniprogram/templates/screen.wxml:158

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
