import React from 'react';
import {ArrowUpRight} from 'lucide-react';
import {products,money} from '../data';
import {productHref} from '../lib/catalog';
import {looks} from '../lib/looks';
import {useStore} from '../state/Store';
import CampaignLabel from './CampaignLabel';
export default function Lookbook(){
 const {setActiveLook}=useStore();
 return <section className="section lookbook"><div className="section-title"><div><CampaignLabel code="FRAME / 01—03">SHOP THE LOOK / DROP 001</CampaignLabel><h2>O LOOK É SEU.<br/>A RUA TAMBÉM.</h2></div><p className="section-caption">VOLUME, PROPORÇÃO E IDENTIDADE.<br/>ESCOLHA AS PEÇAS. MONTE A SUA EXPRESSÃO.</p></div><div className="lookbook-grid">{looks.map(look=><article className="lookbook-card" key={look.code}><div className="lookbook-photo"><img src={look.image} alt={look.alt} loading="lazy" width="1536" height="1024"/><span>LOOK {look.code} / LT AXIS</span></div><div className="lookbook-caption"><h3>{look.name}</h3><span>DUAS PEÇAS / UMA PERSPECTIVA</span></div><div className="lookbook-pieces">{look.ids.map(id=>{const p=products.find(p=>p.id===id);return <a key={id} href={'#'+productHref(p)}><span>{p.name}</span><span>{money(p.price)} <ArrowUpRight size={15}/></span></a>})}</div><div className="look-total"><span>Look completo <strong>{money(look.ids.reduce((sum,id)=>sum+products.find(p=>p.id===id).price,0))}</strong></span><button className="button dark" onClick={()=>setActiveLook(look.code)} aria-label={`Montar este look: ${look.name}`}>Montar este look<ArrowUpRight size={17}/></button></div></article>)}</div></section>;
}
