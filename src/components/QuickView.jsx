import React,{useId,useState} from 'react';
import {ArrowRight} from 'lucide-react';
import {products,money} from '../data';
import {productHref} from '../lib/catalog';
import {useStore} from '../state/Store';
import Dialog from './Dialog';
import VariantPicker from './VariantPicker';
import CampaignLabel from './CampaignLabel';
import PhotoViewControls from './PhotoViewControls';
function QuickViewContent({product}){
 const {add,setQuickView,setCartOpen}=useStore();
 const [color,setColor]=useState(product.color),[size,setSize]=useState(''),[quantity,setQuantity]=useState(1),[error,setError]=useState('');
 const [showFinish,setShowFinish]=useState(false);
 const photoId=useId();
 const photo=product.images[color][showFinish?1:0]||product.images[color][0];
 function submit(event){
  event.preventDefault();
  if(!size){setError('Selecione um tamanho para adicionar esta peça.');return}
  if(add(product,color,size,quantity,{openCart:false})){setQuickView(null);requestAnimationFrame(()=>setCartOpen(true))}
 }
 return <form className="quick-view-layout" onSubmit={submit}><div className="quick-view-media"><div className="quick-view-photo" id={photoId}><img src={photo.src} alt={photo.alt} width="1086" height="1448"/></div><PhotoViewControls product={product} showFinish={showFinish} onChange={setShowFinish} photoId={photoId}/><small className="quick-view-photo-caption" aria-live="polite">{showFinish?'Detalhe ilustrativo do tecido e acabamento LT Axis.':'Foto frontal / peça conceitual.'}</small></div><div className="quick-view-details"><CampaignLabel code="QUICK VIEW / LT AXIS">A SUA PRÓXIMA PEÇA</CampaignLabel><h3>{product.name}</h3><strong className="quick-view-price">{money(product.price)}</strong><p>{product.shortDescription}</p><VariantPicker product={product} color={color} size={size} quantity={quantity} onColor={value=>{setColor(value);setSize('');setQuantity(1);setError('')}} onSize={value=>{setSize(value);setQuantity(1);setError('')}} onQuantity={setQuantity}/>{error&&<p className="selection-error" role="alert">{error}</p>}<button className="button dark full" disabled={!product.variants.some(v=>v.stock)}>Adicionar à sacola<ArrowRight size={18}/></button><a className="campaign-link" href={'#'+productHref(product)} onClick={()=>setQuickView(null)}>Ver detalhes completos<ArrowRight size={16}/></a><small>Peça conceitual / experiência de portfólio.</small></div></form>;
}
export default function QuickView(){
 const {quickView,setQuickView}=useStore();
 const product=products.find(p=>p.id===quickView);
 return <Dialog open={Boolean(product)} onClose={()=>setQuickView(null)} title="Visualização rápida" className="quick-view-dialog">{product&&<QuickViewContent key={product.id} product={product}/>}</Dialog>;
}
