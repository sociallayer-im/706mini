const theme=require('../../lib/theme');
Component({data:{theme:theme.style()},options:{virtualHost:true,styleIsolation:'isolated'},properties:{label:String,selected:Boolean},methods:{press(){this.triggerEvent('press');}}});
