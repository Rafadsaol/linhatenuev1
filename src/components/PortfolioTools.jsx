import React,{useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,X,Compass} from 'lucide-react';
import {useStore} from '../state/Store';
import {navigate,readRoute} from '../lib/router';
export default function PortfolioTools(){
 const {products}=useStore(),[step,setStep]=useState(null),origin=useRef(null),heading=useRef(null);
 const product=products.find(p=>p.variants.some(v=>v.stock>0));
 const steps=[
  ['Conheça a marca','Street Campaign, identidade LT Axis e a linha entre o comum e o extraordinário.','/'],
  ['Explore o catálogo','Busque uma peça, combine filtros e ordene a coleção. As escolhas ficam na URL.','/loja'],
  ['Personalize um produto',product?'Escolha cor, tamanho e quantidade. A disponibilidade acompanha cada variante.':'Não há peças disponíveis agora. O administrador pode repor o estoque.',product?`/produto/${product.slug}`:'/loja'],
  ['Experimente a sacola','Sua sacola é local. Adicione uma peça pelo produto para experimentar quantidades e cupons. O tour não adiciona itens.','/sacola'],
  ['Simule uma compra','Com peças na sacola, revise a entrega e escolha um método fictício. Nenhuma cobrança ou pedido é gerado pelo tour.','/checkout'],
  ['Acompanhe pedidos','As compras que você simular aparecem neste histórico. Um histórico vazio é esperado antes da primeira simulação.','/pedidos'],
  ['Conheça o painel administrativo','Indicadores e gráficos usam dados comerciais fictícios, identificados como demonstração.','/admin'],
  ['Gerencie sua loja','Produtos, estoque, pedidos, cupons e campanhas estão no menu. Alterações feitas por você afetam a demonstração; o tour apenas apresenta as telas.','/admin/produtos']
 ];
 function start(){if(step!==null)return;const route=readRoute();origin.current={route:route.path+route.search,y:window.scrollY,focus:document.activeElement,fromCase:document.activeElement?.hasAttribute('data-tour-start')};setStep(0)}
 function close(){const back=origin.current;setStep(null);if(back){navigate(back.route);setTimeout(()=>{window.scrollTo({top:back.y,behavior:'instant'});if(back.focus?.isConnected)back.focus.focus({preventScroll:true});else (back.fromCase?document.querySelector('[data-tour-start]'):document.getElementById('portfolio-launch'))?.focus({preventScroll:true})},80)}}
 useEffect(()=>{window.addEventListener('lt-start-tour',start);return()=>window.removeEventListener('lt-start-tour',start)},[step]);
 useEffect(()=>{if(step===null)return;document.body.classList.add('tour-active');navigate(steps[step][2]);heading.current?.focus({preventScroll:true});const escape=e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]'))close()};window.addEventListener('keydown',escape);return()=>{window.removeEventListener('keydown',escape);document.body.classList.remove('tour-active')}},[step]);
 return <>{step===null?<button id="portfolio-launch" className="portfolio-launch" onClick={start}><Compass size={16}/>Explorar demonstração</button>:<aside className="portfolio-tour" aria-label="Tour da demonstração"><div className="tour-top"><span>GUIA / {String(step+1).padStart(2,'0')} — 08</span><button className="icon-button" aria-label="Fechar tour" onClick={close}><X size={18}/></button></div><progress value={step+1} max={8} aria-label="Progresso do tour"/><h2 ref={heading} tabIndex={-1}>{steps[step][0]}</h2><p>{steps[step][1]}</p><div className="tour-navigation"><button disabled={step===0} onClick={()=>setStep(step-1)}><ArrowLeft size={14}/>Voltar</button><button onClick={close}>Pular tour</button><button onClick={()=>step===7?close():setStep(step+1)}>{step===7?'Concluir':'Próximo'}<ArrowRight size={14}/></button></div><small>Explore a página livremente. Esc fecha o guia.</small></aside>}</>;
}
