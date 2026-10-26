Component({
 options:{virtualHost:true,styleIsolation:'isolated'},
 properties:{checked:Boolean,disabled:Boolean,label:String,layout:{type:String,value:'list'}},
 data:{options:[],value:[]},
 observers:{'checked,label':function(checked,label){this.setData({options:[{value:'checked',label}],value:checked?['checked']:[]});}},
 methods:{change(e){this.triggerEvent('change',{value:e.detail.value,checked:e.detail.value.length>0});}}
});
