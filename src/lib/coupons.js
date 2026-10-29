export const coupons=Object.freeze({LT10:10,AXIS20:20,LINHA10:10});
export const normalizeCoupon=value=>typeof value==='string'?value.trim().toUpperCase():'';
export const couponPercent=value=>coupons[normalizeCoupon(value)]||0;
export function validateCoupon(value){
 const code=normalizeCoupon(value);
 return couponPercent(code)?{code,percent:couponPercent(code)}:{error:'Cupom inválido. Experimente LT10 ou AXIS20.'};
}
