import {initialProducts} from './catalog.js';
import {defaultCampaign} from './campaign.js';
import {initialCoupons} from '../coupons.js';
import {createOrder} from '../orders.js';
export const SCHEMA_VERSION=4;
export const DB_KEY='lt-database-v4';
export const statuses=['registered','preparing','shipped','delivered','cancelled'];
export const statusLabels={registered:'Registrado',preparing:'Em preparação',shipped:'Enviado',delivered:'Entregue',cancelled:'Cancelado'};
export const sourceLabel=source=>source==='seed'?'Exemplo inicial':source==='legacy'?'Visitante · V3':'Visitante · V4';
export const defaultPreferences={couponCode:'',shippingId:'standard',reduceMotion:false};
export const defaultSettings={storeName:'Linha Tênue',lowStockThreshold:5};
export function createDatabase(now=new Date()){
 const products=initialProducts(),customers=[{id:'DEMO-VISITOR',name:'Visitante Demo',segment:'Visitante',source:'visitor'},...Array.from({length:18},(_,i)=>({id:`DEMO-C${String(i+1).padStart(3,'0')}`,name:`Perfil Demo ${String(i+1).padStart(2,'0')}`,segment:['Core','Street','Art'][i%3],source:'seed'}))];
 const orders=Array.from({length:42},(_,i)=>{
  const p=products.filter(p=>p.variants.some(v=>v.stock>0))[i%17],v=p.variants.find(v=>v.stock>0);
  const createdAt=new Date(now.getTime()-Math.floor(i*2.1)*86400000-i%12*3600000).toISOString();
  const status=i%9===0?'cancelled':statuses[i%4],stage=Math.max(0,statuses.indexOf(status));
  const order=createOrder({cart:[{id:p.id,color:v.color,size:v.size,qty:1+i%2}],products,couponCode:i%3===0?'LT10':'',shippingId:i%4===0?'express':'standard',paymentId:['card','pix','boleto'][i%3],id:`LT-DEMO-SEED-${String(i+1).padStart(4,'0')}`,now:createdAt}).order;
  return {...order,source:'seed',customerId:customers[1+i%18].id,status,stage:Math.min(3,stage),stockDeducted:false,stockRestored:false,events:[{status:'registered',at:createdAt},...(status!=='registered'?[{status,at:createdAt}]:[])],categories:order.items.map(item=>products.find(p=>p.id===item.id).category)};
 });
 return {schemaVersion:SCHEMA_VERSION,revision:0,nextProductId:19,seededAt:now.toISOString(),products,customers,orders,coupons:initialCoupons(),campaign:structuredClone(defaultCampaign),cart:[],favorites:[],preferences:{...defaultPreferences},settings:{...defaultSettings},stockMovements:[]};
}
