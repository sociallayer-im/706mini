// Public profile affiliations are separate from editor-selected spaces and admin roles.
module.exports=function memberRelations(rows){
 const primary=require('./prototype').people;
 for(const person of primary){
  const p=rows.find(r=>r.id==='profile-'+person.id);if(!p)continue;
  p.featured_entities=['demo-product-org','demo-space'];
  const id='member-product-'+person.id;
  if(!rows.some(r=>r.id===id))rows.push({id,type:'membership',owner:person.id,parent:'demo-product-org',status:'ACTIVE',version:1,contribution:'参与产品共创',created_at:p.created_at,updated_at:p.updated_at});
 }
 // Reuse existing completed participations: no registration/count/status changes.
 for(let n=0;n<23;n++){const e=rows.find(r=>r.id==='profile-history-'+n);if(e)e.space_id=n<6?'demo-space':'demo-sola-space';}
};
