const theme=require('../../lib/theme');
Component({options:{virtualHost:true,styleIsolation:'isolated'},data:{theme:theme.style()},properties:{number:String,title:String,description:String,label:String,primary:Boolean,disabled:Boolean,divider:Boolean},methods:{press(){if(!this.data.disabled)this.triggerEvent('press');}}});
