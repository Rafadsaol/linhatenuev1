import React from 'react';
import {ArrowUpRight,Check,Package} from 'lucide-react';
import {formatCents} from '../lib/pricing';
import {shippingMethods} from '../lib/shipping';
import {paymentMethods,demoNotice} from '../lib/demo';
import {orderDate,orderStages} from '../lib/orders';
import {useStore} from '../state/Store';
import OrderTotals from './OrderTotals';
import EmptyState from './EmptyState';
export function SnapshotItems({items}){
 return <ul className="snapshot-items">{items.map(item=><li key={`${item.id}:${item.color}:${item.size}`}><a href={`#/produto/${item.slug}`}><img src={item.image} alt={`${item.name} — ${item.color}`} width="1086" height="1448" loading="lazy"/></a><div><a href={`#/produto/${item.slug}`}>{item.name}</a><p>{item.color} / {item.size} / Qtd. {item.qty}</p><small>{formatCents(item.unitPriceCents)} por peça</small></div><strong>{formatCents(item.lineTotalCents)}</strong></li>)}</ul>;
}
export function OrdersList(){
 const {orders}=useStore();
 if(!orders.length)return <EmptyState title="SUA HISTÓRIA COMEÇA AQUI." text="Seus pedidos simulados aparecerão neste navegador. Escolha uma peça e experimente a jornada."/>;
 return <div className="orders-list">{orders.map(order=><article className="order-list-card" key={order.id}><div className="order-list-heading"><div><span className="eyebrow">PEDIDO FICTÍCIO / {orderDate(order.createdAt)}</span><h3>{order.id}</h3></div><span className="order-status"><Package size={14}/>{orderStages[order.stage]}</span></div><div className="order-preview-images">{order.items.map(item=><img key={`${item.id}:${item.color}:${item.size}`} src={item.image} alt={`${item.name}, ${item.color}, tamanho ${item.size}`} width="1086" height="1448" loading="lazy"/>)}</div><p className="order-preview-names">{order.items.map(item=>`${item.qty}× ${item.name} (${item.color} / ${item.size})`).join(' · ')}</p><div className="order-list-bottom"><span>Total demonstrativo <strong>{formatCents(order.totals.totalCents)}</strong></span><a className="campaign-link" href={`#/pedidos/${order.id}`}>Ver detalhes<ArrowUpRight size={17}/></a></div></article>)}<small className="order-date-note">Datas no horário de Brasília. Histórico fictício salvo somente neste navegador.</small></div>;
}
export function OrderTimeline({order}){
 const {nextOrderStage}=useStore();
 return <section className="order-tracking"><span className="eyebrow">ACOMPANHAMENTO DEMONSTRATIVO</span><h2>CADA ETAPA. UMA SIMULAÇÃO.</h2><ol className="order-timeline">{orderStages.map((stage,index)=><li key={stage} className={index<=order.stage?'is-complete':''} aria-current={index===order.stage?'step':undefined}><span aria-hidden="true">{index<=order.stage?<Check size={16}/>:String(index+1).padStart(2,'0')}</span><div><strong>{stage}</strong><small>{index===order.stage?'Etapa atual da demonstração':index<order.stage?'Etapa fictícia concluída':'Avance manualmente para visualizar'}</small></div></li>)}</ol>{order.stage<3?<button className="button dark" onClick={()=>nextOrderStage(order.id)}>Simular próxima etapa<ArrowUpRight size={17}/></button>:<p className="demo-notice" role="status">Todas as etapas fictícias foram demonstradas. Nenhum envio foi realizado.</p>}<small>Controle visual de portfólio. Não há logística, rastreamento ou entrega real.</small></section>;
}
export default function OrderRecord({order}){
 const shipping=shippingMethods.find(m=>m.id===order.shippingId),payment=paymentMethods.find(m=>m.id===order.paymentId);
 return <div className="order-record"><div className="order-record-items"><span className="eyebrow">SELEÇÃO REGISTRADA / CÓPIA DO PEDIDO</span><SnapshotItems items={order.items}/><div className="order-fulfillment"><section><h3>ENTREGA SIMULADA</h3><strong>{shipping.label}</strong><p>{shipping.estimate}</p><address>{order.destination.street}<br/>{order.destination.district}<br/>{order.destination.city} · {order.destination.zip}</address><small>Localização de exemplo, inteiramente fictícia.</small></section><section><h3>PAGAMENTO DEMO</h3><strong>{payment.label}</strong><p>{payment.description}</p><small>{demoNotice}</small></section></div></div><aside className="experience-summary order-saved-summary"><span className="eyebrow">RESUMO / DEMONSTRAÇÃO</span><h2>SUA EXPRESSÃO.</h2><OrderTotals totals={order.totals} shippingLabel={shipping.label}/><small>Valores preservados como estavam na simulação.</small></aside></div>;
}
