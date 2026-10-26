const theme = require('../../lib/theme');
const icons = require('../../lib/illustrations');
Component({
  options: { virtualHost: true, styleIsolation: 'isolated' },
  data: { theme: theme.style(), chevron: icons.back },
  properties: {
    label: String,
    icon:String,value:String,selection:Boolean,selected:Boolean,
    description: String,
    detail: String,
    context: { type: String, value: 'surface' },
    tone: { type: String, value: 'default' },
    navigation: Boolean,
    divider: Boolean,
    disabled: Boolean,
    loading: Boolean
  },
  methods: {
    onPress() {
      if (!this.data.disabled && !this.data.loading) this.triggerEvent('press');
    }
  }
});
