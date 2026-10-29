import React from 'react';
import {ArrowUpRight, ArrowRight, Globe, Instagram} from 'lucide-react';
import {campaign,lifestyle,products} from '../data';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
const categories=[
 {name:'Camisetas Boxy',sub:'ARTE EM FORMA DE PEÇA',product:products[7]},
 {name:'Calças Baggy',sub:'FEITAS PARA O SEU RITMO',product:products[4]},
 {name:'Essentials',sub:'O ESSENCIAL TEM ATITUDE',product:products[6]},
 {name:'Drops Limitados',sub:'FORA DE QUALQUER PADRÃO',product:products[2]}
];
export default function Home({goCategory}){return <>
 <section className="hero">
  <img className="hero-photo" src={campaign} alt="Modelo com camiseta boxy preta de estampa gráfica azul e branca, boné e jeans baggy" fetchPriority="high"/>
  <div className="hero-shade"/>
  <div className="hero-top"><span>LINHA TÊNUE® / INDEPENDENT STREETWEAR</span><span>COLEÇÃO 001 — BRASIL</span></div>
  <div className="hero-copy"><span className="drop-label"><i/> DROP 001 <span>✕✕✕</span></span><h1>SEM<br/>PADRÃO.<br/>SEM LIMITES.</h1><p>A LINHA ENTRE O COMUM<br/>E O EXTRAORDINÁRIO.</p><a className="button light" href="#/loja">Explorar coleção <ArrowRight size={18}/></a></div>
  <div className="hero-art" aria-hidden="true">ARTE<br/>MODA<br/>RUA<br/>LIBERDADE<Globe strokeWidth={1}/></div>
  <div className="campaign-strip" aria-label="Explore o drop">{[0,2,3].map(i=><a key={i} href={`#/produto/${products[i].id}`} aria-label={products[i].name}><ProductImage product={products[i]} decorative/></a>)}<span>001 / THE FIRST LINE</span></div>
  <div className="hero-bottom"><span>NO RULES. JUST EXPRESSION.</span><button onClick={()=>document.getElementById('categorias').scrollIntoView({behavior:'smooth'})}>EXPLORE ↓</button></div>
 </section>
 <section className="categories section" id="categorias"><div className="category-grid">{categories.map((c,i)=><button className={`category category-${i}`} key={c.name} onClick={()=>goCategory(c.name)}><ProductImage product={c.product} decorative/><div><h3>{c.name}</h3><small>{c.sub}</small><ArrowUpRight size={18}/></div><span className="category-number">/// 0{i+1}</span></button>)}</div></section>
 <section className="section new"><div className="section-title"><h2>NOVOS LANÇAMENTOS</h2><p className="section-caption">PEÇAS QUE TRANSITAM<br/>ENTRE O ESSENCIAL E O INESPERADO.</p><a className="text-link" href="#/loja">Ver todos <ArrowRight size={16}/></a></div><div className="product-grid">{[products[0],products[1],products[2],products[4]].map(p=><ProductCard p={p} key={p.id}/>)}</div><div className="drop-footnote"><span>DROP 001 / QUANTIDADES LIMITADAS</span><span>DESIGN INDEPENDENTE. EXPRESSÃO SEM LIMITES.</span></div></section>
 <section className="manifesto"><div className="manifesto-image"><img src={lifestyle} alt="Camiseta boxy com estampa autoral nas costas em editorial urbano" loading="lazy"/><span>LINHA<br/>TÊNUE</span></div><div className="manifesto-copy"><span className="eyebrow">LINHA TÊNUE / MANIFESTO 001</span><h2>MAIS QUE ROUPAS,<br/>UMA PERSPECTIVA.</h2><p>Criamos peças para quem enxerga além do óbvio. Moda como expressão, rua como inspiração, liberdade como base.</p><a href="#/sobre" className="button dark">Conheça a marca <ArrowRight size={18}/></a></div><div className="manifesto-note" aria-hidden="true">ENTRE<br/>O COMUM<br/>E O<br/>EXTRAORDINÁRIO.<Globe size={55} strokeWidth={1}/><span>LT® — NO.001</span></div></section>
 <section className="section social"><div className="section-title"><div><h2>DA RUA PARA O FEED.</h2><span className="eyebrow">@LINHATENUE.STUDIO / #VISTALINHATENUE</span></div><Instagram size={23}/></div><div className="social-grid"><div><img src={campaign} loading="lazy" alt="Campanha com camiseta gráfica azul e branca"/><ArrowUpRight/></div><div><img src={lifestyle} loading="lazy" alt="Detalhe da estampa nas costas"/><ArrowUpRight/></div><div className="social-type"><span>FORA<br/>DO<br/>ÓBVIO.</span><small>LINHA TÊNUE®</small></div><div><img src={campaign} loading="lazy" alt="Detalhes do caimento boxy e jeans baggy"/><ArrowUpRight/></div></div></section>
 </>;}
