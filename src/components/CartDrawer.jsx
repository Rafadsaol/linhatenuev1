import React from 'react';
import {ArrowRight,ShoppingBag} from 'lucide-react';
import Dialog from './Dialog';
import CartItems from './CartItems';
import {useStore} from '../state/Store';
import {money} from '../data';
export default function CartDrawer(){
 const {cartOpen,setCartOpen,count,subtotal}=useStore();
 return <Dialog open={cartOpen} onClose={()=>setCartOpen(false)} title={`Sua sacola (${count})`} drawer className="cart-drawer">
  {count?<><CartItems/><div className="drawer-summary"><p><span>Subtotal</span><strong>{money(subtotal)}</strong></p><a className="button dark full" href="#/sacola" onClick={()=>setCartOpen(false)}>Ver sacola <ArrowRight size={18}/></a><small>Compra demonstrativa. Nenhum pagamento é realizado.</small></div></>:<div className="empty"><ShoppingBag size={38}/><h3>SUA PRÓXIMA EXPRESSÃO.</h3><p>A sacola está vazia.</p><a className="button dark" href="#/loja" onClick={()=>setCartOpen(false)}>Explorar coleção <ArrowRight size={17}/></a></div>}
 </Dialog>;
}
