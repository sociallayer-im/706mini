const config=require('../config');
const real=require('./montana'),mock=require('./mock/index');
function mode(){const selected=wx.getStorageSync('706.transport')||config.mode;return selected==='montana'?'montana':'mock';}
function adapter(){return mode()==='mock'?mock:real;}
const api={mode,isMock:()=>mode()==='mock',mock,setMode(value){if(!['mock','montana'].includes(value))throw Error('INVALID_MODE');real.close();wx.setStorageSync('706.transport',value);}};
for(const method of ['call','login','logout','close','session','setSession'])api[method]=(...args)=>adapter()[method](...args);
module.exports=api;
