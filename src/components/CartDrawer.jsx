import React from 'react';
import {ArrowRight,ShoppingBag} from 'lucide-react';
import Dialog from './Dialog';
import CartItems from './CartItems';
import {useStore} from '../state/Store';
import {formatCents} from '../lib/pricing';
import {demoNotice} from '../lib/demo';
import {ClearCartButton} from './DemoControls';
export default function CartDrawer(){
 const {cartOpen,setCartOpen,count,totals}=useStore();
 return <Dialog open={cartOpen} onClose={()=>setCartOpen(false)} title={`Sua sacola (${count})`} drawer className="cart-drawer">
  {count?<><CartItems/><div className="drawer-summary"><p><span>Subtotal das peças</span><strong>{formatCents(totals.subtotalCents)}</strong></p>{totals.couponCode&&<p><span>{totals.couponCode} aplicado</span><strong>− {formatCents(totals.discountCents)}</strong></p>}<a className="button dark full" href="#/checkout" onClick={()=>setCartOpen(false)}>Ir ao checkout demo <ArrowRight size={18}/></a><div className="drawer-actions"><a href="#/sacola" onClick={()=>setCartOpen(false)}>Ver sacola</a><button onClick={()=>setCartOpen(false)}>Continuar comprando</button></div><ClearCartButton/><small>{demoNotice}</small></div></>:<div className="empty"><ShoppingBag size={38}/><h3>SUA PRÓXIMA EXPRESSÃO.</h3><p>A sacola está vazia.</p><a className="button dark" href="#/loja" onClick={()=>setCartOpen(false)}>Explorar coleção <ArrowRight size={17}/></a></div>}
 </Dialog>;
}
