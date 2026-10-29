import React from 'react';
import {ArrowUpRight} from 'lucide-react';
import {products,money} from '../data';
import {productHref} from '../lib/catalog';
import {streetImages} from '../lib/campaign';
import CampaignLabel from './CampaignLabel';
const looks=[
 {code:'01',name:'Forma em equilíbrio',image:streetImages.hero,alt:'Boxy Fit preta e cropped off-white com denim amplo',ids:[9,5,13,16]},
 {code:'02',name:'O essencial tem presença',image:streetImages.core,alt:'Boxy Fit off-white e baby tee azul em composição com denim',ids:[10,5,15,16]},
];
export default function Lookbook(){return <section className="section lookbook"><div className="section-title"><div><CampaignLabel code="FRAME / 01—02">LOOKBOOK / DROP 001</CampaignLabel><h2>O LOOK É SEU.<br/>A RUA TAMBÉM.</h2></div><p className="section-caption">VOLUME, PROPORÇÃO E IDENTIDADE.<br/>ENCONTRE AS PEÇAS DE CADA LOOK.</p></div><div className="lookbook-grid">{looks.map(look=><article className="lookbook-card" key={look.code}><div className="lookbook-photo"><img src={look.image} alt={look.alt} loading="lazy" width="1536" height="1024"/><span>LOOK {look.code} / LT AXIS</span></div><div className="lookbook-caption"><h3>{look.name}</h3><span>MONTE O LOOK ↓</span></div><div className="lookbook-pieces">{look.ids.map(id=>{const p=products.find(p=>p.id===id);return <a key={id} href={'#'+productHref(p)}><span>{p.name}</span><span>{money(p.price)} <ArrowUpRight size={15}/></span></a>})}</div></article>)}</div></section>}
