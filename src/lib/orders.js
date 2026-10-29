import {cleanCart,lineKey,subtotalCents} from './cart.js';
import {calculateTotals} from './pricing.js';
import {shippingMethods} from './shipping.js';
import {paymentMethods,demoLocation} from './demo.js';
import {normalizeCoupon,couponPercent,validateCoupon} from './coupons.js';
import {shippingPrice} from './shipping.js';
export const orderStages=['Pedido simulado registrado','Em preparação fictícia','Enviado ficticiamente','Entregue ficticiamente'];
export const orderDate=value=>new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Sao_Paulo'}).format(new Date(value));
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value)}return value};
export function createOrder({cart,products,couponCode='',shippingId,paymentId,now=new Date().toISOString(),id,couponList,allOrders=[]}){
 const clean=cleanCart(cart,products);
 if(!clean.length||clean.length!==cart.length||clean.some((line,i)=>lineKey(line)!==lineKey(cart[i])||line.qty!==cart[i].qty))return {error:'Revise sua sacola e as quantidades antes de simular.'};
 if(!shippingMethods.some(method=>method.id===shippingId))return {error:'Selecione uma modalidade de entrega.'};
 if(!paymentMethods.some(method=>method.id===paymentId))return {error:'Selecione uma opção de pagamento demonstrativo.'};
 if(couponCode){const checked=validateCoupon(couponCode,couponList,subtotalCents(clean,products),allOrders);if(checked.error)return {error:checked.error}}
 const items=clean.map(line=>{
  const product=products.find(p=>p.id===line.id),variant=product.variants.find(v=>v.color===line.color&&v.size===line.size);
  const unitPriceCents=Math.round(product.price*100);
  return {...line,name:product.name,slug:product.slug,image:variant.image,unitPriceCents,lineTotalCents:unitPriceCents*line.qty};
 });
 const order={id:id||`LT-DEMO-${globalThis.crypto?.randomUUID?.()||`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`,createdAt:now,items,
  totals:calculateTotals(subtotalCents(clean,products),normalizeCoupon(couponCode),shippingId,couponList,allOrders),shippingId,paymentId,destination:{...demoLocation},stage:0};
 return {order:freeze(order)};
}
// Whitelist the local demo schema; never restore arbitrary profile or payment fields.
export function cleanOrders(value){
 if(!Array.isArray(value))return [];
 const ids=new Set();
 return value.flatMap(raw=>{
  if(!raw||typeof raw.id!=='string'||!/^LT-DEMO-[a-zA-Z0-9-]{1,90}$/.test(raw.id)||ids.has(raw.id)||typeof raw.createdAt!=='string'||!Number.isFinite(Date.parse(raw.createdAt)))return [];
  if(!shippingMethods.some(m=>m.id===raw.shippingId)||!paymentMethods.some(m=>m.id===raw.paymentId)||!Number.isInteger(raw.stage)||raw.stage<0||raw.stage>3||!Array.isArray(raw.items)||!raw.items.length)return [];
  const items=raw.items.flatMap(item=>{
   if(!item||!Number.isSafeInteger(item.id)||!Number.isInteger(item.qty)||item.qty<1||item.qty>100||!Number.isSafeInteger(item.unitPriceCents)||item.unitPriceCents<1||item.lineTotalCents!==item.qty*item.unitPriceCents)return [];
   if(!['name','slug','color','size','image'].every(key=>typeof item[key]==='string'&&item[key].length<200)||!/^\/images\/[a-zA-Z0-9/_.-]+\.png$/.test(item.image))return [];
   return [{id:item.id,qty:item.qty,unitPriceCents:item.unitPriceCents,lineTotalCents:item.lineTotalCents,name:item.name,slug:item.slug,color:item.color,size:item.size,image:item.image}];
  });
  if(items.length!==raw.items.length)return [];
  const t=raw.totals,code=normalizeCoupon(t?.couponCode),subtotal=items.reduce((sum,item)=>sum+item.lineTotalCents,0);
  if(!t||!Number.isSafeInteger(subtotal)||!Number.isSafeInteger(t.discountCents)||t.discountCents<0||t.discountCents>subtotal||!Number.isInteger(t.percent)||t.percent<0||t.percent>100||code&&!/^[A-Z0-9-]{3,24}$/.test(code)||!code&&t.discountCents)return [];
  if(t.discountType!=='fixed'&&t.discountCents!==Math.round(subtotal*t.percent/100))return [];
  const totals={subtotalCents:subtotal,discountCents:t.discountCents,netProductsCents:subtotal-t.discountCents,shippingCents:shippingPrice(subtotal-t.discountCents,raw.shippingId),totalCents:subtotal-t.discountCents+shippingPrice(subtotal-t.discountCents,raw.shippingId),couponCode:code,percent:t.percent,...(t.discountType==='fixed'?{discountType:'fixed'}:{})};
  if(Object.keys(totals).some(key=>totals[key]!==t[key]))return [];
  ids.add(raw.id);
  return [freeze({id:raw.id,createdAt:raw.createdAt,items,totals,shippingId:raw.shippingId,paymentId:raw.paymentId,destination:{...demoLocation},stage:raw.stage,...(raw.source?{source:['seed','visitor','legacy'].includes(raw.source)?raw.source:'legacy',customerId:typeof raw.customerId==='string'?raw.customerId:'DEMO-VISITOR',status:['registered','preparing','shipped','delivered','cancelled'].includes(raw.status)?raw.status:['registered','preparing','shipped','delivered'][raw.stage],stockDeducted:raw.stockDeducted===true,stockRestored:raw.stockRestored===true,events:Array.isArray(raw.events)?raw.events.filter(e=>e&&['registered','preparing','shipped','delivered','cancelled'].includes(e.status)&&Number.isFinite(Date.parse(e.at))).map(e=>({status:e.status,at:e.at})):[],categories:Array.isArray(raw.categories)?raw.categories.filter(c=>typeof c==='string').slice(0,100):[]}: {})})];
 });
}
export const advanceOrder=order=>order.stage<3?freeze({...order,stage:order.stage+1}):order;
