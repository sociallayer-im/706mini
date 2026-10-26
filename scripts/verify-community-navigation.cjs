// Offline contract checks; these do not stand in for native visual QA.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const store = new Map([['706.transport', 'mock']]);
let currentRoute = 'feed', relaunches = [];
global.wx = {
  getStorageSync: key => store.get(key),
  setStorageSync: (key, value) => store.set(key, structuredClone(value)),
  removeStorageSync: key => store.delete(key),
  setNavigationBarTitle() {},
  reLaunch(options) { relaunches.push(options.url); options.success?.(); options.complete?.(); },
  navigateTo(options) { relaunches.push(options.url); },
  request() { throw Error('Unexpected network'); }
};
global.getCurrentPages = () => [{route:'pages/' + currentRoute + '/index'}];
const factory = require('../miniprogram/lib/page');
const prefs = require('../miniprogram/lib/preferences');
const theme = require('../miniprogram/lib/theme');
const icons = require('../miniprogram/lib/illustrations');
const routes = ['feed', 'discover', 'messages', 'me'];
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const tokens = css => Object.fromEntries(css.split(';').map(pair => pair.split(':')));

for (const locale of ['zh-CN', 'en']) {
  prefs.set({locale});
  for (const route of [...routes, 'space', 'event', 'calendar']) {
    const page = factory(route);
    page.data = structuredClone(page.data);
    page.setData = values => Object.assign(page.data, values);
    page.refreshLanguage();
    assert.deepEqual(page.data.tabItems.map(item => item.key), routes);
    assert(page.data.tabItems.every(item => item.icon === icons[item.key] && item.label));
    assert(!page.data.tabItems.some(item => item.emoji));
    if (routes.includes(route)) assert.equal(page.data.tab, route);
    const actual = tokens(page.data.theme);
    for (const key of ['navigationSurface', 'navigationAccent', 'navigationInk', 'navigationGutter', 'tabHeight', 'tabIconSize', 'tabBarSpace']) {
      assert.equal(actual['--' + key], theme.tokens[key], route + ': ' + key);
    }
  }
}
for (const route of routes) {
  const asset = path.join(__dirname, '../miniprogram', icons[route]);
  const png = fs.readFileSync(asset);
  assert.equal(png.readUInt32BE(16), 96);
  assert.equal(png.readUInt32BE(20), 96);
}
const markup = read('miniprogram/templates/screen.wxml');
const navigation = read('miniprogram/components/ui-navigation/index.wxml');
assert(markup.includes('<ui-navigation'));assert(read('miniprogram/custom-tab-bar/index.wxml').includes('<ui-navigation'));
assert(navigation.includes('src="{{item.icon}}"'));
assert(navigation.includes('aria-selected="{{current === item.key}}"'));
assert(!/Inverse|navigation-emoji|navigation-selection|translateX/.test(navigation));
const css = read('miniprogram/components/ui-navigation/index.wxss');
assert(css.includes('border-radius:var(--pill)'));
assert(css.includes('background:var(--navigationSurface)'));
assert(css.includes('min-height:var(--tabHeight)'));assert(css.includes('width:var(--tabIconSize)'));assert(css.includes('.selected{background:var(--accent)}'));assert(css.includes('border:0'));
assert(!read('miniprogram/styles/community.wxss').includes('.community-edition .navigation-capsule'));

// White-card pass: change UI surfaces, not the original images or their colors.
const bodyCss = read('miniprogram/styles/community.wxss');
// Post kinds share a type hierarchy; only their semantic copy changes.
const postMarkup=read('miniprogram/components/ui-feed-item/index.wxml');assert(postMarkup.includes('<ui-identity-row'));assert(/<ui-identity-row[^>]*\bcustom\b/.test(postMarkup));assert(postMarkup.includes('<text class="subject">{{item.feedIdentity.subject}}</text>'));assert(postMarkup.includes("{{locale === 'en' ? ' ' : ''}}{{item.feedIdentity.action}}"));const feedCss=read('miniprogram/components/ui-feed-item/index.wxss');assert(/\.subject\{[^}]*font-weight:600/.test(feedCss));assert(!/\.identity-copy\{[^}]*font-weight:(?:[5-9]00|bold)/.test(feedCss));assert(read('miniprogram/components/ui-identity-row/index.wxml').includes('wx:if="{{!custom}}"'));assert(postMarkup.includes('<ui-identity-row'));assert(postMarkup.includes('<ui-event-card'));
const model = factory.editorial;
for (const locale of ['zh-CN', 'en']) {
  const en = locale === 'en';
  const rec = {author:{display_name:'禾舟'}};
  assert.deepEqual(model.feedIdentity(rec, locale), {subject:'禾舟',action:en?'recommends an event':'推荐了一场活动'});
  for (const count of [1, 2, 8]) {
    const rollup = {key:'REGISTRATION_ROLLUP',count,actors:[{display_name:'林叶'},{display_name:'星桥'}].slice(0,count)};
    const identity = model.feedIdentity(rollup, locale);
    assert.equal(identity.subject, count === 1 ? '林叶' : en ? '林叶 & 星桥' : '林叶、星桥');
    assert.equal(identity.action, en ? (count > 2 ? '+ 6 ' : '')+'joined an event' : (count > 2 ? '等 8 位成员' : '')+'报名了');
    assert.equal(model.feedHeadline(rollup,locale), identity.subject+(en?' ':'')+identity.action);
  }
}
// Native search keeps the capsule sizing and routes submit through its explicit event.
assert(markup.includes('size="{{menuHeight - 4}}"'));const search=read('miniprogram/components/ui-search-field/index.wxml');assert(search.includes('bindconfirm="search"'));assert(search.includes('bind:press="search"'));assert(search.includes('size="{{size || 32}}"'));
assert.equal(theme.community.peopleSurface, '#FFFFFF');
assert.equal(theme.community.invitation, '#FFFFFF');
assert.equal(Number.parseFloat(theme.community.eventArtWidth) / Number.parseFloat(theme.community.eventArtHeight), 3/4);
assert.equal(Number.parseFloat(theme.community.eventRadius), Number.parseFloat(theme.community.eventArtRadius) + Number.parseFloat(theme.community.eventRim));
const eventCss=read('miniprogram/components/ui-event-card/index.wxss'),personCss=read('miniprogram/components/ui-person-card/index.wxss'),buttonCss=read('miniprogram/components/ui-button/index.wxss');
assert(eventCss.includes('padding:var(--eventRim)'));assert(eventCss.includes('border-radius:var(--eventArtRadius)'));assert(eventCss.includes('width:var(--eventArtWidth)'));assert(read('miniprogram/components/ui-person-card/index.wxml').includes('<ui-identity-row'));const identityCss=read('miniprogram/components/ui-identity-row/index.wxss');assert(identityCss.includes('align-items:center'));assert(identityCss.includes('min-width:0'));assert(identityCss.includes('font-size:var(--typeSection)'));assert(personCss.includes('white-space:normal'));assert(buttonCss.includes('var(--touchTarget)'));
assert(read('miniprogram/components/ui-person-card/index.wxml').includes('person.following'));
assert(read('miniprogram/components/ui-person-card/index.wxml').includes('bind:press="follow"'));
const iconSource = read('scripts/build-community-icons.cjs');
const navigationDrawings = [...iconSource.matchAll(/^  (feed|discover|messages|me): (.+),$/gm)];
assert.equal(navigationDrawings.length, 4);
assert(navigationDrawings.every(([, , drawing]) => !/fill=/.test(drawing)));
assert(iconSource.includes('stroke-width="2"'));
assert(iconSource.includes('stroke-linecap="round" stroke-linejoin="round"'));
assert(navigationDrawings.find(([, name]) => name === 'discover')[2].includes('M10 18c1 6 11 6 12 0'));
assert(!/grayscale|backdrop-filter/.test(bodyCss));
assert.equal((markup.match(/data-route="publish" bind:press="navigate"/g)||[]).length,1);
assert(read('miniprogram/components/ui-navigation/index.wxss').includes('env(safe-area-inset-bottom)'));
assert(!markup.includes('header-publish'));
assert(!bodyCss.includes('header-publish'));
assert(read('miniprogram/components/ui-person-card/index.wxml').includes('disabled="{{disabled}}"'));
assert(markup.includes('catch:press="personFollow"'));
assert(/<ui-identity-row[^>]*src="{{(?:\(item\.avatar_url\) \|\| ''|item\.avatar_url)}}"/.test(markup));
assert(/src="{{(?:\(e\.cover_url\) \|\| ''|e\.cover_url)}}" mode="aspectFill"/.test(read('miniprogram/components/ui-event-card/index.wxml')));

// The retained native custom-tab component must share the same resources too.
let definition;
global.Component = value => { definition = value; };
require('../miniprogram/custom-tab-bar/index');
const component = {...definition.methods, data:structuredClone(definition.data)};
component.setData = values => Object.assign(component.data, values);
for (const route of routes) {
  currentRoute = route;
  component.sync();
  assert.equal(component.data.selected, routes.indexOf(route));
  assert(component.data.items.every(item => item.icon === icons[item.key]));
}
component.sync('feed');
component.switchTab({detail:{handler:'navigate',dataset:{route:'discover'}}});
assert.equal(relaunches.at(-1), '/pages/discover/index');
assert.equal(component.data.selected, 1);
assert.equal(component.data.switching, false);
const count = relaunches.length;
component.switchTab({detail:{handler:'navigate',dataset:{route:'discover'}}});
assert.equal(relaunches.length, count);
console.log('Community navigation: shared tokens/icons on 7 routes in 2 languages, bundled 96px assets, native component switching, stable selected geometry passed; networkCalls=0.');
