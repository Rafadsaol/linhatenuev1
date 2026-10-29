import React, {useEffect,useRef,useState} from 'react';
import {Expand, X, ZoomIn, ZoomOut} from 'lucide-react';

export default function ProductGallery({product,color=product.color}) {
 const [selected,setSelected]=useState(0);
 const images=product.images[color];
 const active=images[selected]||images[0];
 const [open,setOpen]=useState(false);
 const [zoomed,setZoomed]=useState(false);
 const [failed,setFailed]=useState(false);
 const dialog=useRef(null);
 const close=()=>{setOpen(false);setZoomed(false)};
 useEffect(()=>{
  if(!open)return;
  const panel=dialog.current;
  const previousOverflow=document.documentElement.style.overflow;
  panel.showModal();
  document.documentElement.style.overflow='hidden';
  return ()=>{panel.close();document.documentElement.style.overflow=previousOverflow};
 },[open]);
 return <div className="detail-gallery product-gallery">
  <button className="gallery-main product-photo-button" aria-label={`Ampliar foto de ${product.name}`} onClick={()=>setOpen(true)} disabled={failed}>
   <img className="product-photo" src={active.src} alt={active.alt} width="1086" height="1448" fetchPriority="high" onError={()=>setFailed(true)}/>
   {!failed&&<span className="photo-expand"><Expand size={17}/> Ampliar imagem</span>}
  </button>
  {failed&&<p className="photo-error" role="status">Não foi possível carregar a foto. Atualize a página para tentar novamente.</p>}
  <div className="gallery-thumbs v2-thumbs" aria-label="Imagens do produto">{images.map((image,index)=><button key={image.src} className={selected===index?'active':''} aria-label={`Ver ${image.label.toLowerCase()} de ${product.name}`} aria-current={selected===index?'true':undefined} onClick={()=>{setSelected(index);setFailed(false);setZoomed(false)}}><img src={image.src} alt="" width="1086" height="1448"/><span>{image.label}</span></button>)}</div><div className="gallery-caption"><span>LINHA TÊNUE® — {product.fit.toUpperCase()}</span><span>{active.label.toUpperCase()} / {String(selected+1).padStart(2,'0')}</span></div>
  <dialog className="photo-dialog" ref={dialog} onCancel={close} onClose={close} aria-label={`Foto ampliada de ${product.name}`} onClick={e=>{if(e.target===e.currentTarget)close()}}>
   <div className="photo-toolbar"><span>{product.name}</span><div><button onClick={()=>setZoomed(!zoomed)} aria-pressed={zoomed} aria-label={zoomed?'Ajustar foto à tela':'Ver foto em tamanho original'}>{zoomed?<ZoomOut size={19}/>:<ZoomIn size={19}/>}<span>{zoomed?'Ajustar à tela':'Ver detalhes'}</span></button><button onClick={close} aria-label="Fechar foto ampliada" autoFocus><X size={23}/></button></div></div>
   <div className={`photo-viewer${zoomed?' is-zoomed':''}`} tabIndex={0} aria-label="Visualização da foto; use as barras de rolagem para explorar os detalhes">
    {open&&<img src={active.src} alt={`${active.alt} — ampliada`} width="1086" height="1448"/>}
   </div>
  </dialog>
 </div>;
}
