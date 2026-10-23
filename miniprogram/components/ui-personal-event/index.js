const theme=require('../../lib/theme'),icons=require('../../lib/illustrations'),present=require('../../lib/personal-event'),i18n=require('../../lib/i18n');
Component({options:{virtualHost:true,styleIsolation:'isolated'},data:{theme:theme.style(),icons,view:{}},properties:{item:Object,mode:String,locale:String,busy:Boolean},observers:{'item,mode,locale':function(item,mode,locale){if(item)this.setData({view:present(item,mode,locale,i18n.dictionary(locale))});}},methods:{
 open(){this.triggerEvent('navigate',{route:this.data.view.target,id:this.data.view.event.id});},
 preview(){const url=this.data.view.event.cover_url;if(url)wx.previewImage({current:url,urls:[url]});},
 coverError(){this.setData({'view.event.cover_url':''});},
 act(e){const action=this.data.view.actions[e.currentTarget.dataset.index];if(action&&!this.data.busy)this.triggerEvent(action.op?'action':'navigate',action);}
}});
