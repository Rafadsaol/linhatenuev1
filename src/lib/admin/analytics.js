import {statusLabels} from './seed.js';
export function periodOrders(orders,period='30',source='all',now=new Date()){
 const cutoff=period==='all'?0:now.getTime()-Number(period)*86400000;
 return orders.filter(o=>new Date(o.createdAt).getTime()>=cutoff&&(source==='all'||(source==='seed'?o.source==='seed':o.source!=='seed'))).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}
export function metrics(db,period='30',source='all',now=new Date()){
 const orders=periodOrders(db.orders,period,source,now),paid=orders.filter(o=>o.status!=='cancelled');
 const revenue=paid.reduce((sum,o)=>sum+o.totals.totalCents,0),productMap=new Map(),categories=new Map(),days=new Map();
 for(const order of paid){const day=order.createdAt.slice(0,10);days.set(day,(days.get(day)||0)+order.totals.totalCents);order.items.forEach((item,index)=>{const old=productMap.get(item.id)||{id:item.id,name:item.name,quantity:0,value:0};old.quantity+=item.qty;old.value+=item.lineTotalCents;productMap.set(item.id,old);});for(const category of new Set(order.categories.length?order.categories:['Arquivo']))categories.set(category,(categories.get(category)||0)+1)}
 return {orders,revenue,average:paid.length?Math.round(revenue/paid.length):0,productCount:db.products.length,lowStock:db.products.filter(p=>p.variants.some(v=>v.stock<=db.settings.lowStockThreshold)).length,customers:db.customers.length,seedCount:orders.filter(o=>o.source==='seed').length,visitorCount:orders.filter(o=>o.source!=='seed').length,statuses:Object.entries(statusLabels).map(([id,label])=>({id,label,value:orders.filter(o=>o.status===id).length})),bestsellers:[...productMap.values()].sort((a,b)=>b.quantity-a.quantity),categories:[...categories].map(([label,value])=>({label,value})),days:[...days].sort(([a],[b])=>a.localeCompare(b)).map(([label,value])=>({label,value})),volume:[...new Set(orders.map(o=>o.createdAt.slice(0,10)))].sort().map(label=>({label,value:orders.filter(o=>o.createdAt.startsWith(label)).length}))};
}
export function csvReport(orders){
 const cell=value=>{let text=String(value??'');if(/^[=+\-@]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"'};
 const rows=[['RELATÓRIO DEMONSTRATIVO — LINHA TÊNUE'],['Pedido fictício','Origem','Data ISO','Status fictício','Itens','Subtotal (R$)','Desconto (R$)','Frete (R$)','Total simulado (R$)'],...orders.map(o=>[o.id,o.source==='seed'?'Exemplo inicial':'Visitante',o.createdAt,statusLabels[o.status],o.items.reduce((sum,item)=>sum+item.qty,0),...['subtotalCents','discountCents','shippingCents','totalCents'].map(key=>(o.totals[key]/100).toFixed(2).replace('.',','))])];
 return '\uFEFF'+rows.map(row=>row.map(cell).join(';')).join('\r\n');
}
export function downloadFile(name,contents,type='application/json'){
 const url=URL.createObjectURL(new Blob([contents],{type}));const link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
