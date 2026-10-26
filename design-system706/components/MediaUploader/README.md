媒体选择与排序。本机文件选择、10MB/图片校验、删除/前移和封面变化；不上传服务器。

## 调用参数

`max:number; disabled:boolean; change事件:{count}`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"MediaUploader",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- create-space · media-grid · miniprogram/templates/screen.wxml:178
- edit-entity · media-grid · miniprogram/templates/screen.wxml:178
- edit-profile · media-grid · miniprogram/templates/screen.wxml:178
- campaign-edit · media-grid · miniprogram/templates/screen.wxml:178
- campaign-create · media-grid · miniprogram/templates/screen.wxml:178
- publish · media-grid · miniprogram/templates/screen.wxml:178

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
