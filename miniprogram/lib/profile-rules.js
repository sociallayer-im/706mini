// Keep the user's own words. Limits count Unicode code points, not UTF-16 units.
const limits={bio:80,introduction:300};
const length=value=>Array.from(String(value||'')).length;
function validate(values){
 for(const [key,max]of Object.entries(limits))if(values[key]!==undefined&&length(values[key])>max)return key;
 return '';
}
module.exports={limits,length,validate};
