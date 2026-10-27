公开链接组。明确外部承接，不自动打开或复制用户数据。

## 调用参数

`items:{title,description,url?}[]`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"LinkList",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- member · member-section · miniprogram/templates/screen.wxml:110
- member · member-section · miniprogram/templates/screen.wxml:111
- org · 组织主页 · LinkList语义需求 · miniprogram/templates/screen.wxml:113
- edit-profile · 编辑资料 · LinkList语义需求 · miniprogram/templates/screen.wxml:160
- campaign · 专题详情 · LinkList语义需求 · miniprogram/templates/screen.wxml:100
- campaign-edit · 编辑专题 · LinkList语义需求 · miniprogram/templates/screen.wxml:160
- campaign-create · 创建专题 · LinkList语义需求 · miniprogram/templates/screen.wxml:160

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
