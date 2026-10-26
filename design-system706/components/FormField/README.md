输入字段。错误靠近字段，不清空用户输入；label与输入通过ID关联。

## 调用参数

`label,value,hint,error,placeholder,name,type:string; multiline,required,disabled:boolean; onChange:(value)=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"FormField",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置

- create-space · field · miniprogram/templates/screen.wxml:164
- edit-entity · field · miniprogram/templates/screen.wxml:164
- edit-profile · field · miniprogram/templates/screen.wxml:164
- onboarding · section-title · miniprogram/templates/screen.wxml:185
- campaign-edit · field · miniprogram/templates/screen.wxml:164
- campaign-create · field · miniprogram/templates/screen.wxml:164
- publish · field · miniprogram/templates/screen.wxml:164
- login · 登录 · FormField语义需求 · miniprogram/templates/screen.wxml:190
- feedback · 反馈 · FormField语义需求 · miniprogram/templates/screen.wxml:192

实现：独立Web组件，未替换小程序。
