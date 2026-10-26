const theme = require('../../lib/theme');
Component({
  data: { theme: theme.style(), hitSize: Number.parseFloat(theme.tokens.touchTarget) },
  options: { virtualHost: true, styleIsolation: 'isolated' },
  properties: {
    icon: String,
    label: String,
    direction: { type: String, value: 'none' },
    size: { type: Number, value: Number.parseFloat(theme.tokens.iconControlFallback) },
    surface: { type: String, value: 'surface' },
    disabled: Boolean
  },
  methods: {
    onPress() {
      if (!this.data.disabled) this.triggerEvent('press');
    }
  }
});
