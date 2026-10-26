const fs=require('fs'),assert=require('assert');
const read=p=>fs.readFileSync(p,'utf8');
const app=JSON.parse(read('miniprogram/app.json')),screen=read('miniprogram/templates/screen.wxml'),css=read('miniprogram/app.wxss'),editorial=read('miniprogram/styles/editorial.wxss');
for(const route of app.pages)assert(read('miniprogram/'+route+'.wxml').includes('templates/screen.wxml'),route);
assert(/\.screen\{[^}]*box-sizing:border-box;[^}]*width:100%;[^}]*padding:32rpx var\(--pageGutter\)/.test(css));
const rails=[...screen.matchAll(/<scroll-view\b((?:"[^"]*"|[^">])*)>([\s\S]*?)<\/scroll-view>/g)].filter(x=>/\bscroll-x\b/.test(x[1]));
for(const [,attrs,body] of rails){assert(attrs.includes('horizontal-rail'));assert(/^<view class="horizontal-track">/.test(body));for(const tag of body.match(/<ui-(?:person-card|filter-chip)[^>]*>/g)||[])assert(tag.includes('rail="{{true}}"'));}
assert.strictEqual(rails.filter(x=>x[1].includes('rail-contained')).length,1);assert(!/\.discovery-people\{[^}]*width:calc/.test(editorial));
assert(/\.horizontal-track\{[^}]*width:max-content;[^}]*padding-left:var\(--pageGutter\);padding-right:var\(--pageGutter\)/.test(css));
for(const n of ['ui-person-card','ui-filter-chip']){assert(read('miniprogram/components/'+n+'/index.js').includes('rail:Boolean'));assert(read('miniprogram/components/'+n+'/index.wxss').includes('.in-rail{flex:none;margin:0}'));}
for(const n of ['ui-sheet','ui-navigation','ui-floating-bar'])assert(read('miniprogram/components/'+n+'/index.wxss').includes('var(--pageGutter)'));
assert(read('miniprogram/components/ui-gallery/index.wxss').includes('calc(0rpx - var(--pageGutter))'),'intentional gallery full bleed preserved');
const result={scope:'source layout contracts; GUI and browser geometry recorded separately',pages:app.pages.length,horizontalRails:rails.length,pageRails:rails.filter(x=>x[1].includes('rail-page')).length,containedHeaderRails:1,sourceChecks:'pass',networkCalls:0,productionWrites:0};
fs.mkdirSync('design-system706/evidence/page-gutters',{recursive:true});fs.writeFileSync('design-system706/evidence/page-gutters/source-check.json',JSON.stringify(result,null,2)+'\n');console.log(result);
