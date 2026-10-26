评论与回复。提供本机回复弹层，空回复不提交；回复为无图标文字操作，与正文左缘对齐。真实发布由使用方绑定。

## 调用参数

`name,text:string`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"CommentThread",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置

- feed · comment弹层：按reply_to组织评论线程与内嵌回复；入口须由可达状态验证 · miniprogram/templates/sheets.wxml:20
- event · 活动详情讨论区：作者、正文、内嵌回复及回复/删除操作 · miniprogram/templates/screen.wxml:88
- event · comment弹层：按reply_to组织评论线程与内嵌回复；入口须由可达状态验证 · miniprogram/templates/sheets.wxml:20

实现：独立Web组件，未替换小程序。
