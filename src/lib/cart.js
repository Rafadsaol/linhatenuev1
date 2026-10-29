import {getVariant} from './catalog.js';
export const lineKey = item => `${item.id}:${item.color}:${item.size}`;
export function cleanCart(value,products) {
 if(!Array.isArray(value))return [];
 const lines=[];
 for(const item of value){
  if(!item||typeof item!=='object')continue;
  const product=products.find(p=>p.id===Number(item.id));
  if(!product)continue;
  let size=String(item.size);
  if(product.kind==='pants'&&['P','M','G','GG'].includes(size))size=product.sizes[['P','M','G','GG'].indexOf(size)];
  const variant=getVariant(product,item.color,size);
  const qty=Number(item.qty);
  if(!variant?.stock||!Number.isFinite(qty)||qty<1)continue;
  const line={id:product.id,color:variant.color,size:variant.size,qty:Math.min(Math.floor(qty),variant.stock)};
  const existing=lines.find(l=>lineKey(l)===lineKey(line));
  if(existing)existing.qty=Math.min(existing.qty+line.qty,variant.stock);else lines.push(line);
 }
 return lines;
}
export function addCartItem(cart,product,color,size,quantity=1) {
 const variant=getVariant(product,color,size);
 if(!variant)return {error:'Selecione a cor e o tamanho da peça.'};
 if(!variant.stock)return {error:'Esta variante está indisponível na demonstração.'};
 if(!Number.isInteger(quantity)||quantity<1)return {error:'Escolha uma quantidade válida.'};
 const line={id:product.id,color,size:String(size),qty:quantity};
 const existing=cart.find(item=>lineKey(item)===lineKey(line));
 if(quantity+(existing?.qty||0)>variant.stock)return {error:`Limite demonstrativo desta variante: ${variant.stock} unidade(s). Você já tem ${existing?.qty||0} na sacola.`};
 return {cart:existing?cart.map(item=>lineKey(item)===lineKey(line)?{...item,qty:item.qty+quantity}:item):[...cart,line]};
}
export function addCartSelection(cart,selections){
 if(!selections.length)return {error:'Escolha pelo menos uma peça para montar o look.'};
 let next=cart;
 for(const {product,color,size,quantity=1} of selections){
  const result=addCartItem(next,product,color,size,quantity);
  if(result.error)return {error:`${product.name}: ${result.error}`};
  next=result.cart;
 }
 return {cart:next};
}
export const subtotalCents=(cart,products)=>cart.reduce((total,item)=>total+Math.round((products.find(p=>p.id===item.id)?.price||0)*100)*item.qty,0);
export function safeRead(storage,key,fallback) {
 try {const value=storage.getItem(key);return value===null?fallback:JSON.parse(value)}catch{return fallback}
}
