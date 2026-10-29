import React,{useEffect,useState} from 'react';
import {ArrowUpRight, ArrowRight, Instagram} from 'lucide-react';
import {lifestyle} from '../data';
import {useStore} from '../state/Store';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import {BrandMark} from '../components/BrandLogo';
import CampaignLabel from '../components/CampaignLabel';
import {streetImages} from '../lib/campaign';
import Lookbook from '../components/Lookbook';
import {scrollIntoView} from '../lib/motion';
import {productHref,selectProducts,defaultFilters} from '../lib/catalog';
const categories=[
 {label:'Boxy Tees',name:'Camisetas Boxy',sub:'IDENTIDADE NOS DETALHES',productId:8},
 {label:'Baggy Pants',name:'Calças Baggy',sub:'FEITAS PARA O SEU RITMO',productId:5},
 {label:'Essentials',name:'Essentials',sub:'O ESSENCIAL TEM ATITUDE',productId:7},
 {label:'Drops',name:'Drops Limitados',sub:'FORA DE QUALQUER PADRÃO',productId:3}
];
export default function Home({goCategory}){
 const {products,campaign}=useStore();
 const featured=[...products.filter(p=>p.featured),...campaign.featuredProductIds.map(id=>products.find(p=>p.id===id)).filter(Boolean)];
 const dropProducts=[...new Map(featured.map(p=>[p.id,p])).values()];
 const [outfit,setOutfit]=useState('masculino');
 useEffect(()=>{
  if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08});
  const sections=[...document.querySelectorAll('.fit-story,.lookbook,.manifesto')];
  sections.forEach(section=>{section.classList.add('v2-reveal');observer.observe(section)});
  return()=>{observer.disconnect();sections.forEach(section=>section.classList.remove('v2-reveal','is-visible'))};
 },[]);
 return <>
 <section className="hero street-hero" data-outfit={outfit}>
  <img id="campaign-hero-photo" className="hero-photo" src={campaign.image} alt="Campanha Linha Tênue — modelagem e identidade LT Axis" fetchPriority="high"/>
  <div className="hero-shade"/>
  <div className="hero-top"><span>LINHA TÊNUE / STREET CAMPAIGN</span><span>VOL. 001 — BRASIL</span></div>
  <div className="hero-outfit-preview"><span>OUTFIT / PREVIEW</span><div role="group" aria-label="Prévia dos outfits da campanha">{['masculino','feminino'].map(value=><button key={value} type="button" aria-controls="campaign-hero-photo" aria-pressed={outfit===value} onClick={()=>setOutfit(value)}>{value==='masculino'?'Masculino':'Feminino'}</button>)}</div><p className="sr-only" role="status">{outfit==='masculino'?'Outfit masculino: Boxy Fit Black e Baggy Washed Denim.':'Outfit feminino: Boxy Cropped Off-White e Wide Leg High-Waist.'}</p></div>
  <div className="hero-copy"><CampaignLabel code="THE FIRST LINE">{campaign.drop}</CampaignLabel><h1>{campaign.title.split('\n').map((line,index,lines)=><React.Fragment key={index}>{index>0&&<br/>}{index===lines.length-1&&line.endsWith('.')?<>{line.slice(0,-1)}<span className="hero-period">.</span></>:line}</React.Fragment>)}</h1><p>{campaign.subtitle}</p><div className="hero-ctas"><a className="button light" href={'#'+campaign.buttonLink}>{campaign.buttonText} <ArrowRight size={18}/></a><a className="hero-campaign-link" href="#/campanha">Ver campanha <ArrowUpRight size={18}/></a></div></div>
  <div className="hero-art" aria-hidden="true"><BrandMark/><span>FORM.<br/>STREET.<br/>CULTURE.</span></div>
  <div className="campaign-strip" aria-label="Explore o drop">{products.slice(0,3).map((piece,i)=><a key={i} href={'#'+productHref(piece)} aria-label={piece.name}><ProductImage product={piece} decorative/></a>)}<span>001 / THE FIRST LINE</span></div>
  <div className="hero-bottom"><span>LT AXIS / EQUILÍBRIO EM MOVIMENTO</span><button onClick={()=>scrollIntoView(document.getElementById('categorias'))}>EXPLORE ↓</button></div>
 </section>
 <section className="categories section campaign-categories" id="categorias"><div className="campaign-categories-heading"><CampaignLabel code="01 — 04">ENCONTRE A SUA FORMA</CampaignLabel><span>CORE FIT / DAILY EXPRESSION</span></div><div className="category-grid">{categories.map((c,i)=><button className={`category category-${i}`} key={c.name} onClick={()=>goCategory(c.name)}><div className="category-copy"><h3>{c.label}</h3><small>{c.sub}</small></div><div className="category-media">{products.find(p=>p.id===c.productId)&&<ProductImage product={products.find(p=>p.id===c.productId)} decorative/>}</div><span className="category-footer"><ArrowUpRight size={20}/><span>EXPLORAR / 0{i+1}</span></span></button>)}</div><div className="featured-collections"><span>COLEÇÕES EM FOCO</span>{campaign.featuredCollections.map(line=><a key={line} href={line==='Feminino'?'#/loja?colecao=Feminino':line==='Boxy Fit'?'#/loja/boxy-fit':line==='Art Editions'?'#/loja/drops':'#/loja'}>{line}<ArrowUpRight size={15}/></a>)}</div></section>
 <section className="section new shop-the-drop"><div className="section-title"><div><CampaignLabel code="DROP / 001">SELEÇÃO DA CAMPANHA</CampaignLabel><h2>SHOP THE DROP.</h2></div><p className="section-caption">Novos lançamentos.<br/>Entre o essencial e o inesperado.</p><a className="text-link" href="#/loja">Ver todos <ArrowRight size={16}/></a></div><div className="product-grid">{(dropProducts.length?dropProducts:selectProducts(products,defaultFilters)).slice(0,4).map(p=><ProductCard p={p} key={p.id}/>)}</div><div className="drop-footnote"><span>DROP 001 / QUANTIDADES LIMITADAS</span><span>DESIGN INDEPENDENTE. EXPRESSÃO SEM LIMITES.</span></div></section>
 <section className="manifesto"><div className="manifesto-image"><img src={lifestyle} alt="Camiseta boxy preta com símbolo LT Axis discreto abaixo da gola em editorial urbano" loading="lazy"/><span className="manifesto-brand"><BrandMark/></span></div><div className="manifesto-copy"><span className="eyebrow">LINHA TÊNUE / MANIFESTO 001</span><h2>MAIS QUE ROUPAS,<br/>UMA PERSPECTIVA.</h2><p>Criamos peças para quem enxerga além do óbvio. Moda como expressão, rua como inspiração, liberdade como base.</p><a href="#/sobre" className="button dark">Conheça a marca <ArrowRight size={18}/></a></div><div className="manifesto-note" aria-hidden="true">ENTRE<br/>O COMUM<br/>E O<br/>EXTRAORDINÁRIO.<BrandMark/><span>LT® — NO.001</span></div></section>
 <section className="fit-story"><div className="fit-story-image"><img src={streetImages.core} alt="Modelos com Boxy Fit off-white e baby tee azul, com corte mais próximo ao corpo" loading="lazy"/></div><div className="fit-story-copy"><span className="eyebrow">NOVAS PROPORÇÕES / MESMA IDENTIDADE</span><h2>BOXY,<br/>NA MEDIDA.</h2><p>Ombros mais alinhados. Mangas proporcionais. Volume na medida. O formato boxy continua; o encaixe ganha uma nova perspectiva.</p><button className="button dark" onClick={()=>goCategory('Boxy Fit')}>Conheça o Boxy Fit <ArrowRight size={18}/></button><div className="fit-points"><span>01 / CORTE RETO</span><span>02 / COMPRIMENTO MAIS CURTO</span><span>03 / SÍMBOLO LT AXIS</span></div></div></section>
 <section className="section fit-launch"><div className="section-title"><div><span className="eyebrow">BOXY FIT / UNISSEX</span><h2>MENOS VOLUME.<br/>MAIS PRESENÇA.</h2></div><button className="text-link" onClick={()=>goCategory('Boxy Fit')}>Ver Boxy Fit <ArrowRight size={16}/></button></div><div className="product-grid">{products.filter(p=>p.line==='Boxy Fit').map(p=><ProductCard key={p.id} p={p}/>)}</div></section>
 <section className="section women-launch"><div className="section-title"><div><span className="eyebrow">NOVA COLEÇÃO / FEMININO</span><h2>A SUA FORMA.<br/>AS SUAS REGRAS.</h2></div><button className="text-link" onClick={()=>goCategory('Feminino')}>Explorar feminino <ArrowRight size={16}/></button></div><p className="women-intro">Boxy cropped, baby tees e denim de cintura alta. Novas silhuetas para a mesma liberdade de expressão.</p><div className="product-grid">{products.filter(p=>p.audience==='Feminino').map(p=><ProductCard key={p.id} p={p}/>)}</div></section>
 <Lookbook/>
 <section className="section social"><div className="section-title"><div><h2>DA RUA PARA O FEED.</h2><span className="eyebrow">@LINHATENUE.STUDIO / #VISTALINHATENUE</span></div><Instagram size={23}/></div><div className="social-grid"><div><img src="/images/looks/look-01.png" loading="lazy" alt="Look masculino completo com camiseta preta e baggy denim"/><ArrowUpRight/></div><div><img src={lifestyle} loading="lazy" alt="Detalhe do símbolo LT Axis discreto nas costas"/><ArrowUpRight/></div><div className="social-type"><span>FORA<br/>DO<br/>ÓBVIO.</span><BrandMark/></div><div><img src="/images/looks/look-03.png" loading="lazy" alt="Look feminino completo com Baby Tee Cobalt e Wide Leg"/><ArrowUpRight/></div></div></section>
 </>;}
