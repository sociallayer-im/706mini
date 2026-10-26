const theme=require('../../lib/theme');
Component({
 options:{virtualHost:true,styleIsolation:'isolated'},
 properties:{checked:Boolean,custom:Boolean,secondary:Boolean,disabled:Boolean,label:String,layout:{type:String,value:'list'}},
 data:{theme:theme.style(),options:[],value:[]},
 observers:{'checked,label':function(checked,label){this.setData({options:[{value:'checked',label}],value:checked?['checked']:[]});}},
 methods:{change(e){this.triggerEvent('change',{value:e.detail.value,checked:e.detail.value.length>0});}}
});
