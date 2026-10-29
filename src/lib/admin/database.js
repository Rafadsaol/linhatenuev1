import {createDatabase,SCHEMA_VERSION,DB_KEY,defaultPreferences,statuses} from './seed.js';
import {cleanProducts} from './catalog.js';
import {cleanOrders} from '../orders.js';
import {cleanCart,safeRead} from '../cart.js';
import {validateCouponDraft} from '../coupons.js';
import {validateCampaign} from './campaign.js';
export function legacyOrder(order,products){return {...order,source:'legacy',customerId:'DEMO-VISITOR',status:statuses[order.stage],stockDeducted:false,stockRestored:false,events:[{status:statuses[order.stage],at:order.createdAt}],categories:order.items.map(item=>products.find(p=>p.id===item.id)?.category||'Arquivo')}}
export function validateDatabase(raw){
 if(!raw||raw.schemaVersion!==SCHEMA_VERSION||!Array.isArray(raw.orders)||!Array.isArray(raw.coupons)||!Array.isArray(raw.customers)||!raw.preferences||!raw.settings)return null;
 const products=cleanProducts(raw.products);if(!products)return null;
 const campaign=validateCampaign(raw.campaign).campaign;if(!campaign)return null;
 const coupons=[];for(const c of raw.coupons){if(!c||typeof c!=='object')return null;const result=validateCouponDraft(c,coupons,c.id);if(result.error||typeof c.id!=='string')return null;coupons.push(result.coupon)}
 const orders=cleanOrders(raw.orders).map(order=>order.source?order:legacyOrder(order,products));
 const customers=raw.customers.filter(c=>c&&typeof c.id==='string'&&/^DEMO-[A-Z0-9-]+$/.test(c.id)&&typeof c.name==='string'&&c.name.length<100).map(c=>({id:c.id,name:c.name,segment:['Core','Street','Art','Visitante'].includes(c.segment)?c.segment:'Visitante',source:c.source==='seed'?'seed':'visitor'}));
 if(!customers.some(c=>c.id==='DEMO-VISITOR'))customers.unshift({id:'DEMO-VISITOR',name:'Visitante Demo',segment:'Visitante',source:'visitor'});
 const threshold=Number(raw.settings.lowStockThreshold);
 return {schemaVersion:SCHEMA_VERSION,revision:Number.isSafeInteger(raw.revision)?raw.revision:0,nextProductId:Math.max(Number.isSafeInteger(raw.nextProductId)?raw.nextProductId:19,...products.map(p=>p.id+1)),seededAt:typeof raw.seededAt==='string'?raw.seededAt:new Date().toISOString(),products,orders,coupons,campaign,customers,cart:cleanCart(raw.cart,products),favorites:Array.isArray(raw.favorites)?[...new Set(raw.favorites)].filter(id=>products.some(p=>p.id===id)):[],preferences:{couponCode:typeof raw.preferences.couponCode==='string'?raw.preferences.couponCode.slice(0,24):'',shippingId:raw.preferences.shippingId==='express'?'express':'standard',reduceMotion:raw.preferences.reduceMotion===true},settings:{storeName:'Linha Tênue',lowStockThreshold:Number.isInteger(threshold)&&threshold>=0&&threshold<=100?threshold:5},stockMovements:Array.isArray(raw.stockMovements)?raw.stockMovements.filter(m=>m&&typeof m.id==='string'&&typeof m.reason==='string'&&Number.isSafeInteger(m.productId)&&typeof m.color==='string'&&typeof m.size==='string'&&Number.isInteger(m.before)&&Number.isInteger(m.after)&&m.after>=0&&Number.isFinite(Date.parse(m.at))).map(m=>({id:m.id,productId:m.productId,color:m.color,size:m.size,before:m.before,after:m.after,reason:m.reason.slice(0,100),at:m.at})).slice(-300):[]};
}
export function loadDatabase(storage,now=new Date()){
 let raw;try{raw=storage.getItem(DB_KEY)}catch{return {db:createDatabase(now),unavailable:true}}
 if(raw){try{const db=validateDatabase(JSON.parse(raw));if(db)return {db}}catch{} }
 const db=createDatabase(now),oldOrders=cleanOrders(safeRead(storage,'lt-orders',[]));
 db.orders=[...oldOrders.map(order=>legacyOrder(order,db.products)),...db.orders.filter(seed=>!oldOrders.some(order=>order.id===seed.id))];
 db.cart=cleanCart(safeRead(storage,'lt-cart',[]),db.products);
 const favorites=safeRead(storage,'lt-favorites',[]),preferences=safeRead(storage,'lt-preferences',defaultPreferences);
 db.favorites=Array.isArray(favorites)?[...new Set(favorites.map(Number))].filter(id=>db.products.some(p=>p.id===id)):[];
 db.preferences={couponCode:typeof preferences?.couponCode==='string'?preferences.couponCode.slice(0,24):'',shippingId:preferences?.shippingId==='express'?'express':'standard',reduceMotion:preferences?.reduceMotion===true};
 return {db,recovered:Boolean(raw),original:raw||null};
}
