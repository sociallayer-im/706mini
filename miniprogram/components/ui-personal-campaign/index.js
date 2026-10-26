const theme=require('../../lib/theme'),i18n=require('../../lib/i18n');
Component({options:{virtualHost:true,styleIsolation:'isolated'},data:{theme:theme.style(),t:{}},properties:{item:Object,locale:String,busy:Boolean},observers:{locale(locale){this.setData({t:i18n.dictionary(locale)});}},methods:{
 open(){const item=this.data.item;this.triggerEvent('navigate',{id:item.id,route:['DRAFT','CHANGES_REQUESTED'].includes(item.status)?'campaign-edit':item.status==='IN_REVIEW'?'campaign-review-progress':'campaign'});},
 edit(){this.triggerEvent('navigate',{id:this.data.item.id,route:'campaign-edit'});},
 progress(){this.triggerEvent('navigate',{id:this.data.item.id,route:'campaign-review-progress'});},
 remove(){if(!this.data.busy)this.triggerEvent('action',{op:'deleteCampaign',id:this.data.item.id});}
}});
