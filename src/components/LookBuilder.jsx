import React,{useState} from 'react';
import {ArrowRight} from 'lucide-react';
import {money} from '../data';
import {looks} from '../lib/looks';
import {getVariant,productHref} from '../lib/catalog';
import {useStore} from '../state/Store';
import Dialog from './Dialog';
import VariantPicker from './VariantPicker';
function LookSelection({look}){
 const {products,addMany,setActiveLook,setCartOpen}=useStore();
 const pieces=look.ids.map(id=>products.find(p=>p.id===id)).filter(Boolean);
 const [choices,setSelection]=useState(()=>pieces.map(p=>({product:p,color:p.color,size:'',chosen:true}))),[error,setError]=useState('');
 const selection=choices.flatMap(item=>{const product=products.find(p=>p.id===item.product.id);return product?[{...item,product,color:product.colors.includes(item.color)?item.color:product.color,size:product.sizes.includes(item.size)?item.size:''}]:[]});
 const update=(index,patch)=>{const id=selection[index].product.id;setSelection(old=>old.map(item=>item.product.id===id?{...item,...patch}:item));setError('')};
 const chosen=selection.filter(item=>item.chosen);
 function submit(event){
  event.preventDefault();
  if(!chosen.length){setError('Escolha pelo menos uma peça para montar o look.');return}
  if(chosen.some(item=>!getVariant(item.product,item.color,item.size)?.stock)){setError('Selecione um tamanho disponível para cada peça escolhida.');return}
  if(addMany(chosen,{openCart:false})){setActiveLook(null);requestAnimationFrame(()=>setCartOpen(true))}
 }
 return <form onSubmit={submit} className="look-selection"><p className="eyebrow">LOOK {look.code} / {look.name}</p><p>Escolha suas peças e encontre a sua proporção.</p>{selection.map((item,index)=><section key={item.product.id} className={`look-piece ${!item.chosen?'not-chosen':''}`}><div className="look-piece-heading"><img src={item.product.images[item.color][0].src} alt={`${item.product.name} — ${item.color}`} width="1086" height="1448"/><div><label><input type="checkbox" checked={item.chosen} onChange={event=>update(index,{chosen:event.target.checked})}/><span>{item.product.name}</span></label><strong>{money(item.product.price)}</strong><a href={'#'+productHref(item.product)} className="text-link" onClick={()=>setActiveLook(null)}>Ver peça ↗</a></div></div>{item.chosen&&<VariantPicker product={item.product} color={item.color} size={item.size} onColor={color=>update(index,{color,size:''})} onSize={size=>update(index,{size})}/>}</section>)}{error&&<p className="selection-error" role="alert">{error}</p>}<div className="look-builder-summary"><p><span>{chosen.length} peça(s) selecionada(s)</span><strong>{money(chosen.reduce((total,item)=>total+item.product.price,0))}</strong></p><button className="button dark full">Adicionar peças escolhidas<ArrowRight size={18}/></button><small>Valores sem desconto e frete. Variantes e estoque fictícios.</small></div></form>;
}
export default function LookBuilder(){
 const {activeLook,setActiveLook}=useStore();
 const look=looks.find(item=>item.code===activeLook);
 return <Dialog open={Boolean(look)} onClose={()=>setActiveLook(null)} title="Montar este look" drawer className="look-builder-dialog">{look&&<LookSelection key={look.code} look={look}/>}</Dialog>;
}
