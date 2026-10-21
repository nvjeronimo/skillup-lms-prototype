import { LOAD_MODE_KEY } from "./loadMode";
import { VISITED_KEY } from "./visits";

/**
 * Sets `data-arrival="pending"` on <html> before the first paint of a hard load, when the
 * page is a platform page or a player topic (keyed by the topic, its Notes / Downloads tabs
 * included: topicArrivalPath) this session has not seen and the simulated load is not off.
 * On a topic of a course the session has not opened yet it also sets `data-arrival-course`
 * (whatever the load mode): the shell's rings are drawn empty from the first paint until the
 * course arrival (useCourseArrival) has armed them, so a hard load never shows them full first.
 * The server cannot know the session, so without this the real content would paint and
 * then be replaced by the skeleton (a flash). The CSS in app/globals.css hides the content
 * and shows the skeleton under the flag; the arrival controller removes it after the load.
 * Blocked storage counts as a revisit: no skeleton; a junk visited list counts as a first
 * visit, as parseVisited reads it. The path is decoded, as arrivalKey does.
 * Failsafe: if the page never takes over (JS fails before the controller mounts), a timer
 * (window.__skArrivalFs, ARRIVAL_FAILSAFE_MS: Slow's 2 s plus hydration) drops the flag so the
 * content shows; the controller clears it first thing. Mirrors lib/arrival/visits + loadMode.
 */
export const ARRIVAL_FAILSAFE_MS = 4000;

export const ARRIVAL_INIT_SCRIPT = `(function(){try{var p=location.pathname.replace(/\\/+$/,'');try{p=decodeURI(p);}catch(e){}p=p||'/';var c=null;var t=/^\\/course\\/([^/]+)\\/topic\\/[^/]+/.exec(p);if(t){p=t[0];c='/course/'+t[1];}else if(!/^\\/platform(\\/|$)/.test(p))return;var m=null;try{m=localStorage.getItem('${LOAD_MODE_KEY}');}catch(e){}var raw=sessionStorage.getItem('${VISITED_KEY}');var v=[];try{v=JSON.parse(raw||'[]');}catch(e){}if(!Array.isArray(v))v=[];var d=document.documentElement;var body=m!=='off'&&v.indexOf(p)===-1;var course=c!==null&&v.indexOf(c)===-1;if(!body&&!course)return;if(body)d.setAttribute('data-arrival','pending');if(course)d.setAttribute('data-arrival-course','');window.__skArrivalFs=setTimeout(function(){d.removeAttribute('data-arrival');d.removeAttribute('data-arrival-course');},${ARRIVAL_FAILSAFE_MS});}catch(e){}})();`;
