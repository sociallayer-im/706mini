分组菜单。title为卡片内Header，由容器施加panelInset，与行icon左缘一致，禁止slot裸标题或双重padding。卡片级辅助动作右上，正文操作/footer保留原层级。同组共享白面，整行点击与分隔；展示站设置只在本机示例内。

## 调用参数

`title,action:string; items:ActionRowProps[]`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"MenuGroup",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- me · settings-menu · miniprogram/templates/screen.wxml:57
- me · settings-menu developer-entry · miniprogram/templates/screen.wxml:58
- me · settings-menu · miniprogram/templates/screen.wxml:59
- manage · settings-menu · miniprogram/templates/screen.wxml:63
- manage · settings-menu · miniprogram/templates/screen.wxml:64
- more · settings-menu · miniprogram/templates/screen.wxml:68
- more · settings-menu · miniprogram/templates/screen.wxml:69
- more · settings-menu · miniprogram/templates/screen.wxml:70
- more · settings-menu · miniprogram/templates/screen.wxml:71
- privacy · settings-menu · miniprogram/templates/screen.wxml:191
- review-lab · 开发者目录 · MenuGroup语义需求 · miniprogram/templates/screen.wxml:26

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
