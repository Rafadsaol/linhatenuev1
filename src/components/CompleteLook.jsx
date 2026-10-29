import React from 'react';
import {ArrowUpRight} from 'lucide-react';
import {completeLookProducts} from '../lib/campaign';
import CampaignLabel from './CampaignLabel';
import ProductCard from './ProductCard';
import {useStore} from '../state/Store';
export default function CompleteLook({product}){
 const {products}=useStore();
 const pieces=completeLookProducts(product,products);
 return <section className="complete-look" aria-labelledby="complete-look-title"><div className="complete-look-copy"><CampaignLabel code="STYLING / 001">SHOP THE LOOK</CampaignLabel><h2 id="complete-look-title">COMPLETE<br/>O LOOK.</h2><p>{product.kind==='pants'?'Encontre a silhueta que equilibra o seu denim.':'O contraste certo começa na combinação.'} A sua identidade, da cabeça aos pés.</p><a href="#/loja" className="campaign-link">Explorar coleção<ArrowUpRight size={17}/></a></div><div className={`complete-look-grid look-count-${pieces.length}`}>{pieces.map(p=><ProductCard p={p} key={p.id}/>)}</div></section>;
}
