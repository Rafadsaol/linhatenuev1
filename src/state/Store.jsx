import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {addCartSelection,lineKey,subtotalCents} from '../lib/cart';
import {getVariant} from '../lib/catalog';
import {validateCoupon,validateCouponDraft} from '../lib/coupons';
import {calculateTotals} from '../lib/pricing';
import {demoStorageKeys} from '../lib/demo';
import {loadDatabase,validateDatabase} from '../lib/admin/database';
import {DB_KEY,createDatabase,defaultPreferences} from '../lib/admin/seed';
import {buildProduct,productDraft} from '../lib/admin/catalog';
import {validateCampaign,defaultCampaign} from '../lib/admin/campaign';
import {initialCoupons} from '../lib/coupons';
import {initialProducts} from '../lib/admin/catalog';
import {createCampaignSync} from '../lib/campaignSync';
import {placeOrder,transitionOrder,restoreOrderStock,recordMovement,reconcile} from '../lib/admin/operations';
const StoreContext=createContext(null);
function initialize(){try{return loadDatabase(window.localStorage)}catch{return {db:createDatabase(),unavailable:true}}}
export function StoreProvider({children}){
 const [loaded]=useState(initialize),[db,setDb]=useState(loaded.db),dbRef=useRef(db),recoveryBacked=useRef(!loaded.recovered);
 const [storageFailed,setStorageFailed]=useState(Boolean(loaded.unavailable)),[recovered,setRecovered]=useState(Boolean(loaded.recovered));
 const [toast,setToast]=useState(null),[cartOpen,setCartOpen]=useState(false),[quickView,setQuickView]=useState(null),[activeLook,setActiveLook]=useState(null),[resetOpen,setResetOpen]=useState(false);
 const [campaignSync,setCampaignSync]=useState({state:'connecting',message:'Conectando a campanha compartilhada…'}),campaignChannel=useRef(null);
 const notify=(text,type='success')=>setToast({text,type,key:Date.now()});
 function persist(next){try{if(!recoveryBacked.current&&loaded.original){window.localStorage.setItem('lt-recovery-v4',loaded.original);recoveryBacked.current=true}window.localStorage.setItem(DB_KEY,JSON.stringify(next))}catch{setStorageFailed(true)}}
 function latest(){try{const raw=window.localStorage.getItem(DB_KEY);if(raw){const saved=validateDatabase(JSON.parse(raw));if(saved&&saved.revision>=dbRef.current.revision)return saved}}catch{}return dbRef.current}
 function transact(operation,message){
  const before=latest(),result=operation(before);
  if(result.error){notify(result.error,'error');return result}
  const next=reconcile({...result.db,revision:before.revision+1});dbRef.current=next;persist(next);setDb(next);if(message)notify(message);return {...result,db:next};
 }
 useEffect(()=>{
  try{if(loaded.recovered&&loaded.original)window.localStorage.setItem('lt-recovery-v4',loaded.original);const raw=window.localStorage.getItem(DB_KEY);const current=raw&&validateDatabase(JSON.parse(raw));if(current){dbRef.current=current;setDb(current)}else persist(dbRef.current)}catch{persist(dbRef.current)}
  const sync=event=>{if(event.key!==DB_KEY)return;try{const raw=window.localStorage.getItem(DB_KEY),current=raw&&validateDatabase(JSON.parse(raw));if(current){dbRef.current=current;setDb(current)}}catch{setStorageFailed(true)}};
  window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
 },[]);
 useEffect(()=>{
  const channel=createCampaignSync({getCampaign:()=>dbRef.current.campaign,onStatus:setCampaignSync,onCampaign:campaign=>transact(current=>({db:{...current,campaign}}))});campaignChannel.current=channel;
  const sync=()=>{if(document.visibilityState!=='hidden')void channel.poll()};sync();
  const timer=setInterval(sync,3000);window.addEventListener('focus',sync);document.addEventListener('visibilitychange',sync);
  return()=>{channel.stop();campaignChannel.current=null;clearInterval(timer);window.removeEventListener('focus',sync);document.removeEventListener('visibilitychange',sync)};
 },[]);
 useEffect(()=>{document.documentElement.classList.toggle('demo-reduced-motion',db.preferences.reduceMotion);return()=>document.documentElement.classList.remove('demo-reduced-motion')},[db.preferences.reduceMotion]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(null),4500);return()=>clearTimeout(timer)},[toast]);
 const updatePreferences=patch=>transact(current=>({db:{...current,preferences:{...current.preferences,...patch}}}));
 function addMany(selections,{openCart=true}={}){
  const result=transact(current=>{const canonical=selections.map(item=>({...item,product:current.products.find(p=>p.id===item.product.id)}));const added=addCartSelection(current.cart,canonical);return added.error?added:{db:{...current,cart:added.cart}}},selections.length>1?'Seu look foi adicionado à sacola.':'Peça adicionada à sacola.');
  if(result.error)return false;if(openCart)setCartOpen(true);return true;
 }
 function changeQuantity(key,quantity){return transact(current=>{
  const line=current.cart.find(l=>lineKey(l)===key),p=line&&current.products.find(p=>p.id===line.id),max=p?getVariant(p,line.color,line.size)?.stock||0:0;
  if(!line||!Number.isInteger(quantity)||quantity<1||quantity>max)return {error:`Quantidade permitida nesta demonstração: 1 a ${max}.`};
  return {db:{...current,cart:current.cart.map(item=>lineKey(item)===key?{...item,qty:quantity}:item)}};
 })}
 function applyCoupon(value){
  let checked;
  const result=transact(current=>{checked=validateCoupon(value,current.coupons,subtotalCents(current.cart,current.products),current.orders);return checked.error?checked:{db:{...current,preferences:{...current.preferences,couponCode:checked.code}}}});
  if(!result.error)notify(`${checked.code} aplicado: ${checked.coupon.type==='percent'?`${checked.percent}%`:'desconto fixo'} sobre as peças.`);return result.error?result:checked;
 }
 function submitOrder(paymentId){const result=transact(current=>placeOrder(current,paymentId),'Pedido fictício registrado. Nenhuma cobrança foi realizada.');return result}
 function saveProduct(draft,id){return transact(current=>{const existing=current.products.find(p=>p.id===id);if(id&&!existing)return {error:'Produto removido em outra aba. Atualize a página.'};const built=buildProduct(draft,existing,current.products,current.nextProductId);return built.error?built:{db:{...current,nextProductId:existing?current.nextProductId:current.nextProductId+1,products:existing?current.products.map(p=>p.id===id?built.product:p):[...current.products,built.product]},product:built.product}},'Produto demonstrativo salvo. A vitrine foi atualizada.')}
 function duplicateProduct(id){return transact(current=>{const original=current.products.find(p=>p.id===id);if(!original)return {error:'Produto não encontrado.'};const draft=productDraft(original);let suffix=1;while(current.products.some(p=>p.slug===`${original.slug}-copia-${suffix}`||p.sku===`${original.sku}-C${suffix}`))suffix++;Object.assign(draft,{name:`${original.name} — Cópia ${suffix}`,slug:`${original.slug}-copia-${suffix}`,sku:`${original.sku}-C${suffix}`,status:'hidden',featured:false});const built=buildProduct(draft,null,current.products,current.nextProductId);return built.error?built:{db:{...current,nextProductId:current.nextProductId+1,products:[...current.products,built.product]}}},'Cópia criada como oculta. Revise antes de ativar.')}
 function saveCoupon(draft,id){return transact(current=>{const result=validateCouponDraft(draft,current.coupons,id);if(result.error)return result;return {db:{...current,coupons:id?current.coupons.map(c=>c.id===id?result.coupon:c):[...current.coupons,result.coupon]}}},'Cupom demonstrativo salvo.')}
 function saveCampaign(draft){const result=transact(current=>{const result=validateCampaign(draft);return result.error?result:{db:{...current,campaign:result.campaign}}},'Campanha salva. Sincronizando com os dispositivos conectados.');if(!result.error)campaignChannel.current?.publish(result.db.campaign);return result}
 function resetDemo(){
  recoveryBacked.current=true;
  const result=transact(()=>({db:createDatabase()}));
  if(!result.error){campaignChannel.current?.publish(result.db.campaign);try{for(const key of [...demoStorageKeys,'lt-recovery-v4'])window.localStorage.removeItem(key)}catch{setStorageFailed(true)}setRecovered(false);setCartOpen(false);setQuickView(null);setActiveLook(null);setResetOpen(false);notify('Demonstração reiniciada. Dados iniciais restaurados.')}
 }
 const products=db.products.filter(p=>p.status==='active'),orders=db.orders.filter(o=>o.customerId==='DEMO-VISITOR'&&o.source!=='seed'),totals=calculateTotals(subtotalCents(db.cart,db.products),db.preferences.couponCode,db.preferences.shippingId,db.coupons,db.orders);
 const couponIssue=db.preferences.couponCode?validateCoupon(db.preferences.couponCode,db.coupons,subtotalCents(db.cart,db.products),db.orders).error||'':'';
 const value={db,campaignSync,products,allProducts:db.products,allOrders:db.orders,orders,customers:db.customers,coupons:db.coupons,campaign:db.campaign,settings:db.settings,cart:db.cart,favorites:db.favorites,preferences:db.preferences,totals,couponIssue,toast,notify,setToast,cartOpen,setCartOpen,quickView,setQuickView,activeLook,setActiveLook,resetOpen,setResetOpen,storageFailed,recovered,
  addMany,add:(product,color,size,quantity=1,options)=>addMany([{product,color,size,quantity}],options),changeQuantity,
  remove:key=>transact(current=>({db:{...current,cart:current.cart.filter(item=>lineKey(item)!==key)}}),'Peça removida da sacola.'),
  clearCart:()=>transact(current=>({db:{...current,cart:[]}}),'Sacola esvaziada.'),
  toggleFavorite:product=>transact(current=>({db:{...current,favorites:current.favorites.includes(product.id)?current.favorites.filter(id=>id!==product.id):[...current.favorites,product.id]}}),'Favoritos atualizados.'),
  applyCoupon,removeCoupon:()=>{updatePreferences({couponCode:''});notify('Cupom removido.')},setShipping:id=>{if(['standard','express'].includes(id))updatePreferences({shippingId:id})},setReducedMotion:checked=>updatePreferences({reduceMotion:checked}),submitOrder,
  nextOrderStage:id=>transact(current=>{const order=current.orders.find(o=>o.id===id);const next={registered:'preparing',preparing:'shipped',shipped:'delivered'}[order?.status];return next?transitionOrder(current,id,next):{error:'Não há próxima etapa para este pedido.'}},'Etapa fictícia atualizada.'),
  changeOrderStatus:(id,status,restock)=>transact(current=>transitionOrder(current,id,status,restock),'Status demonstrativo atualizado nas duas interfaces.'),
  restoreStock:id=>transact(current=>restoreOrderStock(current,id),'Estoque devolvido uma única vez.'),
  saveProduct,duplicateProduct,toggleProduct:id=>transact(current=>({db:{...current,products:current.products.map(p=>p.id===id?{...p,status:p.status==='active'?'hidden':'active'}:p)}}),'Disponibilidade da vitrine atualizada.'),
  deleteProduct:id=>transact(current=>({db:{...current,products:current.products.filter(p=>p.id!==id)}}),'Produto removido. Os snapshots de pedidos foram preservados.'),
  adjustStock:(id,color,size,quantity)=>transact(current=>{const p=current.products.find(p=>p.id===id);return p?recordMovement(current,p,color,size,Number(quantity),'Ajuste pelo Admin Demo'):{error:'Produto não encontrado.'}},'Estoque fictício atualizado.'),
  saveCoupon,toggleCoupon:id=>transact(current=>({db:{...current,coupons:current.coupons.map(c=>c.id===id?{...c,active:!c.active}:c)}}),'Cupom atualizado.'),deleteCoupon:id=>transact(current=>({db:{...current,coupons:current.coupons.filter(c=>c.id!==id)}}),'Cupom removido. Descontos históricos preservados.'),saveCampaign,
  restoreSection:section=>{const result=transact(current=>({db:{...current,...(section==='catalog'?{products:initialProducts(),stockMovements:[],orders:current.orders.map(o=>({...o,stockDeducted:false,stockRestored:false}))}:section==='campaign'?{campaign:structuredClone(defaultCampaign)}:{coupons:initialCoupons()})}}),'Dados padrão restaurados.');if(!result.error&&section==='campaign')campaignChannel.current?.publish(result.db.campaign);return result},
  saveSettings:value=>{const n=Number(value);return transact(current=>Number.isInteger(n)&&n>=0&&n<=100?{db:{...current,settings:{...current.settings,lowStockThreshold:n}}}:{error:'Limite de estoque baixo: inteiro de 0 a 100.'},'Preferências demonstrativas atualizadas.')},resetDemo,
  count:db.cart.reduce((n,item)=>n+item.qty,0),subtotal:totals.subtotalCents/100};
 return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useStore(){const value=useContext(StoreContext);if(!value)throw Error('StoreProvider ausente');return value}
