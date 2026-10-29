import {useEffect,useState} from 'react';
export function readRoute() {
 const raw=window.location.hash.slice(1)||'/';
 const url=new URL(raw.startsWith('/')?raw:'/',window.location.origin);
 return {path:url.pathname.replace(/\/$/,'')||'/',search:url.search};
}
export function navigate(path,{replace=false}={}) {
 const target='#'+path;
 if(window.location.hash===target)return;
 const oldURL=window.location.href;
 window.history[replace?'replaceState':'pushState'](null,'',target);
 window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL,newURL:window.location.href}));
}
export function useRoute() {
 const [route,setRoute]=useState(readRoute);
 useEffect(()=>{const onChange=()=>setRoute(readRoute());window.addEventListener('hashchange',onChange);return()=>window.removeEventListener('hashchange',onChange)},[]);
 return route;
}
