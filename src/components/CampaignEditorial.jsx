import React from 'react';
import {ArrowUpRight} from 'lucide-react';
import {BrandMark} from './BrandLogo';
import CampaignLabel from './CampaignLabel';
import {streetImages} from '../lib/campaign';
export default function CampaignEditorial({image=streetImages.hero,alt='Street Campaign Linha Tênue',code='CAMPAIGN / 001',title='A RUA É O PONTO DE PARTIDA.',copy='Entre o básico e o extraordinário, existe a sua forma de estar no mundo.',href='#/campanha',cta='Ver campanha',className=''}){
 return <section className={`campaign-editorial ${className}`}><img src={image} alt={alt} width="1536" height="1024" loading="lazy" decoding="async"/><div className="editorial-shade"/><div className="editorial-content"><CampaignLabel code="LT AXIS">{code}</CampaignLabel><h2>{title}</h2><p>{copy}</p><a href={href} className="campaign-link">{cta}<ArrowUpRight size={19}/></a></div><BrandMark className="editorial-signature"/></section>;
}
export function CatalogCampaign(){return <article className="catalog-campaign" aria-label="Editorial Street Campaign"><div className="catalog-campaign-image"><img src={streetImages.core} alt="Campanha com camisetas boxy e denim amplo" width="1536" height="1024" loading="lazy"/></div><div className="catalog-campaign-copy"><CampaignLabel code="01 / 18">STREET CAMPAIGN</CampaignLabel><h2>DA RUA.<br/>PRA SUA FORMA.</h2><p>Mais que uma coleção. Uma perspectiva para vestir.</p><a className="campaign-link" href="#/campanha">Explore a campanha<ArrowUpRight size={18}/></a></div><span className="catalog-campaign-axis" aria-hidden="true"/></article>}
