共用身份行。名称 typeSection（32rpx）、城市／简介 typeBody（28rpx），两行间距 spaceUnit（8rpx），图文间距 identityGap；文字组沿头像垂直居中。我的、公开成员、活动发起人、空间／组织主页、成员列表与用户卡共用。头像尺寸按原语境保留；stacked 单行头像横列保留紧凑姓名角色。flush 关闭行内留白，交由外层卡片提供。custom 槽仍应沿用相同文字层级。interactive 时发送 press，disabled 时阻止。actions 槽的独立操作自行拦截原生 tap。

2026-10-27：身份行显式width100%/min-width0，copy flex1，navigation箭头独立靠最右，整行press仍由interactive控制。typeLabel为业务kind/type映射的只读Badge，不按姓名猜身份。公开参与者仍是公开子集，保留member(owner)导航与非完整名单说明。stacked结构保留头像下姓名，不恢复旧布局。
