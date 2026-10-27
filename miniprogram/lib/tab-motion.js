// Direction for the four main tabs. Higher index enters from the right.
const tabs=['feed','discover','messages','me'];
const LEAVE_MS=180;
let pending=null;
function begin(from,to){if(from===to||from<0||to<0)return;pending={from,to,at:Date.now()};}
function current(){if(pending&&Date.now()-pending.at>1000)pending=null;return pending;}
function hides(route){const motion=current();return !!(motion&&tabs[motion.from]===route);}
function consume(route){const motion=current();if(!motion||tabs[motion.to]!==route)return '';pending=null;return motion.to>motion.from?'enter-right':'enter-left';}
module.exports={tabs,LEAVE_MS,begin,hides,consume};
