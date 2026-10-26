const documents={terms:require('../content/user-agreement'),privacy:require('../content/privacy-policy')};
module.exports=function legalDocument(kind,locale){
 const doc=documents[kind];if(!doc)throw Error('UNKNOWN_DOCUMENT');
 return {title:locale==='en'?(kind==='terms'?'User Agreement · Chinese draft':'Privacy Policy · Chinese draft'):doc.title,version:doc.version,text:doc.sections.map(section=>section.title+'\n'+section.text).join('\n\n')};
};
