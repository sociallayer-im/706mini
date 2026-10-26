活动邀请卡。真实WXML/Component实现，保留活动自身状态、3:4海报、标题、时间、地点、发起方、费用与图片失败承接，不把个人报名状态混入。

输入：`e`为页面已normalize的数据，`t`和`illustrations`沿用页面字典/图标；`large`大图变体、`interactiveTitle`标题独立入口、`previewOnly`禁整卡导航、`modalOpen`用于底层辅助隐藏、`cardRoute`保留预览路由。

统一输出`interaction`：`{handler,dataset,detail}`。openEvent携带id/route，previewImage携带url，coverError携带id；预览动作catchtap，避免触发整卡导航。父页面负责业务、权限与数据读取。
