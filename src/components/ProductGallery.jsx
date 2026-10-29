import React, {useEffect,useRef,useState} from 'react';
import {Expand, X, ZoomIn, ZoomOut} from 'lucide-react';

export default function ProductGallery({product}) {
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
   <img className="product-photo" src={product.detailImage} alt={`${product.name} — vista frontal`} width="1086" height="1448" fetchPriority="high" onError={()=>setFailed(true)}/>
   {!failed&&<span className="photo-expand"><Expand size={17}/> Ampliar imagem</span>}
  </button>
  {failed&&<p className="photo-error" role="status">Não foi possível carregar a foto. Atualize a página para tentar novamente.</p>}
  <div className="gallery-caption"><span>LINHA TÊNUE® — {product.fit.toUpperCase()}</span><span>VISTA FRONTAL</span></div>
  <dialog className="photo-dialog" ref={dialog} onCancel={close} onClose={close} aria-label={`Foto ampliada de ${product.name}`} onClick={e=>{if(e.target===e.currentTarget)close()}}>
   <div className="photo-toolbar"><span>{product.name}</span><div><button onClick={()=>setZoomed(!zoomed)} aria-pressed={zoomed} aria-label={zoomed?'Ajustar foto à tela':'Ver foto em tamanho original'}>{zoomed?<ZoomOut size={19}/>:<ZoomIn size={19}/>}<span>{zoomed?'Ajustar à tela':'Ver detalhes'}</span></button><button onClick={close} aria-label="Fechar foto ampliada" autoFocus><X size={23}/></button></div></div>
   <div className={`photo-viewer${zoomed?' is-zoomed':''}`} tabIndex={0} aria-label="Visualização da foto; use as barras de rolagem para explorar os detalhes">
    {open&&<img src={product.detailImage} alt={`${product.name} — foto ampliada`} width="1086" height="1448"/>}
   </div>
  </dialog>
 </div>;
}
