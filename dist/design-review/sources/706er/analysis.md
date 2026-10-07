# Design Map

706 Together / V2 · 参考图综合设计提案。

706原站色彩可作线索；新颜色为人工选定提案，布局/字体/间距为设计规格，不冒充图中CSS实测。

## colors

```json
[
  {
    "role": "主文字 / 森林墨绿",
    "value": "#153D31"
  },
  {
    "role": "主背景 / 暖白",
    "value": "#FAF8F2"
  },
  {
    "role": "纸面 / 奶油",
    "value": "#F0EBDD"
  },
  {
    "role": "品牌 / 社区绿",
    "value": "#00AD57"
  },
  {
    "role": "强调 / 青柠",
    "value": "#D5ED33"
  },
  {
    "role": "辅助 / 天蓝",
    "value": "#CCE5F4"
  },
  {
    "role": "辅助 / 粉",
    "value": "#F3C7E6"
  },
  {
    "role": "辅助 / 杏橙",
    "value": "#FFAD77"
  },
  {
    "role": "少量行动蓝",
    "value": "#0866E8"
  }
]
```

## typography

```json
{
  "families": [
    "system-ui",
    "PingFang SC",
    "Georgia（英文强调，可选）"
  ],
  "scale": [
    {
      "role": "首页标题",
      "size": "64px desktop / 38px mobile",
      "weight": "700",
      "family": "system-ui / PingFang SC"
    },
    {
      "role": "分区标题",
      "size": "40px desktop / 28px mobile",
      "weight": "700",
      "family": "system-ui / PingFang SC"
    },
    {
      "role": "卡片标题",
      "size": "22px",
      "weight": "600",
      "family": "system-ui / PingFang SC"
    },
    {
      "role": "正文",
      "size": "16px / 1.75",
      "weight": "400",
      "family": "system-ui / PingFang SC"
    },
    {
      "role": "元信息",
      "size": "13px / 1.5",
      "weight": "500",
      "family": "system-ui / PingFang SC"
    }
  ]
}
```

## spacing

```json
{
  "base_unit": 4,
  "scale": [
    4,
    8,
    12,
    16,
    24,
    32,
    48,
    64,
    96
  ]
}
```

## radius

```json
[
  "12px 图片",
  "20px 内容卡",
  "999px 标签和按钮"
]
```

## shadows

```json
[
  "默认无阴影；浮层0 12px 40px rgba(21,61,49,.12)"
]
```

## grid

```json
{
  "max_width": "1200px",
  "columns": 12,
  "gutter": "24px",
  "reading_width": "36em"
}
```

## image_ratios

```json
[
  {
    "usage": "项目封面",
    "ratio": "4:3"
  },
  {
    "usage": "人物",
    "ratio": "1:1"
  }
]
```

## Interaction & Motion Map

取消自动横移与长入场。hover 180ms，面板220ms ease-out为提案；支持Escape、键盘选择与减少动态效果。静态参考无实测动效。

## SVG 角色组件

8 脸型 × 8 头发 × 7 眼睛 × 6 鼻子 × 8 嘴巴 × 8 配色 = 172,032 种理论组合。各部位为独立 SVG `<g>`；角色墙每批随机生成 12 个不重复组合，并能逐项改动、下载 SVG。配色另含柔紫 #B99ADB 与奶黄 #FFD451。形状是参考图启发的原创转译，组合参数属于新设计提案。

# Taste DNA

### 先给一个清楚的邀请
- **trigger**: 首屏需要让人迅速理解社区及参与方式
- **decision**: 用一个两行标题、一段短说明和一个主行动建立阅读顺序；图形集中在右侧构图。
- **reason**: 让首次到访者知道这里与自己有什么关系，然后再探索丰富内容。
- **evidence**: 参考1：中心命题与外围生活线索；参考2：左文右人物，行动与说明紧邻；不沿用706旧版散落大字

### 颜色拥有角色，而不是平均分配
- **trigger**: 多种鲜明颜色需要同时存在
- **decision**: 以暖白和墨绿承载阅读，社区绿用于身份，青柠用于主要行动，粉/蓝/杏橙分配给不同内容主题。
- **reason**: 色彩保留人的活力，但不会让每块内容都争夺第一眼。
- **evidence**: 参考3：奶油/浅蓝/粉色分区配深色文字；参考6与7：饱和几何形与留白共同构成焦点

### 让形状表达关系，正文保持规整
- **trigger**: 需要亲近感，也需要阅读效率
- **decision**: 花瓣、对话泡与圆形用于标识和小型角色；正文仍在稳定网格中左对齐，不塞进不规则轮廓。
- **reason**: 图形提供情绪，规则的文本区域承担理解任务。
- **evidence**: 参考4/5/8：几何面孔与手绘表情；参考3：大标题、短段落和图片之间有清楚层次

### 把动态交还给用户
- **trigger**: 动效可能打断阅读
- **decision**: 取消自动跑马灯和长入场；只对悬停、选择与展开提供短反馈，并支持键盘与reduce。
- **reason**: 用户可以按照自己的节奏看内容，辅助动画只解释刚才发生的操作。
- **evidence**: 用户明确否定706原站交互；8张新图为静态参考，不提供动效证据；180/220ms是本次设计提案

