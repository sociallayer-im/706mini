const theme=require('../../lib/theme');
Component({data:{theme:theme.style()},options:{virtualHost:true,styleIsolation:'isolated'},properties:{label:String,selected:Boolean,rail:Boolean,disabled:Boolean,loading:Boolean,selectionMode:String},methods:{press(){if(!this.data.disabled&&!this.data.loading)this.triggerEvent('press');}}});
