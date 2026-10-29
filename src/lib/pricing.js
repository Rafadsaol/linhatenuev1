import {couponPercent,normalizeCoupon,validateCoupon} from './coupons.js';
import {shippingPrice} from './shipping.js';
export const formatCents=value=>(value/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export function calculateTotals(subtotalCents,couponCode='',shippingId='standard',list,orders=[]){
 if(!Number.isSafeInteger(subtotalCents)||subtotalCents<0)throw Error('Subtotal inválido.');
 const applied=list?validateCoupon(couponCode,list,subtotalCents,orders):null;
 const coupon=applied?.coupon;
 const percent=list?(applied?.error?0:applied.percent):couponPercent(couponCode);
 const discountCents=Math.min(subtotalCents,coupon?.type==='fixed'?coupon.value:Math.round(subtotalCents*percent/100));
 const netProductsCents=subtotalCents-discountCents;
 const shippingCents=subtotalCents?shippingPrice(netProductsCents,shippingId):0;
 const code=list?(applied?.error?'':applied?.code):percent?normalizeCoupon(couponCode):'';
 return {subtotalCents,discountCents,netProductsCents,shippingCents,totalCents:netProductsCents+shippingCents,couponCode:code||'',percent,...(coupon?.type==='fixed'?{discountType:'fixed'}:{})};
}
