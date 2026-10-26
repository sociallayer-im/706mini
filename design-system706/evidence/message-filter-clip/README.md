# 消息筛选下沿裁切修复

## 根因与修复
消息页scroll-view把viewport height与line-height均绑定到微信菜单胶囊menuHeight（常见32px），但共享FilterChip内Button触控区最小44px。scroll-view裁切超出viewport的内容，继承行高与inline-flex基线还会增加垂直偏移。不是z-index遮挡。

移除消息轨道的固定height/line-height，viewport按内容撑高，最小为touchTarget；内部track使用flex避免行内基线空隙。共享导航行改为min-height，navigation-layout从同一theme.touchTarget读取最小高度，与微信菜单垂直居中；headerHeight包含完整导航行及原24px内容间隔，页面占位同步。右侧胶囊避让与pageGutter保留，Badge外观与44px触控区均未压缩。

## 防复发规范与复用排查
- 滚动容器必须容纳完整交互区，不能用可见Badge或系统胶囊高度替代控件触控高度；内容轨道按实际内容决定高度。
- 不在滚动容器上设置用于垂直居中的继承line-height；使用flex alignment。
- 导航控件高度、微信胶囊高度和页面顶部占位分别计算；导航高度由胶囊与touchTarget较大者决定，保持胶囊排除区。
- screen.wxml共5个scroll-x：消息顶部是唯一绑定menuHeight的轨道；其他人物、空间筛选、状态筛选、成员轨道均无固定height，按内容撑开。所有42路由共享导航布局修正。此次没有对42页逐页GUI验收。

## 验证与边界
- 真实微信开发者工具SDK3.17.4：messages-390.png、messages-320.png，全部/管理/活动/互动完整圆角下沿可见，无水平齐切；左右gutter与胶囊避让保留。
- messages-320-font26.png：320设备、模拟器字体26设置下完整可见。组件使用显式rpx，截图未显示字体跟随设置等比放大；这证明该模拟器设置下无裁切，不等于所有真机辅助字号验收。
- messages-320-selected.txt：实际点击管理，原生单选状态管理1/全部0。未登录、发送消息或切换服务。
- navigation layout回归：320/375/430宽、24/32/44/56px胶囊、无菜单API fallback；断言顶部占位包含交互行，并禁止消息轨道重新出现inline固定height/line-height。
- 27项原生契约、页面留白源码检查、paper-layout业务布局回归通过；90WXML/49WXSS直接编译通过（compile.json）。真机触摸边缘坐标与其余4条轨道此次未做GUI复测。
- 预览机型/字体最终恢复390宽iPhone12/13(Pro)、16字体。
