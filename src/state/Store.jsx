import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {products} from '../data';
import {addCartSelection,cleanCart,lineKey,safeRead,subtotalCents} from '../lib/cart';
import {getVariant} from '../lib/catalog';
import {validateCoupon,couponPercent,normalizeCoupon} from '../lib/coupons';
import {calculateTotals} from '../lib/pricing';
import {createOrder,cleanOrders,advanceOrder} from '../lib/orders';
import {demoStorageKeys} from '../lib/demo';
const StoreContext=createContext(null);
const read=(key,fallback)=>{try{return safeRead(window.localStorage,key,fallback)}catch{return fallback}};
const defaults={couponCode:'',shippingId:'standard',reduceMotion:false};
function readPreferences(){
 const saved=read('lt-preferences',{});
 return {couponCode:couponPercent(saved?.couponCode)?normalizeCoupon(saved.couponCode):'',shippingId:saved?.shippingId==='express'?'express':'standard',reduceMotion:saved?.reduceMotion===true};
}
export function StoreProvider({children}) {
 const [cart,setCart]=useState(()=>cleanCart(read('lt-cart',[]),products));
 const [favorites,setFavorites]=useState(()=>{const saved=read('lt-favorites',[]);return Array.isArray(saved)?[...new Set(saved.map(Number))].filter(id=>products.some(p=>p.id===id)):[]});
 const [orders,setOrders]=useState(()=>cleanOrders(read('lt-orders',[])));
 const [preferences,setPreferences]=useState(readPreferences);
 const [toast,setToast]=useState(null),[cartOpen,setCartOpen]=useState(false);
 const [quickView,setQuickView]=useState(null),[activeLook,setActiveLook]=useState(null),[resetOpen,setResetOpen]=useState(false);
 const [storageFailed,setStorageFailed]=useState(false);
 const cartRef=useRef(cart),ordersRef=useRef(orders),preferencesRef=useRef(preferences);
 const notify=(text,type='success')=>setToast({text,type,key:Date.now()});
 const commit=next=>{cartRef.current=next;setCart(next)};
 function persist(key,value,empty){try{if(empty)window.localStorage.removeItem(key);else window.localStorage.setItem(key,JSON.stringify(value))}catch{setStorageFailed(true)}}
 function updatePreferences(patch){const next={...preferencesRef.current,...patch};preferencesRef.current=next;setPreferences(next)}
 useEffect(()=>persist('lt-cart',cart,!cart.length),[cart]);
 useEffect(()=>persist('lt-favorites',favorites,!favorites.length),[favorites]);
 useEffect(()=>persist('lt-orders',orders,!orders.length),[orders]);
 useEffect(()=>persist('lt-preferences',preferences,JSON.stringify(preferences)===JSON.stringify(defaults)),[preferences]);
 useEffect(()=>{document.documentElement.classList.toggle('demo-reduced-motion',preferences.reduceMotion);return()=>document.documentElement.classList.remove('demo-reduced-motion')},[preferences.reduceMotion]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(null),4500);return()=>clearTimeout(t)},[toast]);
 function addMany(selections,{openCart=true}={}){
  const result=addCartSelection(cartRef.current,selections);
  if(result.error){notify(result.error,'error');return false}
  commit(result.cart);notify(selections.length>1?'Seu look foi adicionado à sacola.':'Peça adicionada à sacola.');if(openCart)setCartOpen(true);return true;
 }
 function add(product,color,size,quantity=1,options){return addMany([{product,color,size,quantity}],options)}
 function changeQuantity(key,quantity){
  const line=cartRef.current.find(l=>lineKey(l)===key);
  if(!line)return;
  const max=getVariant(products.find(p=>p.id===line.id),line.color,line.size)?.stock||0;
  if(!Number.isInteger(quantity)||quantity<1||quantity>max){notify(`Quantidade permitida nesta demonstração: 1 a ${max}.`,'error');return}
  commit(cartRef.current.map(item=>lineKey(item)===key?{...item,qty:quantity}:item));
 }
 function remove(key){commit(cartRef.current.filter(item=>lineKey(item)!==key));notify('Peça removida da sacola.')}
 function clearCart(){commit([]);notify('Sacola esvaziada. Sua próxima expressão começa aqui.')}
 function toggleFavorite(product){
  const active=favorites.includes(product.id);
  setFavorites(old=>old.includes(product.id)?old.filter(id=>id!==product.id):[...old,product.id]);
  notify(active?'Peça removida dos favoritos.':'Peça salva nos favoritos.');
 }
 function applyCoupon(value){
  const result=validateCoupon(value);
  if(result.error)return result;
  updatePreferences({couponCode:result.code});notify(`${result.code} aplicado: ${result.percent}% sobre as peças.`);return result;
 }
 function submitOrder(paymentId){
  const result=createOrder({cart:cartRef.current,products,...preferencesRef.current,paymentId});
  if(result.error){notify(result.error,'error');return result}
  const next=[result.order,...ordersRef.current];
  persist('lt-orders',next,false);ordersRef.current=next;setOrders(next);
  commit([]);persist('lt-cart',[],true);updatePreferences({couponCode:'',shippingId:'standard'});
  notify('Pedido fictício registrado. Nenhuma cobrança foi realizada.');return result;
 }
 function nextOrderStage(id){
  const next=ordersRef.current.map(order=>order.id===id?advanceOrder(order):order);
  ordersRef.current=next;setOrders(next);notify('Etapa fictícia atualizada. Nenhum envio real é realizado.');
 }
 function resetDemo(){
  for(const key of demoStorageKeys)persist(key,null,true);
  commit([]);setFavorites([]);ordersRef.current=[];setOrders([]);updatePreferences(defaults);
  setCartOpen(false);setQuickView(null);setActiveLook(null);setResetOpen(false);notify('Demonstração reiniciada neste navegador.');
 }
 const totals=calculateTotals(subtotalCents(cart,products),preferences.couponCode,preferences.shippingId);
 const value={cart,favorites,orders,preferences,totals,toast,notify,setToast,cartOpen,setCartOpen,quickView,setQuickView,activeLook,setActiveLook,resetOpen,setResetOpen,storageFailed,add,addMany,changeQuantity,remove,clearCart,toggleFavorite,applyCoupon,
  removeCoupon:()=>{updatePreferences({couponCode:''});notify('Cupom removido.');},setShipping:id=>{if(['standard','express'].includes(id))updatePreferences({shippingId:id})},setReducedMotion:checked=>updatePreferences({reduceMotion:checked}),submitOrder,nextOrderStage,resetDemo,
  count:cart.reduce((n,item)=>n+item.qty,0),subtotal:totals.subtotalCents/100};
 return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useStore(){const value=useContext(StoreContext);if(!value)throw Error('StoreProvider ausente');return value}
