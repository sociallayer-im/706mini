const previewGroups = [
  {
    "name": "主要页面",
    "pages": [
      {
        "label": "动态",
        "query": "view=feed"
      },
      {
        "label": "发现 · 按时间",
        "query": "view=discover"
      },
      {
        "label": "发现 · 按空间",
        "query": "view=discover&mode=space"
      },
      {
        "label": "消息",
        "query": "view=messages"
      },
      {
        "label": "我的",
        "query": "view=me"
      },
      {
        "label": "更多设置",
        "query": "view=more"
      }
    ]
  },
  {
    "name": "活动与系列",
    "pages": [
      {
        "label": "秋日放映：城市游牧者",
        "query": "view=event&id=film"
      },
      {
        "label": "苏州河慢走：寻找城市缝隙",
        "query": "view=event&id=walk"
      },
      {
        "label": "社区功能许愿工作坊",
        "query": "view=event&id=workshop"
      },
      {
        "label": "傍晚飞盘｜零基础友好",
        "query": "view=event&id=frisbee"
      },
      {
        "label": "活动系列",
        "query": "view=campaign"
      },
      {
        "label": "编辑活动系列",
        "query": "view=campaign-edit"
      },
      {
        "label": "报名已通过 · 付费活动",
        "query": "view=event-access&id=film"
      },
      {
        "label": "报名已通过 · 免费活动",
        "query": "view=event-access&id=walk"
      },
      {
        "label": "活动日历（独立视图）",
        "query": "view=calendar"
      },
      {
        "label": "按空间发现（独立视图）",
        "query": "view=spaces"
      }
    ]
  },
  {
    "name": "成员与个人",
    "pages": [
      {
        "label": "Jiang",
        "query": "view=member&id=jiang"
      },
      {
        "label": "阿乔",
        "query": "view=member&id=qiao"
      },
      {
        "label": "Shing",
        "query": "view=member&id=shing"
      },
      {
        "label": "毛毛",
        "query": "view=member&id=maomao"
      },
      {
        "label": "宁宁",
        "query": "view=member&id=ning"
      },
      {
        "label": "小北",
        "query": "view=member&id=xiaobei"
      },
      {
        "label": "一鸣",
        "query": "view=member&id=yiming"
      },
      {
        "label": "陈墨",
        "query": "view=member&id=chenmo"
      },
      {
        "label": "编辑个人资料",
        "query": "view=edit-profile"
      },
      {
        "label": "关注列表",
        "query": "view=relations"
      },
      {
        "label": "关注者列表",
        "query": "view=relations&relation=followers"
      },
      {
        "label": "关注入口",
        "query": "view=following"
      },
      {
        "label": "我报名的活动",
        "query": "view=registrations"
      },
      {
        "label": "我发布的活动",
        "query": "view=my-events"
      },
      {
        "label": "活动草稿",
        "query": "view=drafts"
      }
    ]
  },
  {
    "name": "空间与组织",
    "pages": [
      {
        "label": "空间主页",
        "query": "view=space"
      },
      {
        "label": "组织主页",
        "query": "view=org"
      },
      {
        "label": "空间全部活动",
        "query": "view=entity-events&entity=space"
      },
      {
        "label": "组织全部活动",
        "query": "view=entity-events&entity=org"
      },
      {
        "label": "空间活跃成员",
        "query": "view=entity-members&entity=space"
      },
      {
        "label": "组织活跃成员",
        "query": "view=entity-members&entity=org"
      },
      {
        "label": "编辑空间资料",
        "query": "view=edit-entity"
      },
      {
        "label": "管理员设置",
        "query": "view=admins"
      }
    ]
  },
  {
    "name": "发布与审核",
    "pages": [
      {
        "label": "发布 ① 活动信息",
        "query": "view=publish&step=1"
      },
      {
        "label": "发布 ② 报名设置",
        "query": "view=publish&step=2"
      },
      {
        "label": "发布 ③ 确认提交",
        "query": "view=publish&step=3"
      },
      {
        "label": "提交成功",
        "query": "view=publish&submitted=1"
      },
      {
        "label": "活动预览",
        "query": "view=activity-preview"
      },
      {
        "label": "审核待办",
        "query": "view=approvals"
      },
      {
        "label": "审核完成",
        "query": "view=approvals&done=1"
      },
      {
        "label": "活动审核详情",
        "query": "view=approval-detail"
      },
      {
        "label": "审核进度",
        "query": "view=approval-progress"
      }
    ]
  },
  {
    "name": "弹窗与浮层",
    "pages": [
      {
        "label": "报名申请",
        "query": "view=event&id=film&sheet=signup"
      },
      {
        "label": "直接报名",
        "query": "view=event&id=walk&sheet=signup"
      },
      {
        "label": "加入候补",
        "query": "view=event&id=frisbee&sheet=signup"
      },
      {
        "label": "评论与回复",
        "query": "view=event&sheet=comment"
      },
      {
        "label": "推荐活动",
        "query": "view=event&sheet=recommend"
      },
      {
        "label": "小程序菜单",
        "query": "view=feed&sheet=mini"
      },
      {
        "label": "选择城市",
        "query": "view=more&sheet=city"
      },
      {
        "label": "选择语言",
        "query": "view=more&sheet=language"
      },
      {
        "label": "空间管理",
        "query": "view=space&sheet=manage"
      },
      {
        "label": "组织管理",
        "query": "view=org&sheet=manage"
      },
      {
        "label": "成员操作",
        "query": "view=member&id=qiao&sheet=member"
      },
      {
        "label": "推荐原因",
        "query": "view=feed&sheet=why"
      },
      {
        "label": "活动付款",
        "query": "view=event-access&sheet=payment"
      },
      {
        "label": "活动群二维码",
        "query": "view=event-access&sheet=group"
      },
      {
        "label": "退回修改",
        "query": "view=approval-detail&sheet=return"
      }
    ]
  }
];
