import React,{useState} from 'react';
import {ArrowRight,ArrowUpRight,ShoppingBag} from 'lucide-react';
import {money} from '../data';
import {useStore} from '../state/Store';
import CartItems from '../components/CartItems';
import Dialog from '../components/Dialog';
import {BrandMark} from '../components/BrandLogo';
import CampaignLabel from '../components/CampaignLabel';
export default function Cart(){
 const {count,subtotal,notify}=useStore();
 const [coupon,setCoupon]=useState('');
 const [discount,setDiscount]=useState(false);
 const [checkout,setCheckout]=useState(false);
 const discountValue=discount?Math.round(subtotal*10)/100:0;
 return <main className="section cart-page"><div className="cart-campaign-heading"><div><CampaignLabel code="BAG / 001">SUA PRÓXIMA EXPRESSÃO</CampaignLabel><h1>SUA SACOLA<span className="electric"> ({count})</span></h1></div><a className="campaign-link" href="#/loja">Continuar explorando<ArrowUpRight size={17}/></a></div><p className="cart-campaign-intro">Peças que vão acompanhar a sua perspectiva.</p>{count?<div className="cart-layout"><div className="cart-list-shell"><div className="cart-list-heading"><span>PEÇA / COR / TAMANHO</span><span>VALOR</span></div><CartItems/><div className="cart-service-notes"><span>01 / Troca em até 30 dias</span><span>02 / Experiência demonstrativa</span><span>03 / Identidade LT Axis</span></div></div><aside className="cart-summary"><CampaignLabel code="ORDER / DEMO">SUA SELEÇÃO</CampaignLabel><h2>RESUMO</h2><div className="free-shipping-progress"><p>{subtotal>=299?'Você atingiu o frete grátis ilustrativo.':`Faltam ${money(299-subtotal)} para o frete grátis ilustrativo.`}</p><progress max="299" value={Math.min(subtotal,299)} aria-label="Progresso para frete grátis ilustrativo"/></div><p><span>Subtotal</span><strong>{money(subtotal)}</strong></p><p><span>Frete ilustrativo</span>{subtotal>=299?'Grátis':'Calculado numa futura compra'}</p><form onSubmit={e=>{e.preventDefault();if(coupon.trim().toUpperCase()==='LINHA10'){setDiscount(true);notify('Cupom demonstrativo de 10% aplicado.')}else notify('Cupom inválido. Experimente LINHA10.','error')}}><input aria-label="Cupom de desconto" placeholder="Cupom de desconto" value={coupon} onChange={e=>setCoupon(e.target.value)}/><button>Aplicar</button></form>{discount&&<p><span>LINHA10 · 10%</span>−{money(discountValue)}</p>}<p className="total"><span>Total ilustrativo</span><strong>{money(subtotal-discountValue)}</strong></p><button className="button dark full" onClick={()=>setCheckout(true)}>Finalizar compra <ArrowUpRight size={18}/></button><small>Compra demonstrativa. Nenhum pedido, envio ou pagamento será realizado.</small><a className="text-link" href="#/loja">Continuar explorando <ArrowRight size={16}/></a></aside></div>:<div className="empty"><ShoppingBag size={40}/><h2>UM ESPAÇO PARA SUA IDENTIDADE.</h2><p>Sua sacola está vazia. Encontre sua próxima peça.</p><a href="#/loja" className="button dark">Explorar coleção <ArrowRight size={18}/></a></div>}
 <Dialog open={checkout} onClose={()=>setCheckout(false)} title="Isso é só o começo" className="checkout-dialog"><BrandMark className="checkout-brand"/><span className="eyebrow">VOCÊ CHEGOU À LINHA.</span><p>Esta é uma experiência conceitual. Sua sacola está salva neste navegador, mas nenhum pedido ou pagamento será realizado.</p><button className="button dark" onClick={()=>setCheckout(false)}>Voltar à sacola <ArrowRight size={18}/></button></Dialog>
 </main>;
}
