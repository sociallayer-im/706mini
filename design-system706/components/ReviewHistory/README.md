审核历史。传真实时间与记录；空数组明确无记录。

## 调用参数

`items:{title,description,state}[]`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"ReviewHistory",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置

- campaign-approval-detail · 专题审核详情 · ReviewHistory语义需求 · miniprogram/templates/screen.wxml:147
- campaign-review-progress · ui-review-history · miniprogram/templates/screen.wxml:157
- approval-detail · 活动审核详情 · ReviewHistory语义需求 · miniprogram/templates/screen.wxml:147
- approval-progress · ui-review-history · miniprogram/templates/screen.wxml:157

实现：独立Web组件，未替换小程序。
