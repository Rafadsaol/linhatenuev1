import React,{useId,useState} from 'react';
import {X,Check} from 'lucide-react';
import {useStore} from '../state/Store';
export default function CouponForm(){
 const {preferences,applyCoupon,removeCoupon}=useStore();
 const [value,setValue]=useState(''),[error,setError]=useState('');
 const id=useId();
 return <div className="coupon-box"><form className="coupon-form" onSubmit={event=>{event.preventDefault();const result=applyCoupon(value);setError(result.error||'');if(!result.error)setValue('')}}><label htmlFor={id}>Cupom de desconto</label><div><input id={id} value={value} onChange={event=>{setValue(event.target.value);setError('')}} placeholder="LT10 ou AXIS20" autoComplete="off" maxLength={24} aria-invalid={Boolean(error)} aria-describedby={error?`${id}-error`:undefined}/><button type="submit">Aplicar</button></div></form>{error&&<p id={`${id}-error`} className="selection-error" role="alert">{error}</p>}{preferences.couponCode&&<div className="applied-coupon" role="status"><Check size={15}/><span>{preferences.couponCode} aplicado</span><button type="button" onClick={()=>{removeCoupon();setError('')}} aria-label="Remover cupom"><X size={16}/></button></div>}<small>Um cupom por pedido. Desconto somente nas peças.</small></div>;
}
