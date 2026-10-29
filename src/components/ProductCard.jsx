import React from 'react';
import {Eye,Heart} from 'lucide-react';
import ProductImage from './ProductImage';
import {money} from '../data';
import {productHref} from '../lib/catalog';
import {useStore} from '../state/Store';
export default function ProductCard({p}){
 const {favorites,toggleFavorite,setQuickView}=useStore();
 const favorite=favorites.includes(p.id);
 const secondary=p.images[p.color]?.[1];
 const soldOut=!p.variants.some(v=>v.stock>0);
 return <article className="product-card">
  <div className="product-image">
   <a className="product-picture-link" href={'#'+productHref(p)} aria-label={`Ver ${p.name}`}>
    <ProductImage product={p}/>
    {secondary&&<img className="card-secondary" src={secondary.src} alt="" loading="lazy" decoding="async" width="1086" height="1448"/>}
    {(soldOut||p.tag)&&<span className="tag blue">{soldOut?'ESGOTADO · DEMO':p.tag}</span>}
   </a>
   <button className={`favorite-button ${favorite?'is-favorite':''}`} aria-label={`${favorite?'Remover':'Salvar'} ${p.name} ${favorite?'dos':'nos'} favoritos`} aria-pressed={favorite} onClick={()=>toggleFavorite(p)}><Heart size={19} fill={favorite?'currentColor':'none'}/></button>
   <button className="quick-view-trigger" aria-haspopup="dialog" aria-label={`Visualização rápida de ${p.name}`} onClick={()=>setQuickView(p.id)}><Eye size={17}/><span>Quick view</span></button>
  </div>
  <a className="product-info" href={'#'+productHref(p)}><div><h3>{p.name}</h3><p>{p.fit} · {p.audience} · {p.color}</p></div><span>{money(p.price)}</span></a>
 </article>;
}
