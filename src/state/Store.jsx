import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {products} from '../data';
import {addCartItem,cleanCart,lineKey,safeRead,subtotalCents} from '../lib/cart';
import {getVariant} from '../lib/catalog';
const StoreContext=createContext(null);
const read=(key,fallback)=>{try{return safeRead(window.localStorage,key,fallback)}catch{return fallback}};
export function StoreProvider({children}) {
 const [cart,setCart]=useState(()=>cleanCart(read('lt-cart',[]),products));
 const [favorites,setFavorites]=useState(()=>{const saved=read('lt-favorites',[]);return Array.isArray(saved)?[...new Set(saved.map(Number))].filter(id=>products.some(p=>p.id===id)):[]});
 const [toast,setToast]=useState(null);
 const [cartOpen,setCartOpen]=useState(false);
 const [storageFailed,setStorageFailed]=useState(false);
 const cartRef=useRef(cart);
 const notify=(text,type='success')=>setToast({text,type,key:Date.now()});
 const commit=next=>{cartRef.current=next;setCart(next)};
 useEffect(()=>{try{window.localStorage.setItem('lt-cart',JSON.stringify(cart))}catch{setStorageFailed(true)}},[cart]);
 useEffect(()=>{try{window.localStorage.setItem('lt-favorites',JSON.stringify(favorites))}catch{setStorageFailed(true)}},[favorites]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(null),4500);return()=>clearTimeout(t)},[toast]);
 function add(product,color,size,quantity=1){
  const result=addCartItem(cartRef.current,product,color,size,quantity);
  if(result.error){notify(result.error,'error');return false}
  commit(result.cart);notify('Peça adicionada à sacola.');setCartOpen(true);return true;
 }
 function changeQuantity(key,quantity){
  const line=cartRef.current.find(l=>lineKey(l)===key);
  if(!line)return;
  const product=products.find(p=>p.id===line.id);
  const max=getVariant(product,line.color,line.size)?.stock||0;
  if(!Number.isInteger(quantity)||quantity<1||quantity>max){notify(`Quantidade permitida nesta demonstração: 1 a ${max}.`,'error');return}
  commit(cartRef.current.map(item=>lineKey(item)===key?{...item,qty:quantity}:item));
 }
 function remove(key){commit(cartRef.current.filter(item=>lineKey(item)!==key));notify('Peça removida da sacola.')}
 function toggleFavorite(product){
  const active=favorites.includes(product.id);
  setFavorites(old=>old.includes(product.id)?old.filter(id=>id!==product.id):[...old,product.id]);
  notify(active?'Peça removida dos favoritos.':'Peça salva nos favoritos.');
 }
 const value={cart,favorites,toast,notify,setToast,cartOpen,setCartOpen,storageFailed,add,changeQuantity,remove,toggleFavorite,
  count:cart.reduce((n,item)=>n+item.qty,0),subtotal:subtotalCents(cart,products)/100};
 return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useStore(){const value=useContext(StoreContext);if(!value)throw Error('StoreProvider ausente');return value}
