import React from 'react';
import {Minus,Plus} from 'lucide-react';
import {money} from '../data';
import {getVariant,productHref} from '../lib/catalog';
import {lineKey} from '../lib/cart';
import {useStore} from '../state/Store';
export default function CartItems(){
 const {products,cart,changeQuantity,remove}=useStore();
 return <div className="cart-items">{cart.map(line=>{
  const p=products.find(p=>p.id===line.id),key=lineKey(line),variant=getVariant(p,line.color,line.size);
  return <div className="cart-item" key={key}>
   <a href={'#'+productHref(p)}><img src={variant.image} alt={`${p.name} ${line.color}`} width="1086" height="1448"/></a>
   <div><a href={'#'+productHref(p)}><h3>{p.name}</h3></a><p>{line.color} / {line.size}</p>
    <div className="quantity"><button aria-label={`Diminuir quantidade de ${p.name}`} disabled={line.qty<=1} onClick={()=>changeQuantity(key,line.qty-1)}><Minus size={14}/></button><span aria-live="polite">{line.qty}</span><button aria-label={`Aumentar quantidade de ${p.name}`} disabled={line.qty>=variant.stock} onClick={()=>changeQuantity(key,line.qty+1)}><Plus size={14}/></button></div>
    <button className="remove" onClick={()=>remove(key)}>Remover <span className="sr-only">{p.name}</span></button>
   </div><strong>{money(p.price*line.qty)}</strong>
  </div>;
 })}</div>;
}
