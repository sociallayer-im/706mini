const assert=require('node:assert/strict'),fs=require('node:fs');
const render=require('../miniprogram/lib/event-content');
const cases=[
 ['identical','摘要。','摘要。',''],
 ['opening paragraph','摘要。','摘要。\n\n正文其他内容。',''],
 ['whitespace','摘要。','  摘要。\r\n正文。',''],
 ['summary only','摘要。','','摘要。'],
 ['body only','','正文。',''],
 ['different','独立摘要。','正文。','独立摘要。'],
 ['similar words are not exact','摘要。','摘要不同。','摘要。'],
 ['substring is not paragraph','城','城市生活','城'],
 ['later occurrence','摘要。','正文。\n摘要。','摘要。']
];
for(const [name,summary,description,visible] of cases){const input={summary,description},before=JSON.stringify(input),out=render(input);assert.equal(out.detailSummary,visible,name);assert.equal(out.detailDescription,description,name);assert.equal(JSON.stringify(input),before,'source must remain unchanged');}
const markup=fs.readFileSync('miniprogram/templates/screen.wxml','utf8');assert(!markup.includes('class="menu-group-title"'));assert(markup.includes('slot="actions" data-route="edit-profile"'));assert(markup.includes('record.detailDescription'));assert(!markup.includes('record.description !== record.summary'));
const header=fs.readFileSync('miniprogram/components/ui-menu-group/index.wxss','utf8');assert(header.includes('padding:var(--panelInset) var(--panelInset) var(--headingGap)'));
console.log(JSON.stringify({cases:cases.map(x=>x[0]),sourceUnchanged:true,headerAndActionContracts:'pass'}));
