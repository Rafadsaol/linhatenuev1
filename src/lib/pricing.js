import {couponPercent,normalizeCoupon} from './coupons.js';
import {shippingPrice} from './shipping.js';
export const formatCents=value=>(value/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export function calculateTotals(subtotalCents,couponCode='',shippingId='standard'){
 if(!Number.isSafeInteger(subtotalCents)||subtotalCents<0)throw Error('Subtotal inválido.');
 const percent=couponPercent(couponCode);
 const discountCents=Math.round(subtotalCents*percent/100);
 const netProductsCents=subtotalCents-discountCents;
 const shippingCents=subtotalCents?shippingPrice(netProductsCents,shippingId):0;
 return {subtotalCents,discountCents,netProductsCents,shippingCents,totalCents:netProductsCents+shippingCents,couponCode:percent?normalizeCoupon(couponCode):'',percent};
}
