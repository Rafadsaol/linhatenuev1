import React,{useState} from 'react';
import {RotateCcw} from 'lucide-react';
import {useStore} from '../state/Store';
import {navigate} from '../lib/router';
import Dialog from './Dialog';
export function ClearCartButton(){
 const {clearCart}=useStore(),[open,setOpen]=useState(false);
 return <><button className="text-link clear-cart-button" onClick={()=>setOpen(true)} type="button">Esvaziar sacola</button><Dialog open={open} onClose={()=>setOpen(false)} title="Esvaziar sacola?" className="demo-confirm-dialog" initialFocus=".keep-data"><p>Todas as peças serão removidas da sua sacola demonstrativa.</p><div className="confirm-actions"><button className="button dark keep-data" onClick={()=>setOpen(false)}>Manter peças</button><button className="button outline" onClick={()=>{setOpen(false);clearCart()}}>Esvaziar sacola agora</button></div></Dialog></>;
}
export default function DemoControls(){
 const {resetOpen,setResetOpen,resetDemo}=useStore();
 return <Dialog open={resetOpen} onClose={()=>setResetOpen(false)} title="Reiniciar demonstração?" className="demo-confirm-dialog" initialFocus=".keep-data"><RotateCcw size={30}/><p>A sacola, os favoritos, os pedidos fictícios e as preferências da Linha Tênue serão apagados deste navegador.</p><div className="confirm-actions"><button className="button dark keep-data" onClick={()=>setResetOpen(false)}>Manter demonstração</button><button className="button outline" onClick={()=>{resetDemo();navigate('/minha-conta')}}>Confirmar reinício</button></div><small>Os dados de outros sites e projetos são preservados.</small></Dialog>;
}
