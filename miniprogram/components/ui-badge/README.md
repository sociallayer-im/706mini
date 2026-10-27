# 状态Badge

保留label，tone取neutral/success/pending/danger/waiting。业务枚举只在lib/status-tone.js映射，色值只在lib/theme.js定义。状态色不是CTA黄色，也不是可点击FilterChip；未知枚举保留文字并用neutral。禁止根据翻译后的label猜状态或各页面各写颜色。原生与Web生成共享同一映射源。
