import React,{useState} from 'react';
import {ArrowRight,Check,Heart,Minus,Plus} from 'lucide-react';
import {money} from '../data';
import {getVariant} from '../lib/catalog';
import {useStore} from '../state/Store';
import {scrollIntoView} from '../lib/motion';
import ProductGallery from '../components/ProductGallery';
import ProductCard from '../components/ProductCard';
import CompleteLook from '../components/CompleteLook';
import CampaignEditorial from '../components/CampaignEditorial';
import CampaignLabel from '../components/CampaignLabel';
import {campaignStory} from '../lib/campaign';
const colorHex={'Preto':'#151515','Azul':'#1d4dff','Grafite':'#555','Off-white':'#e6e0d5'};
export default function Product({product:p}){
 const {products,add,favorites,toggleFavorite}=useStore();
 const [selectedColor,setColor]=useState(p.color);
 const color=p.colors.includes(selectedColor)?selectedColor:p.color;
 const [selectedSize,setSize]=useState('');
 const size=p.sizes.includes(selectedSize)?selectedSize:'';
 const [quantity,setQuantity]=useState(1);
 const [error,setError]=useState('');
 const variant=getVariant(p,color,size);
 const available=p.variants.some(v=>v.stock>0);
 const max=variant?.stock||1;
 const favorite=favorites.includes(p.id);
 function changeColor(next){setColor(next);setSize('');setQuantity(1);setError('')}
 function submit(){
  if(!size){setError('Escolha um tamanho para continuar.');document.getElementById('size-options')?.focus();return}
  if(!variant?.stock){setError('Esta combinação está indisponível na demonstração.');return}
  if(add(p,color,size,quantity))setError('');
 }
 const story=campaignStory(p,color);
 const related=products.filter(x=>x.id!==p.id&&x.audience===p.audience).sort((a,b)=>Number(b.category===p.category)-Number(a.category===p.category)).slice(0,4);
 return <main className="section product-page">
  <div className="breadcrumb"><a href="#/loja">Loja</a> / <a href={`#/loja/${p.categorySlug}`}>{p.category}</a> / {p.name}</div>
  <div className="product-detail"><ProductGallery key={`${p.id}-${color}`} product={p} color={color}/><div className="detail-copy"><CampaignLabel code={`PIECE / ${String(p.id).padStart(3,'0')}`}>DROP 001 / {p.category.toUpperCase()}</CampaignLabel><h1>{p.name}</h1><div className="fit-badges"><span>{p.audience}</span><span>{p.fit}</span>{p.tags.includes('Estampada')&&<span>Art Edition</span>}</div><p className="detail-price">{money(p.price)}</p><p>Até 3x de {money(p.price/3)} sem juros · ilustrativo</p><p className="product-editorial-lead">{p.shortDescription}</p><p className="description">{p.description}</p>
   <fieldset className="product-colors"><legend>COR — {color}</legend><div className="color-options">{p.colors.map(c=><button key={c} type="button" aria-label={`Cor ${c}`} title={c} aria-pressed={color===c} onClick={()=>changeColor(c)} className={color===c?'selected':''} style={{background:colorHex[c]}}/>)}</div></fieldset>
   <div className="size-label"><span className="field-label">TAMANHO {p.kind==='pants'?' / GRADE NUMÉRICA':''}</span><button className="measure-link" onClick={()=>{const panel=document.getElementById('medidas');panel.open=true;scrollIntoView(panel,{block:'center'})}}>Guia de medidas ↗</button></div>
   <div className="sizes" id="size-options" role="group" aria-label="Selecionar tamanho" tabIndex={-1}>{p.sizes.map(s=>{const stock=getVariant(p,color,s)?.stock||0;return <button key={s} className={`${size===s?'selected':''} ${!stock?'unavailable':''}`} aria-pressed={size===s} aria-disabled={!stock} aria-label={`Tamanho ${s}${!stock?' — indisponível':''}`} onClick={()=>{if(!stock){setError(`Tamanho ${s} indisponível na demonstração.`);return}setSize(s);setQuantity(1);setError('')}}>{s}</button>})}</div>
   <p className={`stock-note ${variant?.stock===0?'out-of-stock':''}`} aria-live="polite">{!available?'Peça indisponível na demonstração.':variant?`${variant.stock} unidade(s) nesta variante · estoque fictício`:'Selecione um tamanho para consultar a disponibilidade fictícia.'}</p>
   <div className="purchase-row"><div className="quantity product-quantity"><button aria-label="Diminuir quantidade" disabled={quantity<=1} onClick={()=>setQuantity(n=>n-1)}><Minus size={16}/></button><output aria-label="Quantidade selecionada">{quantity}</output><button aria-label="Aumentar quantidade" disabled={!size||quantity>=max} onClick={()=>setQuantity(n=>n+1)}><Plus size={16}/></button></div><button className={`product-favorite ${favorite?'is-favorite':''}`} aria-pressed={favorite} aria-label={`${favorite?'Remover':'Salvar'} ${p.name} ${favorite?'dos':'nos'} favoritos`} onClick={()=>toggleFavorite(p)}><Heart size={19} fill={favorite?'currentColor':'none'}/>{favorite?'Salvo':'Salvar peça'}</button></div>
   {error&&<p className="selection-error" role="alert">{error}</p>}
   <button className="button dark full" disabled={!available} onClick={submit}>{available?'Adicionar à sacola':'Indisponível nesta demonstração'}<Plus size={19}/></button><p className="shipping"><Check size={15}/> Frete grátis acima de R$ 299 · Troca em até 30 dias</p>
   <details><summary>Detalhes da peça <Plus size={16}/></summary><ul className="product-notes">{p.details.map(text=><li key={text}>{text}</li>)}</ul><p>Caimento: {p.fit}. Fotografias e produtos conceituais.</p></details>
   <details id="medidas"><summary>Tabela de medidas <Plus size={16}/></summary><p>Medidas ilustrativas em cm, com a roupa deitada. {p.kind==='pants'?'Cintura e quadril medidos de um lado ao outro.':'Largura medida de um lado ao outro.'}</p><div className="measure-table"><table><thead><tr><th>Tamanho</th><th>{p.kind==='pants'?'Cintura':'Largura'}</th>{p.kind==='pants'&&<th>Quadril</th>}<th>Comprimento</th></tr></thead><tbody>{p.measurements.map(m=><tr key={m.size}><td>{m.size}</td><td>{m.width}</td>{p.kind==='pants'&&<td>{m.hip}</td>}<td>{m.length}</td></tr>)}</tbody></table></div></details>
   <details><summary>Cuidados com a peça <Plus size={16}/></summary><ul className="product-notes">{p.care.map(text=><li key={text}>{text}</li>)}</ul></details>
   <details><summary>Entrega <Plus size={16}/></summary><p>Frete padrão grátis a partir de R$ 299 em peças após descontos. No checkout demonstrativo, experimente entrega padrão ou expressa com prazos fictícios. Não há cálculo por CEP nem envio real nesta versão.</p></details>
   <details><summary>Trocas e devoluções <Plus size={16}/></summary><p>Orientação ilustrativa: troca em até 30 dias, com etiqueta e sem sinais de uso. Esta loja não realiza vendas ou envios reais.</p></details>
  </div></div>
  <CompleteLook product={p}/>
  <div className="section-title related"><h2>NA MESMA FREQUÊNCIA.</h2><a className="text-link" href="#/loja">Ver coleção <ArrowRight size={16}/></a></div><div className="product-grid">{related.map(p=><ProductCard key={p.id} p={p}/>)}</div>
  <CampaignEditorial image={story.image} alt={story.alt} code={story.code} title={story.title} copy={story.copy} href="#/campanha" cta="Ver a peça na campanha" className="product-campaign-finale"/>
 </main>;
}
