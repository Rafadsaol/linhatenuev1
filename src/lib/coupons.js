export const coupons=Object.freeze({LT10:10,AXIS20:20,LINHA10:10});
export const normalizeCoupon=value=>typeof value==='string'?value.trim().toUpperCase():'';
export const couponPercent=value=>coupons[normalizeCoupon(value)]||0;
export const initialCoupons=()=>Object.entries(coupons).map(([code,value])=>({id:`coupon-${code}`,code,type:'percent',value,minimumCents:0,limit:null,expiresAt:'',active:true}));
export function validateCoupon(value,list,subtotalCents=Infinity,orders=[],now=new Date()){
 const code=normalizeCoupon(value);
 if(!list)return couponPercent(code)?{code,percent:couponPercent(code)}:{error:'Cupom inválido. Experimente LT10 ou AXIS20.'};
 const coupon=list.find(c=>c.code===code);
 if(!coupon?.active)return {error:'Cupom inválido ou inativo.'};
 if(coupon.expiresAt&&new Date(`${coupon.expiresAt}T23:59:59-03:00`)<now)return {error:'Este cupom demonstrativo expirou.'};
 if(subtotalCents<coupon.minimumCents)return {error:`Cupom válido a partir de ${(coupon.minimumCents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} em peças.`};
 const used=orders.filter(o=>o.status!=='cancelled'&&o.totals.couponCode===code).length;
 if(coupon.limit!==null&&used>=coupon.limit)return {error:'Limite fictício de utilizações atingido.'};
 return {code,percent:coupon.type==='percent'?coupon.value:0,coupon};
}
export function validateCouponDraft(value,list=[],existingId){
 const code=normalizeCoupon(value.code),amount=Number(value.value),minimumCents=Number(value.minimumCents),limit=value.limit===''||value.limit===null?null:Number(value.limit);
 if(!/^[A-Z0-9-]{3,24}$/.test(code)||list.some(c=>c.id!==existingId&&c.code===code))return {error:'Use um código único de 3 a 24 letras, números ou hífens.'};
 if(!['percent','fixed'].includes(value.type)||!Number.isFinite(amount)||amount<=0||value.type==='percent'&&(amount>100||!Number.isInteger(amount))||value.type==='fixed'&&(!Number.isSafeInteger(amount)||amount>10000000)||!Number.isSafeInteger(minimumCents)||minimumCents<0||limit!==null&&(!Number.isInteger(limit)||limit<1))return {error:'Revise desconto, valor mínimo e limite de uso. Percentual: 1–100%; valores fixos positivos em centavos.'};
 if(value.expiresAt&&(!/^\d{4}-\d{2}-\d{2}$/.test(value.expiresAt)||!Number.isFinite(Date.parse(value.expiresAt))||new Date(value.expiresAt).toISOString().slice(0,10)!==value.expiresAt))return {error:'Data de validade inválida.'};
 return {coupon:{id:existingId||`coupon-${code}`,code,type:value.type,value:amount,minimumCents,limit,expiresAt:value.expiresAt||'',active:value.active!==false}};
}
