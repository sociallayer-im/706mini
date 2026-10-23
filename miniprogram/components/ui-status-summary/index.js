const theme=require('../../lib/theme');
Component({options:{virtualHost:true,styleIsolation:'isolated'},data:{theme:theme.style()},properties:{title:String,icon:String}});
