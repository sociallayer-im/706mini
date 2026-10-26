固定发起入口。可见圆为fabSize=76rpx，位置fabInset=32rpx、fabBottom=176rpx加底部安全区，图标fabGlyph=36rpx；透明触控区至少touchTarget=44px，独立扩展，不把可见圆放大。

输入icon/label/disabled/loading，必须给label提供可读动作名。无icon时可用默认slot放自定义可见内容。原生button保留disabled、busy和按压反馈；仅可用时触发press，父级负责路由。依赖统一theme中的fabSize/fabInset/fabBottom/fabGlyph。

模板替换建议（当前screen底部feed/discover发起入口）：

```xml
<ui-fab wx:if="{{route === 'feed' || route === 'discover'}}"
 icon="{{illustrations.publish}}" label="{{t.publish || (locale === 'en' ? 'Create event' : '发布活动')}}"
 data-route="publish" bind:press="navigate"/>
```

原有sheet覆盖层z-index高于FAB，保持层级；是否渲染由页面原条件控制，不在组件内推断登录或业务权限。
