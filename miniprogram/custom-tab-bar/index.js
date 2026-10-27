const pages = require('../lib/page');
const theme = require('../lib/theme');
const prefs = require('../lib/preferences');
const i18n = require('../lib/i18n');
const illustrations = require('../lib/illustrations');
const presentation = theme;
const routes = ['feed', 'discover', 'messages', 'me'];
Component({
 data: {theme: theme.style(), selected: 0, items: [], switching: false, hidden: false},
 lifetimes: {attached() { this.sync(); }},
 pageLifetimes: {show() { this.sync(); }},
 methods: {
  sync(route) {
   const pages = getCurrentPages();
   const page = pages[pages.length - 1];
   const path = route || page?.route?.split('/')[1];
   const t = i18n.dictionary(prefs.get().locale);
   const selected = routes.indexOf(path);
   this.setData({selected: selected < 0 ? 0 : selected, hidden: !!page?.data?.sheet || !routes.includes(path), items: routes.map(key => ({key, label: t[key], icon: illustrations[key]}))});
  },
  switchTab(e) {
   const index = routes.indexOf(e.detail && e.detail.dataset && e.detail.dataset.route);
   if (index < 0 || index === this.data.selected || this.data.switching || !routes[index]) return;
   this.setData({switching: true, selected: index});
   const finish = () => this.setData({switching: false});
   pages.openTab(routes[index], {fail: () => { this.sync(); finish(); }, complete: finish});
  }
 }
});
