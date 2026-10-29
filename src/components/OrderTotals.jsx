import React from 'react';
import {formatCents} from '../lib/pricing';
import {FREE_SHIPPING_CENTS} from '../lib/shipping';
export function FreeShippingProgress({totals}){
 const remaining=Math.max(0,FREE_SHIPPING_CENTS-totals.netProductsCents);
 return <div className="free-shipping-progress"><p>{remaining?`Faltam ${formatCents(remaining)} em peças, após descontos, para o frete padrão grátis.`:'Você atingiu o frete padrão grátis demonstrativo.'}</p><progress max={FREE_SHIPPING_CENTS} value={Math.min(totals.netProductsCents,FREE_SHIPPING_CENTS)} aria-label="Progresso para frete padrão grátis"/></div>;
}
export default function OrderTotals({totals,shippingLabel='Entrega padrão'}){
 return <dl className="order-totals"><div><dt>Subtotal das peças</dt><dd>{formatCents(totals.subtotalCents)}</dd></div>{totals.couponCode&&<div className="discount-line"><dt>{totals.couponCode} · {totals.discountType==='fixed'?'fixo':`${totals.percent}%`}</dt><dd>− {formatCents(totals.discountCents)}</dd></div>}<div><dt>{shippingLabel} <small>simulada</small></dt><dd>{totals.shippingCents?formatCents(totals.shippingCents):'Grátis'}</dd></div><div className="total"><dt>Total demonstrativo</dt><dd>{formatCents(totals.totalCents)}</dd></div></dl>;
}
