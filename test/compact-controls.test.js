const test=require('node:test'),assert=require('node:assert/strict');
function definition(name){let result;const old=global.Component;global.Component=v=>result=v;const file=require.resolve('../miniprogram/components/'+name);delete require.cache[file];require(file);global.Component=old;return result;}
test('shared action control forwards one press and blocks disabled or pending actions',()=>{
 const c=definition('ui-button');let count=0;const ctx={data:{disabled:false,loading:false},triggerEvent:()=>count++};
 c.methods.press.call(ctx);ctx.data.loading=true;c.methods.press.call(ctx);ctx.data.loading=false;ctx.data.disabled=true;c.methods.press.call(ctx);assert.equal(count,1);
});
test('campaign card destinations distinguish draft editing, review progress and public details',()=>{
 const c=definition('ui-personal-campaign');
 for(const [status,route] of [['DRAFT','campaign-edit'],['CHANGES_REQUESTED','campaign-edit'],['IN_REVIEW','campaign-review-progress'],['PUBLISHED','campaign']]){
  let event;const ctx={data:{item:{id:'series-1',status},busy:false},triggerEvent:(name,detail)=>event={name,...detail}};c.methods.open.call(ctx);assert.deepEqual(event,{name:'navigate',route,id:'series-1'});
  c.methods.remove.call(ctx);assert.deepEqual(event,{name:'action',op:'deleteCampaign',id:'series-1'});
 }
});
test('review history formats actual update timestamps and retains reviewer notes in both languages',()=>{
 const c=definition('ui-review-history'),items=[{id:'task',scope:'PLATFORM',status:'PENDING',updated_at:'2026-10-14T03:00:00.000Z',note:'Please clarify the venue.'}];
 for(const locale of ['zh-CN','en']){let view;c.observers['items,locale'].call({setData:x=>view=x},items,locale);assert.equal(view.entries[0].date,'2026-10-14 11:00');assert.equal(view.entries[0].note,items[0].note);assert(view.entries[0].statusLabel);assert.notEqual(view.entries[0].statusLabel,'PENDING');}
});
