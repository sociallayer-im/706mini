// The same definition is applied to all pages from either real or offline mine APIs.
module.exports=function summary(events,registrations,campaigns,now=new Date().toISOString()){
 return {drafts:events.filter(e=>e.status==='DRAFT').length,registrations:registrations.filter(r=>['REQUESTED','APPROVED_AWAITING_PAYMENT','CONFIRMED'].includes(r.status)&&r.event?.ends_at>now).length,events:events.filter(e=>['PUBLISHED','IN_REVIEW','CHANGES_REQUESTED'].includes(e.status)&&e.ends_at>now).length,campaigns:campaigns.filter(c=>c.status==='IN_REVIEW').length,campaignId:campaigns.find(c=>c.status==='IN_REVIEW')?.id||''};
};
