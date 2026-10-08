// Central theme parameters. Geometry and source evidence are documented separately.
const tokens={accent:'#A4EFCC',accentText:'#173C2C',ink:'#222222',muted:'#85888C',canvas:'#F3F3F3',surface:'#FFFFFF',line:'#ECEEEF',danger:'#B94747',radius:'32rpx'};
function style(){return Object.entries(tokens).map(([k,v])=>'--'+k+':'+v).join(';');}
module.exports={tokens,style};
