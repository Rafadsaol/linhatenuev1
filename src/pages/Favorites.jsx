import React from 'react';
import {ArrowRight,Heart} from 'lucide-react';
import {useStore} from '../state/Store';
import ProductCard from '../components/ProductCard';
export default function Favorites(){
 const {products,favorites}=useStore();
 const saved=products.filter(p=>favorites.includes(p.id));
 return <main className="section favorites-page"><span className="eyebrow">SUA CURADORIA / LT AXIS</span><h1>NA SUA<br/>FREQUÊNCIA<span className="electric">.</span></h1><p className="page-intro">{saved.length} peça{saved.length===1?'':'s'} salva{saved.length===1?'':'s'} para revisitar.</p>{saved.length?<div className="product-grid">{saved.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<div className="empty"><Heart size={38}/><h2>SALVE O QUE TE REPRESENTA.</h2><p>Toque no coração das peças para montar sua seleção.</p><a href="#/loja" className="button dark">Explorar coleção <ArrowRight size={18}/></a></div>}</main>;
}
