import React,{useEffect,useRef} from 'react';
import {X} from 'lucide-react';
export default function Dialog({open,onClose,title,children,drawer=false,className='',initialFocus}) {
 const ref=useRef(null);
 const closeRef=useRef(onClose);closeRef.current=onClose;
 useEffect(()=>{
  if(!open)return;
  const dialog=ref.current;
  const previous=document.documentElement.style.overflow;
  dialog.showModal();document.documentElement.style.overflow='hidden';
  if(initialFocus)dialog.querySelector(initialFocus)?.focus();
  return()=>{dialog.close();document.documentElement.style.overflow=previous};
 },[open,initialFocus]);
 function containFocus(event){
  if(event.key!=='Tab')return;
  event.stopPropagation();
  const controls=[...event.currentTarget.querySelectorAll('button,[href],input,select,textarea,[tabindex]')].filter(node=>node.tabIndex>=0&&!node.disabled&&node.getClientRects().length&&!node.closest('[inert]'));
  const first=controls[0],last=controls.at(-1);
  if(!first){event.preventDefault();event.currentTarget.focus();return}
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 }
 return <dialog ref={ref} className={`ui-dialog ${drawer?'ui-drawer':''} ${className}`} aria-label={title} onKeyDown={containFocus} onCancel={event=>{event.stopPropagation();closeRef.current()}} onClose={event=>{event.stopPropagation();closeRef.current()}} onClick={e=>{if(e.target===e.currentTarget)closeRef.current()}}>
  <div className="dialog-heading"><h2>{title}</h2><button type="button" className="icon-button" aria-label={`Fechar ${title.toLowerCase()}`} onClick={onClose}><X size={22}/></button></div>
  {open&&<div className="dialog-body">{children}</div>}
 </dialog>;
}
