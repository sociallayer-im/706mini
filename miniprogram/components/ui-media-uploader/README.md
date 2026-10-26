# 原生媒体编辑器

受控渲染media、封面、拖动位移与忙碌状态；不在组件内部上传、重排、持久化或变更业务状态。保留图片、视频、链接、上传、更换专题封面、添加链接、删除、长按拖动和取消触摸事件。

`interaction` payload：`{handler,dataset,detail,touches,changedTouches}`。长按额外携带`mediaRects`，来自组件自己的`createSelectorQuery().selectAll('.media-tile')`，解决isolated样式组件内节点不可被页面selector直接查询的问题。页面桥接必须把rects传给原`mediaDragStart`，由页面继续计算目标、更新form.media并persist；不能继续只用页面根selector查询媒体节点。

上传dataset保持`key:'media',type:'image',replace:true`（仅更换封面）。删除按钮的touchstart/longpress先发送mediaIgnoreDrag并拦截冒泡，避免误触排序；视频和链接不会作为拖拽图片起点。所有native触摸/输入detail原样透传。主页面保留媒体9/12张和外链3项限制、大小/上传错误及顺序持久化责任。
