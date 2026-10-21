import { LOAD_MODE_KEY } from "./loadMode";
import { VISITED_KEY } from "./visits";

/**
 * Sets `data-arrival="pending"` on <html> before the first paint of a hard load, when the
 * page is a platform page this session has not seen and the simulated load is not off.
 * The server cannot know the session, so without this the real content would paint and
 * then be replaced by the skeleton (a flash). The CSS in app/globals.css hides the content
 * and shows the skeleton under the flag; the arrival controller removes it after the load.
 * Blocked storage counts as a revisit: no skeleton. Mirrors lib/arrival/visits + loadMode.
 */
export const ARRIVAL_INIT_SCRIPT = `(function(){try{var p=location.pathname.replace(/\\/+$/,'')||'/';if(!/^\\/platform(\\/|$)/.test(p))return;var m=null;try{m=localStorage.getItem('${LOAD_MODE_KEY}');}catch(e){}if(m==='off')return;var v=JSON.parse(sessionStorage.getItem('${VISITED_KEY}')||'[]');if(Array.isArray(v)&&v.indexOf(p)!==-1)return;document.documentElement.setAttribute('data-arrival','pending');}catch(e){}})();`;
