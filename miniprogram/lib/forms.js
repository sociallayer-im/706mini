const definitions={
event:[['title','text',1],['summary','text',1],['description','area',1],['cover_url','image',1],['city','city',1],['starts_at','datetime',1],['ends_at','datetime',1],['organization_id','organization',1],['space_id','space',1],['venue_name','text',1],['address','text',1],['capacity','number',2],['price_minor','number',2],['approval_required','switch',2],['waitlist_enabled','switch',2],['tags','text',2],['fit_description','area',2],['access_type','access',2],['access_value','text',2]],
campaign:[['title','text',1],['kicker','text',1],['introduction','area',1],['cover_url','image',1],['organization_id','organization',1],['event_ids','events',2],['resource_links','area',2]],
profile:[['avatar_url','image',1],['display_name','text',1],['city','city',1],['bio','text',1],['interests','text',2],['introduction','area',2],['wechat','text',3],['share_activity','switch',3]],
entity:[['name','text',1],['introduction','area',1],['cover_url','image',1],['avatar_url','image',1],['address','text',1],['opening_hours','text',1],['public_contact','text',1]]
};
function fields(kind,step,t,values){return definitions[kind].filter(x=>!step||x[2]===step).map(([key,type])=>({key,type:key==='access_value'&&values.access_type==='GROUP_QR'?'image':type,label:t[key]||key,value:values[key]===undefined?'':values[key]}));}
function toForm(r={}){return {...r,tags:(r.tags||[]).join(', '),interests:(r.interests||[]).join(', '),resource_links:(r.resource_links||[]).join('\n'),price_minor:r.price_minor==null?'':String(r.price_minor/100),access_type:r.access?.type||'ORGANIZER_WILL_CONTACT',access_value:r.access?.value||''};}
function payload(kind,f){const p={...f};delete p.access_type;delete p.access_value;
 if(kind==='event'){p.capacity=f.capacity===''||f.capacity==null?null:Number(f.capacity);p.price_minor=Math.round(Number(f.price_minor||0)*100);p.tags=String(f.tags||'').split(/[,，]/).map(s=>s.trim()).filter(Boolean);p.access={type:f.access_type,value:f.access_value};p.visibility='PUBLIC';p.approval_required=!!f.approval_required;p.waitlist_enabled=!!f.waitlist_enabled;}
 if(kind==='profile')p.interests=String(f.interests||'').split(/[,，]/).map(s=>s.trim()).filter(Boolean);
 if(kind==='campaign')p.resource_links=String(f.resource_links||'').split('\n').map(s=>s.trim()).filter(Boolean);
 return p;
}
module.exports={fields,toForm,payload};
