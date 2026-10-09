# 19 项针对性代码修复

2026-10-09 用户明确授权本批修复并要求多个 agent 按文件归属并行。此前全量页面核对继续暂停。代码基线：f09f91347dcc5918c1f0886e76efb6dc3268aa6f。

## 文件归属与协作

| Owner | 唯一修改范围 | 问题编号 |
| --- | --- | --- |
| shared_layout | miniprogram/templates/screen.wxml、miniprogram/app.wxss | 2–5、8–12、14–15、17–19，13 的显示绑定 |
| route_logic | miniprogram/lib/page.js | 6、13、16；7 的原因核对 |
| tab_icons | miniprogram/app.json、miniprogram/assets/tab-icons/ | 1 |
| B 整合 | miniprogram/lib/mock/index.js、restore-prototype.js、本说明 | 6、7 的源关联修正、整合提交 |

共享模板和样式始终只有一个 owner；逻辑组仅提供绑定需求，没有交叉写入。原 C 本批保持暂停。无需后端改动。

## 逐项代码变化

| 编号 | 问题 | 修改与代码依据 |
| --- | --- | --- |
| 1 | 四个 tab 无 icon | app.json 为四项配置 iconPath/selectedIconPath；8张81×81透明PNG，默认灰、选中深色，原生本地资源。 |
| 2 | 推荐人员卡高低不一 | 固定卡片及内容区高度，姓名单行、简介和原因各两行截断，按钮保持底部对齐。 |
| 3 | 城市文字与箭头不居中/无间距 | 分离 text 和箭头，flex 居中并明确 gap。 |
| 4 | 空间管理 icon 贴边/不对齐 | 共享 settings-row 保留内距，添加 gap、align-items；settings-icon 居中且不收缩。 |
| 5 | banner 分页点在图片外 | swiper 与图片统一324rpx，圆角裁剪，分页点在同一图片容器内部，文案留底部空间。 |
| 6 | 系列缺关联活动列表/链接 | campaign 返回关联项明确 type/route 为 event，复用 eventCard 可点击模板。第二 banner 的空 event_ids 补同主题关联活动；新seed和既有r12窄迁移均处理。公开状态过滤保留。 |
| 7 | 第一条审核消息进集合 | 消息内容对应“城市里的陌生人晚餐”，任务为 demo-review-0；源 target 改 approval-detail/demo-review-0，已有同源旧列表target窄迁移。不改角色权限或已读状态。 |
| 8 | 空间分享半宽/贴文本 | entity-share 全行宽，上方28rpx间距。 |
| 9 | 组织分享半宽、关注贴图片 | 与空间共享全宽分享；实体名称与关注/管理按钮在 entity-heading 同行居中，与头像分开。 |
| 10 | 编辑资料等独行按钮半宽 | 共享 primary/secondary/danger 全行宽，横向 row 和 bottom-actions 保留 flex 等分例外，紧凑按钮保留自身宽度。 |
| 11 | input 未聚焦文字偏下/聚焦跳位 | 单行 input 去上下 padding，保留左右内距和原高度；textarea 保留顶部/左右22rpx及多行行高，search 单独保留左右24rpx。 |
| 12 | 允许空间申请标签和开关分行 | switch-field 同行布局，标签左、switch右，垂直居中。 |
| 13 | 发布起止时间显示秒/小数 | 日期与时间 picker 使用 dateDisplay/timeDisplay，确认摘要使用 formStartDisplay/formEndDisplay；底层form值、payload和精度未修改。 |
| 14 | 城市/空间选择框间距/对齐 | select-control 全宽，文字flex左、箭头右、同轴居中；同类组织/参与方式选择框复用。 |
| 15 | 成功页按钮半宽 | 共享全宽规则覆盖独行主按钮，success-page 明确全宽。 |
| 16 | 专题审核条目打不开 | approvals 结果显式映射 review/detail route，openItem 按 subject_type 选择专题/活动详情，传任务id而非关联主体id，不再隐含依赖返回type。 |
| 17 | 专题介绍下临时 badge | 移除标题/正文/引用编辑工具按钮，介绍文本本体保留。 |
| 18 | 组织管理弹框及同类按钮半宽 | sheet menu-item 全宽，主次独行操作全宽；横向操作保留row分配。 |
| 19 | 我的48项临时入口 | 删除“我的”独立待查看48项按钮；review-lab路由与其他真实菜单保留。已有全局演示模式条保留。 |

## 数据与验证边界

既有 r12 VERSION、用户草稿、业务记录、系列审核状态、角色与权限均保留。links-r1 只修第一条同源旧消息的空列表目标，以及第二 banner 系列仍为空的关联ID；已有非空自定义关联不覆盖。不重新公开 IN_REVIEW 系列，不把未发布活动变为公开，不部署。

只进行了代码阅读、对应源关系核对、文件差异与 git diff --check。没有新增或运行测试，没有编译、GUI、截图或读图验收，没有恢复全量页面核对。第16项属于解除隐含路由依赖的代码修正，未通过运行复现锁定唯一故障原因；本批全部修复的实际运行和视觉效果尚未验收。coverage 状态未提升，SID-95未标用户验收通过。

无需要用户决策的代码阻塞；实际微信运行结果尚待用户Review。上述共享布局原因与数据窄迁移原则在本说明保留，供后续复查继承。
