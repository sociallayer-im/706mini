// Align application controls with WeChat's real menu capsule. Dimensions are
// CSS pixels, not rpx; the right-hand exclusion area must survive device changes.
module.exports=function navigationLayout(runtime){
 let windowInfo={},menu;
 try{windowInfo=runtime.getWindowInfo?runtime.getWindowInfo():{};}catch(e){}
 const width=windowInfo.windowWidth||375,statusBar=windowInfo.statusBarHeight||20;
 try{menu=runtime.getMenuButtonBoundingClientRect?.();}catch(e){}
 if(!menu||!Number.isFinite(menu.top)||menu.height<=0||menu.left<=0){
  menu={top:statusBar+8,height:32,left:width-104};
 }
 // A menu capsule is visual chrome, not the height of our interactive controls.
 const navigationHeight=Math.max(menu.height,parseFloat(require('./theme').tokens.touchTarget)),navigationTop=Math.max(statusBar,menu.top-(navigationHeight-menu.height)/2);
 return {navigationTop,navigationHeight,menuTop:menu.top,menuHeight:menu.height,menuRightInset:Math.max(104,width-menu.left+12),headerHeight:navigationTop+navigationHeight+24,nativeTabReserve:nativeTabReserve(windowInfo)};
};
// Pages already pad for the capsule. Subtract only the slot WeChat itself
// removed from the window, so a custom tab bar does not leave a second gap.
function nativeTabReserve(info){
 const screen=info.screenHeight||0,height=info.windowHeight||0,status=info.statusBarHeight||0;
 if(!screen||!height||height>=screen-1)return 0;
 const gap=screen-height,reserve=gap>status+20?gap-status:gap>=40&&gap<=140?gap:0;
 return Math.min(reserve,120);
}
