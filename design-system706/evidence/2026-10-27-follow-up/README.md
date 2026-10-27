# 2026-10-27 保留功能代码修复

基于当前main，先从b3d611b同步到远端a210f11，保留账号、tab存活、发布权限和可选参与方式变更。用户最新范围优先：只修保留功能，已移除内容不恢复、不修旧问题；历史清单不算当前缺口。不新增截图、截图检查或测试；只核源码、生成结果及必要编译。不恢复自动化、不发布提审、不改登录/网络/安全配置。

## 1 公开参与者行：已修

来源是sheets.wxml的record.participants，仍明确“仅公开资料，不是完整报名名单”。此处不是attendees管理接口，不新增完整名单读取。

旧IdentityRow只规定内部flex，没有完整行宽/最小宽度和导航尾部槽的布局契约。新增width100%/min-width0/box-sizing/text-align:left，copy flex1将头像和姓名留在左侧，navigation箭头flex:none/margin-left:auto放最右。行高/图文间距沿既有headingGap/identityGap；sheet已有pageGutter，不叠加一层左右padding。interactive继续决定整行press，原member路由及item.owner保持；disabled阻止操作，增加aria-role/label。stacked头像下姓名的成员列表结构保持，不强行改成横排。

同类IdentityRow调用覆盖公开参与者、发起人、空间/组织主理人、关系/成员列表及我的个人卡；默认navigation=false，不给所有身份展示加箭头。Web ParticipantSummary同步使用完整IdentityRow，只有返回的公开姓名，空description不捏造简介。

## 2 关注关系类型与元信息：已修

soon.relations按真实target_type User/Group分支，map.entity提供kind SPACE/ORGANIZATION，mock也保留kind；新display-metadata只读这些字段或明确member路由，不按“上海706”等名称猜类型。IdentityRow.typeLabel用共享Badge显示空间/组织/个人；未知Group保持小组，未知类型不造身份。

原模板description直接拼`item.bio + ' · ' + city`，空bio产生前置点。现集中join先过滤null/undefined/非文本值及空白，再trim并join。覆盖relations/following/entity-members、我的城市/简介、成员主页城市/简介、EntityCard城市/区域，以及ChoiceGroup活动日期/城市/场地明细。保留用户bio内部原有的分隔符，不模糊删改正文。

另外，mock entity带owner（空间创建人），旧关注按钮用owner||id会误指向创建人。新relationTargetId对实体取自身id、对个人取owner/id，自关注判断也按目标ID；原follow回调、取消确认、member/space/org路由及API权限流程不变。

## 3 空间公众号与文章：移除且防恢复

space的entityLinks只保留host信息，account/recaps为空；模板入口与外部预览仅org可见，openOfficial/openRecap也拒绝非org路由。去掉空间回顾空状态，mock.seed只保留空间host，不再生成公众号/文章占位。既有缓存public_links即使存在也不能恢复空间入口，无需清Storage或重seed。

当前entity/space表单定义本就没有公众号/回顾专用编辑项，无需恢复后再删除。服务端public_links、人物work/social、专题resource_links、组织原有入口保持。仅把official/recap映射限定到org，空间LinkList历史语义需求移出当前调用清单。

## 4 新人资料多选：按最新纠正，不适用

初次核对发现兴趣字段已从forms.profile定义移除，payload删除interests，account.wxml三问题中也无兴趣选择；原兴趣ChoiceGroup模板分支已无字段会命中。虽然前一条旧修复要求提到2–5选，用户随后明确“已移除的不用恢复、再修”。因此本轮撤回未提交的恢复改动，不重加字段、校验、保存值或demo；清掉无调用的interests模板分支，不恢复只读主页标签。旧数据仍保留，不写空、不删除服务端数据。

真实保留路径已检查：更多→新人资料通过navigate复用edit-profile；未就绪账号先走同一账号覆盖层；旧onboarding直链对ready账号redirect到唯一edit-profile。accountFlow阶段login/identity/phone/profile三问题/welcome及privacy返回、草稿、已完成状态/手机补齐流程保持原样。现有AvatarPicker/FormField/SelectField/Checkbox均保留共享控件。尚保留的frequent_spaces、活动选择与筛选ChoiceGroup不删除，表单勾选和无bullet筛选仍分开。

映射新增account.wxml动态分支，标记退役的普通onboarding表单/兴趣要求，不再只凭旧onboarding route的静态组件表声称覆盖。

## 5 反馈与字段操作间距：已修

反馈Panel原来只是slot内容容器，没有规定字段与操作的flow；依赖Field自身margin与原生按钮行盒，无法由表单容器统一保证间距。现在Panel layout=form以flex列/itemGap拥有间距，字段standalone取消自身bottom margin，避免双重间距与margin折叠。反馈reason输入、打开反馈确认弹层、验证、busy/实际submitSheet链路不换；busy仍禁用输入和按钮并显示loading。

同类退回意见使用同一Panel布局；报名/评论/邀请/举报等通用弹层使用同令牌form-stack，内部字段standalone。账号account-fields已有显式列间距，保持同事实现。没有给普通所有按钮加margin，也不以全局input/textarea后代选择器覆盖隔离组件。

Web Section layout=form对应相同容器职责，提供反馈字段/按钮示例；ChoiceGroup保持已有form/filter区别。

## 系统构建与覆盖

覆盖44个当前注册页面、47个原生组件，动态账号分支单列。设计系统生成器原先用跨段正则同步helper，有吞掉root/icon/text公共定义的风险；本轮改为有边界标记的native helper替换，并保留这些被现存Web组件调用的定义。属于保留展示的构建修复，不恢复退役功能。metadata由原生源生成到Web，不维护两套判断。

AGENTS.md加入最小“已移除内容不恢复”规则。native-mapping/page-inventory有removedFeatures和dynamicBranches，历史快照仍保留来源。所有结论为代码/编译结论，不等于真实UI、真机、线上请求或业务验收。未新增测试或运行截图检查；checks.json记录实际编译与JS语法检查，code-locations.json提供定位。
