export type NodeComponent<P> = (props?: P) => HTMLElement;
export interface ButtonProps {label?:string;variant?:'primary'|'secondary'|'text'|'danger'|'selected';compact?:boolean;block?:boolean;align?:'center'|'start';disabled?:boolean;loading?:boolean;onPress?:()=>void}
export interface ChoiceGroupProps {options?:{value:string;label:string;description?:string;disabled?:boolean}[];value?:string[];mode?:'single'|'multiple';layout?:'tags'|'list';max?:number;disabled?:boolean;onChange?:(value:string[])=>void}
export interface SheetProps {title?:string;content?:Node;actions?:ButtonProps[];loading?:boolean;error?:string}
export interface DS706Library {Button:NodeComponent<ButtonProps>;ChoiceGroup:NodeComponent<ChoiceGroupProps>;Sheet:(props?:SheetProps)=>HTMLDialogElement;mount:(target:HTMLElement,name:string,props?:Record<string,unknown>)=>HTMLElement;
/** icon:string; label:string; size:number; surface:surface|plain|glass; disabled:boolean; onPress:()=>void */
IconButton:NodeComponent<Record<string,unknown>>;
/** label:string; checked,disabled:boolean; onChange:(checked:boolean)=>void */
Checkbox:NodeComponent<Record<string,unknown>>;
/** label:string; selected,disabled:boolean; onChange:(selected)=>void */
FilterChip:NodeComponent<Record<string,unknown>>;
/** title,description,value,icon:string; danger:boolean; onPress?:()=>void */
ActionRow:NodeComponent<Record<string,unknown>>;
/** label,value,hint,error,placeholder,name,type:string; multiline,required,disabled:boolean; onChange:(value)=>void */
FormField:NodeComponent<Record<string,unknown>>;
/** label,hint:string; checked,disabled:boolean; onChange:(checked)=>void */
Switch:NodeComponent<Record<string,unknown>>;
/** label,value:string; disabled:boolean; onChange:(value)=>void */
DateTimePicker:NodeComponent<Record<string,unknown>>;
/** max:number; disabled:boolean; change事件:{count} */
MediaUploader:NodeComponent<Record<string,unknown>>;
/** items:string[] */
Gallery:NodeComponent<Record<string,unknown>>;
/** name,src:string; size:number */
Avatar:NodeComponent<Record<string,unknown>>;
/** name,bio:string; following:boolean */
PersonCard:NodeComponent<Record<string,unknown>>;
/** title,status,date,venue,host,fee,cover:string; large:boolean; onOpen:()=>void */
EventCard:NodeComponent<Record<string,unknown>>;
/** EventCard参数; status,description,action:string */
PersonalEvent:NodeComponent<Record<string,unknown>>;
/** title,status,description:string */
PersonalCampaign:NodeComponent<Record<string,unknown>>;
/** items:{title,description}[] */
FeatureCarousel:NodeComponent<Record<string,unknown>>;
/** name,text:string; EventCard参数 */
FeedItem:NodeComponent<Record<string,unknown>>;
/** title,description:string; read:boolean; read事件 */
NotificationItem:NodeComponent<Record<string,unknown>>;
/** year,month,value:number; events:Record<YYYY-MM-DD,number>; onChange:(detail)=>void; datechange事件:{selected,year,month} */
Calendar:NodeComponent<Record<string,unknown>>;
/** title,description,state,action:string; compact:boolean; onPress:()=>void */
StatusSummary:NodeComponent<Record<string,unknown>>;
/** number:number; title,description,action:string; onPress:()=>void */
AccessStep:NodeComponent<Record<string,unknown>>;
/** items:{title,description,state}[] */
ReviewHistory:NodeComponent<Record<string,unknown>>;
/** items:string[]; value:string; navigate事件 */
Navigation:NodeComponent<Record<string,unknown>>;
/** items:string[]; current:number */
Stepper:NodeComponent<Record<string,unknown>>;
/** title,description,action:string; onPress:()=>void */
EmptyState:NodeComponent<Record<string,unknown>>;
/** refresh:boolean */
LoadingState:NodeComponent<Record<string,unknown>>;
/** text,state,action:string; onPress:()=>void */
Notice:NodeComponent<Record<string,unknown>>;
/** title,action:string; children:Node; onPress:()=>void */
Section:NodeComponent<Record<string,unknown>>;
/** title,description,address:string */
EntityCard:NodeComponent<Record<string,unknown>>;
/** name,text:string */
CommentThread:NodeComponent<Record<string,unknown>>;
/** items:{title,description,url?}[] */
LinkList:NodeComponent<Record<string,unknown>>;
/** label,value,placeholder:string; onSearch:(query)=>void; search事件 */
SearchField:NodeComponent<Record<string,unknown>>;
/** ChoiceGroup参数 */
SegmentedControl:NodeComponent<Record<string,unknown>>;
/** name,description,src:string; size:number */
IdentityRow:NodeComponent<Record<string,unknown>>;
/** value:number; label:string; onPress:()=>void */
StatLink:NodeComponent<Record<string,unknown>>;
/** items:ActionRowProps[] */
MenuGroup:NodeComponent<Record<string,unknown>>;
/** title,description,action:string; onPress:()=>void */
PermissionState:NodeComponent<Record<string,unknown>>;
/** label:string */
Badge:NodeComponent<Record<string,unknown>>;
/** actions:ButtonProps[] */
FloatingBar:NodeComponent<Record<string,unknown>>;
/** following,disabled,loading:boolean; onChange:(following)=>void */
FollowControl:NodeComponent<Record<string,unknown>>;
/** names:string[]; label:string */
ParticipantSummary:NodeComponent<Record<string,unknown>>;
}
declare global {interface Window {DS706:DS706Library}}
