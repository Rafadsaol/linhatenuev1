import React,{useState} from 'react';
import {ArrowRight,Search,SlidersHorizontal,X} from 'lucide-react';
import {useStore} from '../state/Store';
import {categoryOptions,defaultFilters,filtersHref,parseFilters,selectProducts} from '../lib/catalog';
import {navigate} from '../lib/router';
import Dialog from '../components/Dialog';
import ProductCard from '../components/ProductCard';
import CampaignLabel from '../components/CampaignLabel';
import {CatalogCampaign} from '../components/CampaignEditorial';
import {streetImages} from '../lib/campaign';
const colors=['Preto','Off-white','Azul','Grafite'];
const colorHex={'Preto':'#111','Off-white':'#e6e0d5','Azul':'#1d4dff','Grafite':'#666'};
function FilterPanel({filters,update,prefix}){
 const teeSizes=['P','M','G','GG'],pantsSizes=['34','36','38','40','42','44','46'];
 const sizeButtons=(sizes)=>sizes.map(size=><button type="button" key={size} aria-pressed={filters.size===size} className={filters.size===size?'selected':''} onClick={()=>update({size:filters.size===size?'':size})}>{size}</button>);
 return <div className="filter-panel">
  <fieldset><legend>Categoria</legend><div className="filter-category-list">{categoryOptions.map(([key,label])=><button key={key} type="button" aria-pressed={filters.category===key} onClick={()=>update({category:key})}>{label}<span>{filters.category===key?'−':'+'}</span></button>)}</div></fieldset>
  <fieldset><legend>Coleção</legend><label className="sr-only" htmlFor={`${prefix}-audience`}>Coleção</label><select id={`${prefix}-audience`} value={filters.audience} onChange={e=>update({audience:e.target.value})}><option>Todos</option><option>Unissex</option><option>Feminino</option></select></fieldset>
  <fieldset><legend>Tamanho disponível</legend><div className="filter-size-block"><span>Camisetas</span><div className="filter-sizes">{sizeButtons(teeSizes)}</div></div><div className="filter-size-block"><span>Calças</span><div className="filter-sizes">{sizeButtons(pantsSizes)}</div></div></fieldset>
  <fieldset><legend>Cor</legend><div className="filter-color-list">{colors.map(color=><button key={color} type="button" aria-pressed={filters.color===color} onClick={()=>update({color:filters.color===color?'':color})}><i style={{background:colorHex[color]}}/>{color}<span>{filters.color===color?'✓':''}</span></button>)}</div></fieldset>
  <fieldset><legend>Faixa de preço</legend><div className="price-inputs"><label htmlFor={`${prefix}-min`}>De (R$)<input id={`${prefix}-min`} type="number" min="0" step="0.01" placeholder="0" value={filters.min} onChange={e=>update({min:e.target.value},{replace:true})}/></label><span>—</span><label htmlFor={`${prefix}-max`}>Até (R$)<input id={`${prefix}-max`} type="number" min="0" step="0.01" placeholder="Sem limite" value={filters.max} onChange={e=>update({max:e.target.value},{replace:true})}/></label></div>{filters.min!==''&&filters.max!==''&&Number(filters.min)>Number(filters.max)&&<p className="filter-error">O mínimo deve ser menor ou igual ao máximo.</p>}</fieldset>
  <p className="filter-disclaimer">Tamanhos e disponibilidade são fictícios nesta coleção demonstrativa.</p>
 </div>;
}
export default function Shop({route}){
 const {products}=useStore();
 const [drawer,setDrawer]=useState(false);
 const filters=parseFilters(route.search,route.path);
 const results=selectProducts(products,filters);
 const update=(patch,options={})=>{
  const next={...filters,...patch};
  const path='category' in patch?(next.category==='todos'?'/loja':`/loja/${next.category}`):route.path;
  navigate(filtersHref(next,path),options);
 };
 const editorialAfter=results.length>=4?Math.min(6,Math.ceil(results.length/2)):0;
 const clear=()=>navigate('/loja');
 const active=Object.keys(defaultFilters).filter(k=>k!=='sort'&&String(filters[k])!==String(defaultFilters[k]));
 const chipLabels={q:`Busca: ${filters.q}`,category:categoryOptions.find(([key])=>key===filters.category)?.[1],audience:filters.audience,size:`Tamanho ${filters.size}`,color:filters.color,min:`A partir de R$ ${filters.min}`,max:`Até R$ ${filters.max}`};
 const title=filters.category==='todos'?(filters.audience==='Feminino'?'FEMININO.':'FORA DO PADRÃO.'):categoryOptions.find(([key])=>key===filters.category)?.[1];
 return <main className="section shop v2-shop">
  <div className="breadcrumb"><a href="#/">Início</a> / Loja {filters.category!=='todos'&&`/ ${title}`}</div>
  <div className="shop-banner"><img src={streetImages.hero} alt="Editorial Linha Tênue com símbolo LT Axis"/><div><CampaignLabel code="COLLECTION / 001">STREET CAMPAIGN</CampaignLabel><h1>{title}</h1></div><span className="shop-mark" aria-hidden="true">001</span></div>
  <div className="catalog-layout"><aside className="catalog-sidebar" aria-label="Filtros do catálogo"><div className="sidebar-heading"><span><SlidersHorizontal size={16}/>FILTROS</span><button onClick={clear}>Limpar</button></div><FilterPanel filters={filters} update={update} prefix="desktop"/></aside>
   <section className="catalog-content" aria-label="Produtos do catálogo">
    <form className="catalog-search" role="search" onSubmit={e=>e.preventDefault()}><Search size={18}/><label className="sr-only" htmlFor="catalog-search">Buscar no catálogo</label><input id="catalog-search" value={filters.q} onChange={e=>update({q:e.target.value},{replace:true})} placeholder="Busque por peça, categoria ou detalhe" type="search"/>{filters.q&&<button type="button" aria-label="Limpar busca" onClick={()=>update({q:''})}><X size={17}/></button>}</form>
    <div className="catalog-toolbar"><button className="mobile-filter-trigger" onClick={()=>setDrawer(true)} aria-haspopup="dialog"><SlidersHorizontal size={17}/>Filtrar {active.length>0&&`(${active.length})`}</button><p role="status" className="result-count">{results.length} {results.length===1?'peça encontrada':'peças encontradas'}</p><label className="catalog-sort">Ordenar<select aria-label="Ordenar produtos" value={filters.sort} onChange={e=>update({sort:e.target.value})}><option value="novidades">Novidades</option><option value="menor-preco">Menor preço</option><option value="maior-preco">Maior preço</option><option value="nome">Nome A–Z</option></select></label></div>
    {active.length>0&&<div className="active-filters">{active.map(key=><button key={key} onClick={()=>update({[key]:defaultFilters[key]})} aria-label={`Remover filtro ${chipLabels[key]}`}>{chipLabels[key]}<X size={12}/></button>)}<button className="clear-all" onClick={clear}>Limpar filtros</button></div>}
    <div className="product-grid catalog-grid" key={`${filters.category}-${filters.audience}`}>{results.flatMap((p,index)=>[<ProductCard key={p.id} p={p}/>,...(index+1===editorialAfter?[<CatalogCampaign key="campaign-interlude"/>]:[])])}</div>
    {!results.length&&<div className="empty catalog-empty"><Search size={32}/><h2>NENHUMA PEÇA<br/>NESSA FREQUÊNCIA.</h2><p>Experimente outra busca ou ajuste os filtros.</p><button className="button dark" onClick={clear}>Limpar filtros <ArrowRight size={18}/></button></div>}
   </section>
  </div>
  <Dialog open={drawer} onClose={()=>setDrawer(false)} title="Filtrar coleção" drawer className="filter-drawer"><FilterPanel filters={filters} update={update} prefix="mobile"/><div className="filter-drawer-actions"><button className="text-link" onClick={clear}>Limpar filtros</button><button className="button dark" onClick={()=>setDrawer(false)}>Ver {results.length} peças <ArrowRight size={17}/></button></div></Dialog>
 </main>;
}
