import test from 'node:test';
import assert from 'node:assert/strict';
import {createDatabase,DB_KEY} from '../src/lib/admin/seed.js';
import {loadDatabase,validateDatabase} from '../src/lib/admin/database.js';
import {buildProduct,productDraft,productStock} from '../src/lib/admin/catalog.js';
import {placeOrder,transitionOrder,restoreOrderStock,recordMovement,reconcile} from '../src/lib/admin/operations.js';
import {validateCoupon,validateCouponDraft} from '../src/lib/coupons.js';
import {calculateTotals} from '../src/lib/pricing.js';
import {createOrder,cleanOrders} from '../src/lib/orders.js';
import {metrics,csvReport} from '../src/lib/admin/analytics.js';
import {validateCampaign,defaultCampaign} from '../src/lib/admin/campaign.js';
const now=new Date('2026-10-29T12:00:00Z');
const fresh=()=>createDatabase(now);
const cart=()=>[{id:9,color:'Preto',size:'P',qty:2}];
const checkout=(db=fresh())=>placeOrder({...db,cart:cart()},'pix');
const stock=db=>db.products.find(p=>p.id===9).variants.find(v=>v.color==='Preto'&&v.size==='P').stock;
const memory=entries=>{const values=new Map(entries);return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};
test('V4 seeds 18 preserved products, 42 identifiable example orders and 19 fictional profiles with stable IDs',()=>{
 const first=fresh(),second=fresh();assert.equal(first.products.length,18);assert.equal(first.orders.length,42);assert.equal(first.customers.length,19);
 assert.equal(new Set(first.orders.map(o=>o.id)).size,42);assert.ok(first.orders.every(o=>o.source==='seed'&&!o.stockDeducted));assert.deepEqual(first,second);
 const restored=validateDatabase(JSON.parse(JSON.stringify(first)));assert.equal(restored.orders.length,42);assert.deepEqual(restored.products.find(p=>p.id===9).images.Preto.map(image=>image.label),['Frente','Acabamento','No corpo']);assert.deepEqual(restored.products.map(p=>p.tag||''),first.products.map(p=>p.tag||''));
});
test('V3 migrates once without deleting legacy keys or deducting historical stock',()=>{
 const seed=fresh(),legacy=createOrder({cart:cart(),products:seed.products,couponCode:'LT10',shippingId:'standard',paymentId:'pix'}).order;
 const storage=memory([['lt-orders',JSON.stringify([legacy])],['lt-cart',JSON.stringify(cart())],['lt-favorites','[9]'],['lt-preferences',JSON.stringify({couponCode:'AXIS20',reduceMotion:true})]]);
 const loaded=loadDatabase(storage,now).db;assert.equal(loaded.orders.length,43);assert.equal(loaded.orders[0].source,'legacy');assert.equal(loaded.orders[0].stockDeducted,false);assert.equal(stock(loaded),stock(seed));assert.deepEqual(loaded.cart,cart());assert.deepEqual(loaded.favorites,[9]);assert.equal(loaded.preferences.couponCode,'AXIS20');
 storage.setItem(DB_KEY,JSON.stringify(loaded));const again=loadDatabase(storage,now).db;assert.equal(again.orders.length,43);assert.ok(storage.getItem('lt-orders'));assert.deepEqual(again.orders[0].totals,legacy.totals);
});
test('corrupt database and malformed legacy data recover safely without altering another application',()=>{
 const storage=memory([[DB_KEY,'{broken'],['lt-cart','[null]'],['lt-orders','{}'],['another-app','preserved']]);const loaded=loadDatabase(storage,now);assert.equal(loaded.recovered,true);assert.equal(loaded.original,'{broken');assert.equal(loaded.db.cart.length,0);assert.equal(loaded.db.orders.length,42);assert.equal(storage.getItem('another-app'),'preserved');assert.equal(validateDatabase({schemaVersion:99}),null);
 const wrong=fresh();wrong.products[0].variants[0].stock=-1;assert.equal(validateDatabase(wrong),null);
});
test('product creation validates unique slugs/SKUs, prices, numerical pants sizes and local assets',()=>{
 const db=fresh(),draft={...productDraft(),name:'Boxy Test',slug:'boxy-test',sku:'LT-TEST',price:'119.90',shortDescription:'Peça de exemplo',description:'Uma nova peça fictícia.'};
 const made=buildProduct(draft,null,db.products,db.nextProductId);assert.ok(made.product);assert.equal(made.product.id,19);assert.equal(made.product.price,119.9);
 for(const patch of [{price:'-1'},{price:'1.999'},{promotionalPrice:'200'},{slug:db.products[0].slug},{sku:db.products[0].sku},{frontImage:'https://example.com/image.png'},{category:'Calças Baggy'},{variants:draft.variants.map(v=>({...v,stock:-1}))}])assert.ok(buildProduct({...draft,...patch},null,db.products,19).error,JSON.stringify(patch));
 const promo=buildProduct({...draft,promotionalPrice:'89,90'},null,db.products,19).product;assert.equal(promo.price,89.9);assert.equal(promo.basePrice,119.9);
});
test('variant stock adjustment is atomic, keeps numeric sizes and reconciles unavailable cart lines',()=>{
 const db={...fresh(),cart:cart()};const p=db.products.find(p=>p.id===9);assert.ok(recordMovement(db,p,'Preto','P',-1,'test').error);assert.ok(recordMovement(db,p,'Preto','P',1.5,'test').error);
 const adjusted=recordMovement(db,p,'Preto','P',0,'Test adjustment').db;assert.equal(stock(adjusted),0);assert.equal(adjusted.cart.length,0);assert.equal(adjusted.stockMovements.length,1);assert.equal(stock(db),4);
 const hidden={...db,products:db.products.map(p=>p.id===9?{...p,status:'hidden'}:p)};assert.equal(reconcile(hidden).cart.length,0);assert.ok(placeOrder(hidden,'pix').error);
});
test('a new order deducts stock once and a refresh cannot reapply the deduction',()=>{
 const db=fresh(),before=stock(db),result=checkout(db);assert.ok(result.order);assert.equal(stock(result.db),before-2);assert.equal(result.db.cart.length,0);assert.equal(result.db.orders.length,43);assert.equal(result.order.stockDeducted,true);assert.equal(result.order.customerId,'DEMO-VISITOR');
 const restored=validateDatabase(JSON.parse(JSON.stringify(result.db)));assert.equal(stock(restored),before-2);assert.ok(placeOrder(restored,'pix').error);assert.equal(restored.stockMovements.length,1);
});
test('order transitions reject skips, repeats and terminal changes; cancellation restores stock only once',()=>{
 const {db,order}=checkout();assert.ok(transitionOrder(db,order.id,'shipped').error);assert.ok(transitionOrder(db,order.id,'registered').error);
 const preparing=transitionOrder(db,order.id,'preparing').db;assert.equal(preparing.orders[0].stage,1);assert.equal(preparing.orders[0].status,'preparing');
 const cancelled=transitionOrder(preparing,order.id,'cancelled',true).db;assert.equal(stock(cancelled),4);assert.equal(cancelled.orders[0].stockRestored,true);assert.ok(restoreOrderStock(cancelled,order.id).error);assert.ok(transitionOrder(cancelled,order.id,'preparing').error);
 let delivered=transitionOrder(preparing,order.id,'shipped').db;assert.ok(transitionOrder(delivered,order.id,'cancelled').error);delivered=transitionOrder(delivered,order.id,'delivered').db;assert.equal(delivered.orders[0].stage,3);assert.ok(transitionOrder(delivered,order.id,'registered').error);
});
test('cancellation can defer restocking and deleted products never corrupt saved financial snapshots',()=>{
 const result=checkout(),cancel=transitionOrder(result.db,result.order.id,'cancelled',false).db;assert.equal(stock(cancel),2);assert.equal(cancel.orders[0].stockRestored,false);
 const returned=restoreOrderStock(cancel,result.order.id).db;assert.equal(stock(returned),4);
 const without={...cancel,products:cancel.products.filter(p=>p.id!==9)},restored=restoreOrderStock(without,result.order.id).db;assert.equal(restored.orders[0].stockRestored,true);assert.deepEqual(restored.orders[0].totals,result.order.totals);
 const snapshot=validateDatabase(JSON.parse(JSON.stringify(without)));assert.equal(snapshot.orders[0].items[0].name,'Boxy Fit Black');assert.deepEqual(snapshot.orders[0].totals,result.order.totals);
});
test('custom fixed coupons cap at product subtotal and preserve post-discount shipping arithmetic',()=>{
 const db=fresh(),fixed=validateCouponDraft({code:'DEMO50',type:'fixed',value:5000,minimumCents:10000,limit:2,active:true},db.coupons).coupon;assert.ok(fixed);const list=[...db.coupons,fixed];
 const total=calculateTotals(31980,'DEMO50','standard',list,db.orders);assert.equal(total.discountCents,5000);assert.equal(total.shippingCents,1990);assert.equal(total.totalCents,28970);
 assert.equal(calculateTotals(10000,'DEMO50','express',list,[]).totalCents,8490);
 const huge={...fixed,minimumCents:0,value:50000};assert.equal(calculateTotals(10000,'DEMO50','standard',[huge],[]).discountCents,10000);
 const order=placeOrder({...db,coupons:list,cart:cart(),preferences:{...db.preferences,couponCode:'DEMO50'}},'card').order;assert.equal(cleanOrders([order]).length,1);assert.equal(order.totals.discountType,'fixed');
});
test('coupon minimum, expiry, activity, uniqueness and usage limits are enforced at order creation',()=>{
 const db=fresh(),base={id:'coupon-ONE',code:'ONE',type:'percent',value:10,minimumCents:0,limit:1,expiresAt:'',active:true};
 assert.ok(validateCoupon('ONE',[{...base,active:false}],5000).error);assert.ok(validateCoupon('ONE',[{...base,minimumCents:5001}],5000).error);assert.ok(validateCoupon('ONE',[{...base,expiresAt:'2020-01-01'}],5000).error);
 const coupon=validateCoupon('ONE',[base],5000,[],now);assert.equal(coupon.percent,10);
 const one=placeOrder({...db,coupons:[base],cart:cart(),preferences:{...db.preferences,couponCode:'ONE'}},'pix');assert.ok(one.order);assert.ok(placeOrder({...one.db,cart:[{id:9,color:'Preto',size:'M',qty:1}],preferences:{...db.preferences,couponCode:'ONE'}},'pix').error);
 const cancel=transitionOrder(one.db,one.order.id,'cancelled',true).db;assert.equal(validateCoupon('ONE',[base],5000,cancel.orders).code,'ONE');
 for(const patch of [{value:101},{value:-1},{limit:0},{minimumCents:-1}])assert.ok(validateCouponDraft({...base,...patch},[]).error);assert.ok(validateCouponDraft(base,[base]).error);
});
test('campaign validates structural text, local assets and internal links',()=>{
 assert.ok(validateCampaign(defaultCampaign).campaign);
 for(const patch of [{title:''},{buttonLink:'https://external.test'},{buttonLink:'/checkout'},{image:'https://external.test/a.png'},{topbar:['one']},{featuredCollections:['invalid']}])assert.ok(validateCampaign({...defaultCampaign,...patch}).error);
 assert.ok(validateCampaign({...defaultCampaign,title:'NOVA LINHA.\nNOVA EXPRESSÃO.',buttonLink:'/loja?colecao=Feminino'}).campaign);
});
test('dashboard periods and source filters calculate figures from local orders rather than hardcoded sales',()=>{
 const db=fresh(),week=metrics(db,'7','all',now),all=metrics(db,'all','all',now),visitor=metrics(db,'all','visitor',now);
 assert.ok(week.orders.length<all.orders.length);assert.equal(all.orders.length,42);assert.equal(visitor.orders.length,0);assert.equal(visitor.revenue,0);
 const expected=all.orders.filter(o=>o.status!=='cancelled').reduce((sum,o)=>sum+o.totals.totalCents,0);assert.equal(all.revenue,expected);assert.equal(all.statuses.reduce((sum,s)=>sum+s.value,0),42);assert.equal(all.categories.reduce((sum,c)=>sum+c.value,0),all.orders.filter(o=>o.status!=='cancelled').reduce((sum,o)=>sum+new Set(o.categories).size,0));
 const made=checkout(db);assert.equal(metrics(made.db,'all','visitor',new Date()).orders.length,1);assert.ok(productStock(db.products[0])>=0);
});
test('CSV contains fictional scope, monetary columns and safe escaped cells',()=>{
 const db=fresh(),csv=csvReport(db.orders);assert.ok(csv.startsWith('\uFEFF'));assert.match(csv,/DEMONSTRATIVO/);assert.match(csv,/Total simulado/);assert.match(csv,/Exemplo inicial/);assert.equal(csv.split('\r\n').length,44);
 const custom={...db.orders[0],id:'=FORMULA"test'};assert.ok(csvReport([custom]).includes("'=FORMULA\"\"test"));
});

test('editing away and reintroducing a color preserves matching family photos and numerical measurements',()=>{
 const db=fresh(),original=db.products.find(p=>p.id===9);
 const white=buildProduct({...productDraft(original),colors:['Off-white']},original,db.products).product;
 assert.match(white.detailImage,/fit-offwhite/);
 const draft={...productDraft(white),colors:['Preto'],variants:white.sizes.map(size=>({size,color:'Preto',stock:4}))};
 const black=buildProduct(draft,white,db.products).product;assert.match(black.detailImage,/fit-black/);assert.match(black.images.Preto[1].src,/cotton-black/);
 const pantsDraft={...productDraft(original),category:'Calças Baggy',colors:['Azul'],sizes:['36','38'],variants:[{color:'Azul',size:'36',stock:4},{color:'Azul',size:'38',stock:4}]};
 const pants=buildProduct(pantsDraft,original,db.products).product;assert.equal(pants.kind,'pants');assert.deepEqual(pants.measurements.map(m=>m.size),['36','38']);
});
