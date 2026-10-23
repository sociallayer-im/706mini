const test=require('node:test'),assert=require('node:assert/strict');
const present=require('../miniprogram/lib/personal-event'),i18n=require('../miniprogram/lib/i18n');
test('drafts show editing progress and readable saved time independently of old public dates',()=>{
 for(const locale of ['zh-CN','en']){
  const view=present({id:'draft',phase:'DRAFT',phaseLabel:'DRAFT',bookingLabel:'Ended',edit_step:2,updated_at:'2026-10-16T06:24:46.824Z'},'drafts',locale,i18n.dictionary(locale));
  assert(view.state.includes('2'));assert(!view.state.includes('Ended'));assert(view.stamp.includes('2026-10-16 14:24'));assert(!view.stamp.includes('T06:'));assert(view.date);assert(view.venue);assert.equal(view.actions[0].route,'publish');assert.equal(view.target,'activity-preview');
 }
});
test('personal registration IDs never substitute for event IDs',()=>{
 const t=i18n.dictionary('zh-CN'),entry={id:'registration-1',phase:'APPROVED_AWAITING_PAYMENT',event:{id:'event-1',title:'Event',feeLabel:'¥30'}};
 const view=present(entry,'registrations','zh-CN',t);
 assert.equal(view.event.id,'event-1');assert.equal(view.target,'event');assert.equal(view.actions[0].id,'registration-1');assert.equal(view.actions[0].route,'event-access');assert.equal(view.actions[0].variant,'primary');
});
test('review and published list actions retain their destinations and unknown capacity stays unknown',()=>{
 const t=i18n.dictionary('en');
 assert.deepEqual(present({id:'e',phase:'IN_REVIEW'},'my-events','en',t).actions.map(x=>x.route),['approval-progress','publish']);
 const view=present({id:'e',phase:'PUBLISHED',registered:3,remaining:null},'my-events','en',t);
 assert.deepEqual(view.actions.map(x=>x.route),['event','attendees']);assert(!view.note.includes('null'));assert(!view.note.includes('undefined'));
});
test('closing a sheet never restores the main tab bar on any child route',()=>{
 const store=new Map();global.wx={getStorageSync:k=>store.get(k),setStorageSync:(k,v)=>store.set(k,v),removeStorageSync:k=>store.delete(k)};
 const factory=require('../miniprogram/lib/page'),routes=require('../miniprogram/app.json').pages.map(x=>x.split('/')[1]);
 for(const route of routes){const p=factory(route);let state;p.getTabBar=()=>({setData:v=>state=v});p.tabVisibility(true);assert.equal(state.hidden,!['feed','discover','messages','me'].includes(route),route);p.tabVisibility(false);assert.equal(state.hidden,true);}
});
