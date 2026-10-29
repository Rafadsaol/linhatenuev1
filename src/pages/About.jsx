import React from 'react';
import {ArrowUpRight} from 'lucide-react';
import {campaign} from '../data';
import BrandIdentity from '../components/BrandIdentity';
export default function About(){return <main><section className="about-hero"><img src={campaign} alt="Editorial Linha Tênue com símbolo LT Axis"/><div><span className="eyebrow">INDEPENDENT STREETWEAR LABEL / BRASIL</span><h1>ENTRE O COMUM.<br/>E O EXTRAORDINÁRIO.</h1></div></section><BrandIdentity/><section className="section about-copy"><span className="eyebrow">NOSSA PERSPECTIVA</span><h2>MAIS QUE ROUPAS,<br/>UMA PERSPECTIVA.</h2><p>A Linha Tênue nasce da inquietação, da vontade de criar algo que una estética, atitude e identidade. Nossas peças refletem a linha entre o comum e o extraordinário.</p><p>Criamos peças para quem enxerga além do óbvio. Moda como expressão, rua como inspiração, liberdade como base.</p><a href="#/loja" className="button dark">Vista sua perspectiva <ArrowUpRight size={18}/></a></section></main>}
