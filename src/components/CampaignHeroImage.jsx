import React,{useCallback,useEffect,useRef,useState} from 'react';

export default function CampaignHeroImage({src,focusX}){
 const ref=useRef(null),[position,setPosition]=useState('center top');
 const frame=useCallback(()=>{
  const img=ref.current;if(!img?.naturalWidth||!img.clientWidth||!img.clientHeight)return;
  const scale=Math.max(img.clientWidth/img.naturalWidth,img.clientHeight/img.naturalHeight);
  const width=img.naturalWidth*scale;
  const offset=Math.max(0,Math.min(width-img.clientWidth,focusX*width-img.clientWidth/2));
  setPosition(`${-offset}px top`);
 },[focusX]);
 useEffect(()=>{
  frame();
  if(!('ResizeObserver' in window)){window.addEventListener('resize',frame);return()=>window.removeEventListener('resize',frame)}
  const observer=new ResizeObserver(frame);observer.observe(ref.current);return()=>observer.disconnect();
 },[frame,src]);
 return <img ref={ref} id="campaign-hero-photo" className="hero-photo" src={src} alt="Campanha Linha Tênue — modelagem e identidade LT Axis" fetchPriority="high" onLoad={frame} style={{'--hero-mobile-position':position}}/>;
}
