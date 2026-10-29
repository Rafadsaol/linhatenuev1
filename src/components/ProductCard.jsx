import React from 'react';
import {Plus} from 'lucide-react';
import {money} from '../data';
export default function ProductCard({p}){return <a className="product-card" href={`#/produto/${p.id}`}><div className="product-image"><img src={p.image} alt={p.name} loading="lazy"/>{p.tag&&<span className={'tag '+(p.tag==='NOVO DROP'?'blue':'')}>{p.tag}</span>}<span className="quick-add"><Plus size={19}/></span></div><div className="product-info"><div><h3>{p.name}</h3><p>{p.category} · {p.color}</p></div><span>{money(p.price)}</span></div><div className="swatches"><i style={{background:p.color==='Azul'?'#3159a4':p.color==='Off-white'?'#e5e1d7':'#252525'}}/><i style={{background:'#bcb7ac'}}/></div></a>;}
