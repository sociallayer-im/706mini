// Presentation only: preserve both source fields, suppress only a complete opening summary.
module.exports=function eventContent(record={}){
 const summary=typeof record.summary==='string'?record.summary:'',description=typeof record.description==='string'?record.description:'';
 const canonical=s=>s.replace(/\s+/g,' ').trim(),s=canonical(summary),d=canonical(description);
 const covered=!!s&&(d===s||d.startsWith(s+' '));
 return {detailSummary:covered?'':summary,detailDescription:description};
};
