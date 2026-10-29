import React from 'react';
import {ArrowRight,ArrowUpRight} from 'lucide-react';
import {useStore} from '../state/Store';
import {shippingMethods} from '../lib/shipping';
import {demoNotice} from '../lib/demo';
import CartItems from '../components/CartItems';
import CampaignLabel from '../components/CampaignLabel';
import CouponForm from '../components/CouponForm';
import OrderTotals,{FreeShippingProgress} from '../components/OrderTotals';
import EmptyState from '../components/EmptyState';
import {ClearCartButton} from '../components/DemoControls';
export default function Cart(){
 const {count,totals,preferences}=useStore();
 return <main className="section cart-page"><div className="cart-campaign-heading"><div><CampaignLabel code="BAG / 001">SUA PRÓXIMA EXPRESSÃO</CampaignLabel><h1>SUA SACOLA<span className="electric"> ({count})</span></h1></div><a className="campaign-link" href="#/loja">Continuar explorando<ArrowUpRight size={17}/></a></div><p className="cart-campaign-intro">Peças que vão acompanhar a sua perspectiva.</p>{count?<div className="cart-layout"><div className="cart-list-shell"><div className="cart-list-heading"><span>PEÇA / COR / TAMANHO</span><span>VALOR</span></div><CartItems/><div className="cart-list-actions"><ClearCartButton/><span>Estoque fictício / seleção salva neste navegador</span></div><div className="cart-service-notes"><span>01 / Troca ilustrativa em até 30 dias</span><span>02 / Experiência demonstrativa</span><span>03 / Identidade LT Axis</span></div></div><aside className="cart-summary experience-summary"><CampaignLabel code="ORDER / DEMO">SUA SELEÇÃO</CampaignLabel><h2>RESUMO</h2><FreeShippingProgress totals={totals}/><CouponForm/><OrderTotals totals={totals} shippingLabel={shippingMethods.find(m=>m.id===preferences.shippingId).label}/><a className="button dark full" href="#/checkout">Finalizar compra <ArrowUpRight size={18}/></a><small>{demoNotice}</small><a className="text-link" href="#/loja">Continuar explorando <ArrowRight size={16}/></a></aside></div>:<EmptyState/>}</main>;
}
