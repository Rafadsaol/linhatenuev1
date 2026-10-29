import React from 'react';
import {ArrowUpRight,ShoppingBag} from 'lucide-react';
export default function EmptyState({title='UM ESPAÇO PARA SUA IDENTIDADE.',text='Sua sacola está vazia. Encontre sua próxima peça.',href='#/loja',action='Explorar coleção'}){
 return <div className="empty experience-empty"><ShoppingBag size={36}/><span className="eyebrow">A PRÓXIMA LINHA É SUA</span><h2>{title}</h2><p>{text}</p><a className="button dark" href={href}>{action}<ArrowUpRight size={18}/></a></div>;
}
