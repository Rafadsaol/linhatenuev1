import React from 'react';
import {ArrowLeft,ArrowUpRight,Check} from 'lucide-react';
import {useStore} from '../state/Store';
import {orderDate} from '../lib/orders';
import {demoNotice} from '../lib/demo';
import CampaignLabel from '../components/CampaignLabel';
import OrderRecord,{OrdersList,OrderTimeline} from '../components/OrderRecord';
import EmptyState from '../components/EmptyState';
export function Orders(){return <main className="section orders-page"><div className="experience-heading"><CampaignLabel code="YOUR ARCHIVE / DEMO">PEDIDOS SIMULADOS</CampaignLabel><h1>SUAS ESCOLHAS.<br/>SUAS HISTÓRIAS.</h1><p>Um arquivo local da sua experiência com a Linha Tênue.</p></div><OrdersList/><a href="#/minha-conta" className="campaign-link"><ArrowLeft size={16}/>Minha conta demonstrativa</a></main>}
export function OrderDetail({id}){
 const {orders}=useStore(),order=orders.find(item=>item.id===id);
 if(!order)return <main className="section orders-page"><EmptyState title="ESSE PEDIDO NÃO ESTÁ AQUI." text="O histórico é exclusivo deste navegador. Explore seus pedidos simulados disponíveis." href="#/pedidos" action="Ver meus pedidos"/></main>;
 return <main className="section order-detail-page"><div className="experience-heading"><CampaignLabel code="ORDER ARCHIVE / DEMO">DETALHES DA SIMULAÇÃO</CampaignLabel><h1>CADA PEÇA.<br/>UMA ESCOLHA.</h1><p className="order-id">{order.id}</p><p>{orderDate(order.createdAt)} · Horário de Brasília</p></div><OrderRecord order={order}/><OrderTimeline order={order}/><div className="order-page-actions"><a className="campaign-link" href="#/pedidos"><ArrowLeft size={16}/>Todos os pedidos simulados</a><a className="button dark" href="#/loja">Continuar explorando<ArrowUpRight size={17}/></a></div></main>;
}
export function OrderConfirmation({id}){
 const {orders,storageFailed}=useStore(),order=orders.find(item=>item.id===id);
 if(!order)return <main className="section orders-page"><EmptyState title="SIMULAÇÃO NÃO ENCONTRADA." text="Este pedido não está salvo neste navegador. Consulte seu histórico local." href="#/pedidos" action="Ver meus pedidos"/></main>;
 return <main className="section confirmation-page"><div className="confirmation-heading"><span className="confirmation-check" aria-hidden="true"><Check size={34}/></span><CampaignLabel code="EXPERIENCE COMPLETE / DEMO">VOCÊ CRUZOU A LINHA</CampaignLabel><h1>PEDIDO SIMULADO<br/>CONFIRMADO</h1><p>{demoNotice}</p><span className="order-id">{order.id}</span><small>{orderDate(order.createdAt)} · Horário de Brasília</small></div><OrderRecord order={order}/><div className="confirmation-actions"><a className="button dark" href="#/pedidos">VER MEUS PEDIDOS<ArrowUpRight size={18}/></a><a className="button outline" href="#/loja">CONTINUAR EXPLORANDO<ArrowUpRight size={18}/></a></div><p className="confirmation-local-note">{storageFailed?'Simulação disponível somente nesta sessão; o navegador não permitiu salvar.':'Simulação salva neste navegador.'} As peças e os valores deste resumo permanecem como foram registrados.</p></main>;
}
