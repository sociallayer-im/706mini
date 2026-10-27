// Join only present metadata. Never infer entity type from a display name.
function join(...values){return values.filter(v=>typeof v==='string'||typeof v==='number').map(v=>String(v).trim()).filter(Boolean).join(' · ');}
function typeLabel(item={},locale){const en=locale==='en';if(item.kind==='SPACE')return en?'Space':'空间';if(item.kind==='ORGANIZATION')return en?'Organization':'组织';if(item.type==='Group'||item.type==='entity')return en?'Group':'小组';if(item.type==='User'||item.type==='profile'||item.type==='person'||item.route==='member')return en?'Person':'个人';return '';}
function targetId(item={}){return item.kind==='SPACE'||item.kind==='ORGANIZATION'||item.type==='entity'||item.type==='Group'?item.id:(item.owner||item.id);}
module.exports={join,typeLabel,targetId};
