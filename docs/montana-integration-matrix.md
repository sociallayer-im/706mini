# Montana 真实接入矩阵

2026-10-09；以 `docs/backend-ai-agent-development-manual.md`、当前原型 33 路由及原生 39 业务页为业务依据。第 40 页 review-lab 为本轮评审工具。公开仓库只保存客户端契约；服务端源码、运维配置、部署与完整证据留在私有 Montana 仓库 `apps/community706/`。

真实 adapter：`lib/montana.js`；显式入口：`lib/api.js`；界面调用：`lib/page.js`；本地 adapter：`lib/mock/index.js`。read/write 经 WebSocket `call-function community:read / community:write`；actions 经相同鉴权通道调用函数。浏览器 SDK 没有被直接塞进微信运行时。

标记：实现=源码和页面调用已具备；部署=v6 函数已发布；匿名验证=实际服务响应；离线验证=mock 状态引擎/模拟器；真实业务验证=有权限的真实账号完成操作。本轮真实业务验证未执行。

| 页面 / 能力 | 实际调用 | 表/逻辑记录 | 服务端边界 | 当前证据 |
| --- | --- | --- | --- | --- |
| 首页动态、换人 | read feed/people | profile/follow/registration/recommendation/mute/event | 公开资料/已发布活动；报名动态须主动分享；不显示屏蔽成员 | 实现、部署；people 匿名空结果；离线关联场景 |
| 推荐理由 | read people | 同上 + entity | 对方关注、共同活动（对方允许分享）、同空间、同推荐、同城兴趣 | 本轮补齐真实计算；部署；真实关联账户未验证 |
| 发现/日历/按空间 | read events/calendar/entities/campaigns | event/entity/campaign/registration | 公开状态；普通筛选 AND；上海时区周/月边界；名额含支付占位 | 实现、部署；events 匿名空结果；离线日历 |
| 全局搜索 | read search | event/profile/entity | 仅公开数据；明确搜索跨城，同城优先 | 实现、部署；离线覆盖 |
| 活动详情/预览/评论 | read event/draft/comments | event/eventSecret/comment/profile | 非公开需编辑权；私密参与信息不在公开 DTO | 实现、部署；离线权限与详情 |
| 个人/成员/资料/新人 | read me/member/selfContact; write profile | profile/contact/follow | 当前账户/公开资料分离；联系方式加密，仅本人回读；兴趣/同意校验 | 本轮接通自己联系方式；匿名拒绝；真实账号未验证 |
| 关注/取消关注/关系 | read relations; write follow | follow/profile/entity | 唯一关系、禁止关注自己；仅公开资料 | 实现、部署；离线状态 |
| 推荐/撤回/评论回复/删除/屏蔽/举报 | write recommend/comment/deleteComment/mute/report | recommendation/comment/mute/report | 当前身份；评论归属或平台；回复同活动；软删除；举报独立记录 | 本轮补撤回按钮、空反馈拒绝；离线状态 |
| 消息/分类/已读 | read notifications; write read | notification | 仅本人；站内通知随业务动作产生 | 实现、部署；离线已读；微信订阅消息未配置 |
| 草稿/发布/修改/复制 | read mine/draft/managed; write saveEvent/clone/submitEvent | event/eventSecret/review/audit | 归属/组织角色、版本/状态、发布时服务端验证、所有审核方 | 实现、部署；离线退回重提/历史轮次 |
| 审核列表/详情/进度 | read reviews/review/progress; write review | review/event/campaign/role | 实时角色与审核范围、轮次、版本；全通过才发布 | 实现、部署；离线多方审核 |
| 报名/申请/候补/报名管理 | read registration/attendees/mine; write register/registrationDecision/cancelRegistration | registration/event/notification | 行锁串行事务、幂等、防超卖、同意版本、需审候补不绕审批 | 实现、部署；离线免费递补/申请；真实并发未验证 |
| 报名联系方式 | write registrationContact | contact/registration/event/role/audit | 当前管理权 + 该次明确同意 + 有效报名 + 已发布活动；解密时记录读取行为；不缓存结果 | 本轮新增真实入口与按钮，部署；匿名拒绝；离线同意/拒绝/撤销 |
| 参与方式/私有图片 | write access; action mediaPreview | eventSecret/registration/media/role/audit | 确认后且当前有权；每次私有图片 GET 再查权限，短时能力且禁止缓存；敏感结果不进幂等缓存 | 实现、部署；离线取消后拒绝；真实媒体未验证 |
| 支付/过期/取消 | action payment; internal preparePayment/settlePayment/expire/expireHold/expiryInfo; HTTP paymentNotify | registration/payment/notification | 可信金额、微信身份、签名/验签与回调；远程关单前不释放占位；退款规则缺失明确报错 | 实现、部署；微信支付配置=false；仅模拟支付成功 |
| 专题创建/编辑/关联确认 | read campaign/campaigns/draft; write saveCampaign/submitCampaign/review | campaign/event/review/notification | 平台/组织审核及活动发起人确认；拒绝剔除、空合集退回 | 实现、部署；离线不同发起人关联 |
| 实体主页/成员/编辑/管理权限 | read entity/entities/admins/managed; write entity/invite/acceptInvite/revokeRole | entity/role/invitation/audit | Owner/管理员/平台实时权限；邀请失权后拒绝；撤销含待接受邀请 | 实现、部署；离线接受/撤销/权限清除 |
| 图片选择/上传/预览 | action mediaUpload/mediaFinish/mediaPreview; HTTP media/privateMedia | media/$files | wx.chooseMedia→签名 PUT→服务端内容/MIME检查；公开引用与私密图分离 | 实现、部署；mock 本机持久文件；真实上传未验证 |
| 日历海报/分享回流 | action calendarCode; read calendarShare | calendarShare/event | 保存允许的筛选参数；微信真实码；禁止伪码替代 | 实现、部署；mock 不产码；真实微信资质未提供 |
| 手机/邮件/微信登录 | runtime/auth send/verify phone/magic code；action wechatLogin | $users/wechatIdentity/profile | init AppID/token 校验；auth.id可信；微信服务端交换身份 | 微信适配已实现；配置=false；未发送真实验证码 |
| 设置/双语/隐私/反馈 | 本地 prefs + write profile/report | profile/report | 模式和身份分开缓存；正式隐私主体待配置 | 实现、离线；正式主体未定 |

## 存储与权限核对

现有 app 新增 `community706` 逻辑记录表，含 type/owner/parent/status/data/version/时间字段；不重建项目。客户端表级直读写、schema扩展、文件直读写均显式 deny；业务函数通过 `ctx.auth.id` 及当前 profile/role 状态逐次授权。函数内部 DB 权限并不自动等于用户权限，因此每条业务操作有服务端显式检查。写入先锁 guard 行，再读容量/版本/状态，同事务保存幂等结果；参与方式和联系人读取排除在幂等结果缓存外。

加密联系方式只在 contact，活动参与方式只在 eventSecret，不加到公开 profile/card。媒体公共入口检查公开引用；群图片使用受限私有入口。支付回调不信任客户端“已成功”。上述为代码/部署核对，未做大规模负载或真实多账号并发验收。

## 已知外部依赖

微信登录密钥、真实小程序合法域名、商户支付资料、真实平台/组织/空间负责人、正式隐私主体及联系渠道、退款规则。微信订阅推送尚未配置。以上均不影响独立离线评审，但决定真实业务联调与上线条件。没有把本地演示结果记作真实业务通过。
