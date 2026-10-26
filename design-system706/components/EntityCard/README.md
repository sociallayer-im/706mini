空间/组织摘要。地点与身份说明来自公开数据；不从管理角色推断公开负责人。

## 调用参数

`title,description,address:string`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"EntityCard",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置

- manage · 管理 · EntityCard语义需求 · miniprogram/templates/screen.wxml:61
- space · entity-intro · miniprogram/templates/screen.wxml:114
- org · entity-intro · miniprogram/templates/screen.wxml:114
- spaces · 空间目录 · EntityCard语义需求 · miniprogram/templates/screen.wxml:197
- campaign · 专题详情 · EntityCard语义需求 · miniprogram/templates/screen.wxml:100

实现：独立Web组件，未替换小程序。
