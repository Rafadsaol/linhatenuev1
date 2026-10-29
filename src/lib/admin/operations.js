import {createOrder} from '../orders.js';
import {getVariant} from '../catalog.js';
import {cleanCart} from '../cart.js';
import {statuses} from './seed.js';
export const uid=prefix=>`${prefix}-${globalThis.crypto?.randomUUID?.()||`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`;
export function reconcile(db){return {...db,cart:cleanCart(db.cart,db.products),favorites:db.favorites.filter(id=>db.products.some(p=>p.id===id&&p.status==='active'))}}
export function recordMovement(db,product,color,size,after,reason,now=new Date().toISOString()){
 const variant=getVariant(product,color,size);if(!variant||!Number.isInteger(after)||after<0||after>10000)return {error:'Estoque deve ser um inteiro entre 0 e 10.000.'};
 if(variant.stock===after)return {error:'Informe uma quantidade diferente da atual.'};
 return {db:reconcile({...db,products:db.products.map(p=>p.id===product.id?{...p,variants:p.variants.map(v=>v.id===variant.id?{...v,stock:after}:v)}:p),stockMovements:[...db.stockMovements,{id:uid('MOV'),productId:product.id,color,size,before:variant.stock,after,reason,at:now}].slice(-300)})};
}
export function placeOrder(db,paymentId){
 const result=createOrder({cart:db.cart,products:db.products,couponCode:db.preferences.couponCode,shippingId:db.preferences.shippingId,paymentId,couponList:db.coupons,allOrders:db.orders});if(result.error)return result;
 const order={...result.order,source:'visitor',customerId:'DEMO-VISITOR',status:'registered',stockDeducted:true,stockRestored:false,events:[{status:'registered',at:result.order.createdAt}],categories:result.order.items.map(item=>db.products.find(p=>p.id===item.id).category)};
 let next=db;
 for(const item of order.items){const p=next.products.find(p=>p.id===item.id);const changed=recordMovement(next,p,item.color,item.size,getVariant(p,item.color,item.size).stock-item.qty,`Pedido ${order.id}`);if(changed.error)return changed;next=changed.db}
 return {db:{...next,orders:[order,...next.orders],cart:[],preferences:{...next.preferences,couponCode:'',shippingId:'standard'}},order};
}
export function restoreOrderStock(db,id){
 const order=db.orders.find(o=>o.id===id);if(!order||order.status!=='cancelled'||!order.stockDeducted||order.stockRestored)return {error:'Este pedido não possui uma devolução de estoque pendente.'};
 let next=db;
 for(const item of order.items){const p=next.products.find(p=>p.id===item.id),v=p&&getVariant(p,item.color,item.size);if(!v)continue;const result=recordMovement(next,p,item.color,item.size,v.stock+item.qty,`Cancelamento ${id}`);if(result.error)return result;next=result.db}
 return {db:{...next,orders:next.orders.map(o=>o.id===id?{...o,stockRestored:true}:o)}};
}
export function transitionOrder(db,id,status,restock=true){
 const order=db.orders.find(o=>o.id===id);if(!order)return {error:'Pedido não encontrado.'};
 const allowed={registered:['preparing','cancelled'],preparing:['shipped','cancelled'],shipped:['delivered'],delivered:[],cancelled:[]};
 if(!allowed[order.status]?.includes(status))return {error:'Transição incompatível ou já concluída.'};
 const updated={...order,status,stage:status==='cancelled'?order.stage:statuses.indexOf(status),events:[...order.events,{status,at:new Date().toISOString()}]};
 const next={...db,orders:db.orders.map(o=>o.id===id?updated:o)};
 return status==='cancelled'&&restock&&order.stockDeducted&&!order.stockRestored?restoreOrderStock(next,id):{db:next};
}
