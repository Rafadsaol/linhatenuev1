export const FREE_SHIPPING_CENTS=29900;
export const shippingMethods=[
 {id:'standard',label:'Entrega padrão',priceCents:1990,estimate:'5–8 dias úteis fictícios'},
 {id:'express',label:'Entrega expressa',priceCents:3490,estimate:'1–3 dias úteis fictícios'},
];
export function shippingPrice(netProductsCents,id='standard'){
 const method=shippingMethods.find(item=>item.id===id);
 if(!method)throw Error('Selecione uma modalidade de entrega.');
 return id==='standard'&&netProductsCents>=FREE_SHIPPING_CENTS?0:method.priceCents;
}
