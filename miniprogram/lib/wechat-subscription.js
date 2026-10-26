// Invoke directly in a user gesture; authorization is separate from login.
module.exports=function requestActivityReminders(runtime,{enabled,demo,templateIds=[]}){
 if(!enabled)return Promise.resolve({status:'off',accepted:false});
 if(demo)return Promise.resolve({status:'demo',accepted:false});
 const tmplIds=[...new Set(templateIds.filter(id=>typeof id==='string'&&id.trim()))].slice(0,3);
 if(!tmplIds.length||typeof runtime.requestSubscribeMessage!=='function')return Promise.resolve({status:'unavailable',accepted:false});
 return new Promise(resolve=>{
  try{runtime.requestSubscribeMessage({tmplIds,success:result=>resolve({status:'resolved',accepted:tmplIds.some(id=>result[id]==='accept'),results:Object.fromEntries(tmplIds.map(id=>[id,result[id]||'reject']))}),fail:()=>resolve({status:'failed',accepted:false})});}
  catch{resolve({status:'failed',accepted:false});}
 });
};
