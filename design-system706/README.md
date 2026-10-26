让相聚自然发生。保持轻松、清晰、真实：让人物、活动和关系成为内容，不让控件争夺注意力。

## 内容原则

使用“申请报名”“待审核”“待付款”“查看参与方式”等准确动词与状态。待审核不写成报名成功。状态附文字，不只靠色相。系统文案可随语言切换；用户标题、简介与名称保留原文。缺少负责人、公开名单或联系方式时说明缺口，不补造数据。

## 视觉基础

- 画布用 `canvas`，内容面用 `surface`，正文用 `ink`，辅助文字用 `muted`。主要操作用 `accent` 上的 `accentText`；危险动作用 `danger`，并保留确认语义。
- 正文用 `typeBody`（375px基准14px）、1.7行高；主标题 `typeTitle`、活动标题 `typeEvent`、栏目 `typeSection`；事实 `typeFact`，时间 `typeMeta`，只读标签 `typeLabel`。小字不替代正文。
- 页边用 `pageGutter`，区块间用 `sectionGap`，标题间用 `headingGap`；内容角用 `radius`，图片 `radiusImage`，输入 `radiusInput`，弹层 `radiusSheet`。胶囊只包必要内容。
- 标准操作用 `controlHeight`，卡片内紧凑操作用 `controlCompactHeight`。透明点击区至少 `touchTarget`，不把最小点击高度涂满成大按钮。长文自然增高，不缩小字。
- 卡片无常规装饰描边和阴影；字段用 `line`，必要分隔用 `stroke`。导航/底部动作组可用 `navigationSurface` 与 `navigationBlur`，正文不用毛玻璃。
- 按压用 `pressDuration` 与 `pressOpacity`，不缩放几何；等待旋转用 `loadingDuration`，遵循减少动态偏好。焦点使用 `ink` 的3px实线（本次Web适配决定）。

`ink`/`muted`/`danger` 在 `canvas`/`surface` 上可读。保留源代码细灰边：`line` 对白面不足3:1，不能把它声称为完整无障碍控件边界；明确字段标签与深色焦点辅助识别。只有一个来源浅色主题，不凭空制造暗色品牌规范。

## 图标与字体

使用 `assets/Icons/` 的原始PNG线稿，详见该组README。装饰图标alt为空，纯图标按钮必须有label；不要靠字体箭头或emoji表达系统功能。使用系统字体栈；没有附带字体二进制，不要求联网下载。本包没有重绘706标志，以普通文字排品牌名。演示图仅用 `assets/Demo/` 的仓库原图，并标识为离线示例。

## 使用组件

先读 `components/<Name>/README.md`，参数总览见 `catalog.json` 与 `components/index.d.ts`。组件返回DOM节点，使用原生button、input、dialog及文字内容；使用方提供业务数据与事件处理，禁止传任意HTML。

```html
<script src="data.js"></script>
<script src="components/bundle.js"></script>
<link rel="stylesheet" href="components/bundle.css">
<div id="target"></div>
<script>
DS706.applyTokens(DS706_DATA.tokens);
DS706.mount(document.getElementById('target'),'ChoiceGroup',{
  options:[{value:'film',label:'纪录片'},{value:'city',label:'城市观察'}],
  value:['film'], mode:'multiple', layout:'tags', max:2,
  onChange: values => console.log(values)
});
</script>
```

关注操作用 `FollowControl`，筛选用 `FilterChip`，只读状态用 `Badge`。组合活动卡用 `EventCard`；个人报名状态留在 `PersonalEvent` 外层摘要，不能混入活动自身状态。弹层用 `Sheet`，在提交中锁关闭，业务方处理未保存确认与失败回滚。字段错误不清空输入；加载保留现有内容。

## 本地打开

直接打开 `index.html` 即可浏览；推荐在仓库根目录运行：

```sh
python3 -m http.server 7066 --bind 127.0.0.1 --directory design-system706
```

打开 http://127.0.0.1:7066 。不需要微信、登录、依赖安装或外部网络。重新生成基础数据与逐组件指南：`node design-system706/build.cjs`。

## 来源与本次决定

精确来源和Web适配新值分界见 `DESIGN-DECISIONS.md`。不要把展示站布局倒推成小程序规则。

## Not synced

这是从源码语义提炼、按用户要求手写的独立Web实现，不是小程序组件直接编译，也没有向小程序回写。源值在 `tokens.json` 中保留原rpx；网页按375px基准换算 rpx/2，响应式变化由容器处理。原生安全区、支付、授权、微信分享、相册、扫码及服务端业务状态机没有模拟成真实能力。BaoCut专用check/import不可用，未假称运行。素材按用户要求保留为本地文件，无上传记录。实际访问和验证见 `IMPLEMENTATION.md` 与 `evidence/`。
