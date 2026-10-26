// A short-lived, account-bound destination and the action the user requested.
const api=require('./api');
const key=()=> '706.account-return.'+api.mode();
function remember(route,id='',action='',dataset={}){
 if(['login','onboarding'].includes(route))return;
 const safe=Object.fromEntries(['id','enabled','kind','reply'].filter(k=>dataset[k]!==undefined).map(k=>[k,dataset[k]]));
 wx.setStorageSync(key(),{route,id,action,dataset:safe,owner:api.session()?.id||'',at:Date.now()});
}
function pending(){const value=wx.getStorageSync(key());if(!value||Date.now()-value.at>30*60*1000||(value.owner&&value.owner!==api.session()?.id)){wx.removeStorageSync(key());return null;}return value;}
function claim(){const value=pending();if(value){value.owner=api.session()?.id||'';wx.setStorageSync(key(),value);}return value;}
function clear(){wx.removeStorageSync(key());}
function phoneValid(value){return /^1[3-9]\d{9}$/.test(String(value||'').trim());}
function stage(account){return !account?.phone_verified?'phone':!account?.profile?.onboarded?'profile':'ready';}
module.exports={remember,pending,claim,clear,phoneValid,stage};
