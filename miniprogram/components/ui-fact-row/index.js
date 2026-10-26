const theme=require('../../lib/theme');
Component({options:{virtualHost:true,styleIsolation:'isolated'},data:{theme:theme.style()},properties:{icon:String,label:String,description:String,interactive:Boolean},methods:{press(){if(this.data.interactive)this.triggerEvent('press');}}});
