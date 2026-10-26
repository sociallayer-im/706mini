# 页面留白与筛选反馈复核

本轮修复以70d5edd为基准，不混用迁移前39/42访问记录。源码检查覆盖42个页面入口、5个横向scroll-view、20弹层共用的ui-sheet，以及Navigation/FloatingBar独立外壳。完整逐页清单见`page-checklist.json`与上级`PAGE-MIGRATION-CHECKLIST.md`。

## 已完成的真实原生抽检

- `feed-start-390.*`、`feed-start-320.*`：人物列表首卡外沿与标题、轮播外沿使用统一页面边线；320宽下没有整页横向溢出可见现象，横向列表后项保留在滚动区域中。
- 原生Wxml样式面板读取horizontal-track为双侧16px padding、总宽1096px（390设备）；组件rail=true后自身margin为0。
- `discover-390.*`：发现页轮播、日历入口、卡片与页面边线；该图早于最终Badge决定，仅作留白证据，不作最终筛选视觉证据。
- `discover-badges-320.*`：最终时间/空间/布尔筛选均为纯文字Chip，不显示选择框、圆点、bullet或勾；头部、轮播、卡片与固定导航保留左右留白。
- `filters-combined-320.*`：实际将时间切本月，再分别开启免费、有名额。原生AX确认本月单选值1、其他时间值0、两个独立筛选值均1；`native-filter-state.json`提供提取结果。后续重置免费/有名额并恢复本周。

- `event-gutter-390.*`：活动详情标题/正文/卡片边线与固定底部操作条；`participants-sheet-390.*`：参与者弹层使用同一pageGutter，未提交任何动作。

预览机型最终恢复iPhone12/13(Pro)390宽；服务模式保持Montana，未切换账号、提交、支付或发送消息。

## 明确未计通过的范围

`feed-last-item-390.*`记录了通过末项可访问性入口打开只读资料并返回后，人物轨道已滚至最后一项ciao，证明末项可达；尚未确认该位置就是最大scrollLeft，也未确认最大滚动位置的右侧padding。`feed-end-attempt-320.*`记录了横向wheel/drag的尝试，但可见内容未移动到末项，不能声称已完成原生首尾手势验收。未判定是输入路径、模拟器还是产品原因；不把这份图算末端通过。其余路由、弹层、成员轨道和阶段轨道未逐个执行本轮GUI末端测试。

`geometry-model.json`是当前原生CSS的独立浏览器几何模型，绝非原生GUI：320/375/390/430宽，首卡与标题左缘相同，设置最大scrollLeft后末项右留白与pageGutter误差小于0.2px，documentWidth不超设备宽。它验证了轨道padding与内容宽度的CSS关系，不替代上段未完成的原生手势验收。

`filter-web.json`来自真实独立Web组件DOM：三种筛选点击区44px、可见面28px、字体12px、内边距4px12px相同；筛选input数0，表单checkbox仍为1；单选与两项多选状态均验证。

`compile.json`：90WXML/49WXSS直接编译exit0。`regression.json`：18单元、27原生契约、8组业务回归及页面留白源码检查全部exit0。真实设备和全42页GUI验收未执行。
