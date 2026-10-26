选择组。选择与提交分开；单选仍用数组接口，达到max只禁用未选项。

## 调用参数

`options:{value,label,description?,disabled?}[]; value:string[]; mode:multiple|single; layout:list|tags; max:number; disabled:boolean; onChange:(value)=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"ChoiceGroup",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- edit-profile · ui-choice-group · miniprogram/templates/screen.wxml:172
- onboarding · section-title · miniprogram/templates/screen.wxml:185
- campaign-edit · ui-choice-group · miniprogram/templates/screen.wxml:172
- campaign-create · ui-choice-group · miniprogram/templates/screen.wxml:172
- publish · ui-choice-group · miniprogram/templates/screen.wxml:172
- review-lab · 开发者目录 · ChoiceGroup语义需求 · miniprogram/templates/screen.wxml:26

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
