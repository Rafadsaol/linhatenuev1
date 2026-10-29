import test from 'node:test';
import assert from 'node:assert/strict';
import {products} from '../src/data.js';
import {addCartSelection,addCartItem} from '../src/lib/cart.js';
import {calculateTotals,formatCents} from '../src/lib/pricing.js';
import {validateCoupon} from '../src/lib/coupons.js';
import {shippingPrice} from '../src/lib/shipping.js';
import {createOrder,cleanOrders,advanceOrder,orderStages,orderDate} from '../src/lib/orders.js';
import {looks} from '../src/lib/looks.js';
const tee=products.find(p=>p.id===9),pants=products.find(p=>p.id===5);
const selection=[{product:tee,color:'Preto',size:'P'},{product:pants,color:'Azul',size:'38'}];
const cart=addCartSelection([],selection).cart;
const make=overrides=>createOrder({cart,products,couponCode:'LT10',shippingId:'standard',paymentId:'pix',...overrides});
test('coupons normalize, preserve LINHA10, reject invalid codes and replace rather than stack',()=>{
 assert.deepEqual(validateCoupon(' lt10 '),{code:'LT10',percent:10});
 assert.equal(validateCoupon('AXIS20').percent,20);assert.equal(validateCoupon('LINHA10').percent,10);
 for(const code of ['',null,'invalid','LT10 AXIS20'])assert.ok(validateCoupon(code).error);
 const a=calculateTotals(31980,'LT10'),b=calculateTotals(31980,'AXIS20');
 assert.equal(a.discountCents,3198);assert.equal(b.discountCents,6396);assert.equal(b.netProductsCents,25584);
});
test('free standard delivery uses the post-discount subtotal with an inclusive 29900-cent boundary',()=>{
 assert.equal(shippingPrice(29899),1990);assert.equal(shippingPrice(29900),0);assert.equal(shippingPrice(29901),0);
 const noCoupon=calculateTotals(31980),discounted=calculateTotals(31980,'LT10');
 assert.equal(noCoupon.shippingCents,0);assert.equal(discounted.netProductsCents,28782);assert.equal(discounted.shippingCents,1990);assert.equal(discounted.totalCents,30772);
 assert.equal(calculateTotals(33222,'LT10').netProductsCents,29900);assert.equal(calculateTotals(33222,'LT10').shippingCents,0);
});
test('express delivery always costs 3490 cents and discounts apply only to products',()=>{
 const total=calculateTotals(99900,'AXIS20','express');
 assert.equal(total.discountCents,19980);assert.equal(total.shippingCents,3490);assert.equal(total.totalCents,83410);
 assert.equal(calculateTotals(31980,'AXIS20','express').totalCents,29074);
 assert.throws(()=>shippingPrice(29900,'invalid'));
});
test('cent rounding, pt-BR currency, empty carts and recalculation remain consistent',()=>{
 assert.equal(calculateTotals(10005,'LT10').discountCents,1001);assert.equal(calculateTotals(10005,'LT10').netProductsCents,9004);
 assert.equal(calculateTotals(0,'AXIS20').totalCents,0);
 assert.equal(calculateTotals(11990*2,'LT10').discountCents,2398);
 assert.equal(calculateTotals(11990,'LT10').discountCents,1199);
 assert.match(formatCents(30772),/^R\$\s307,72$/);
 for(const value of [-1,1.5,NaN,Infinity])assert.throws(()=>calculateTotals(value));
});
test('look selections are atomic, group variants and never partially add an invalid selection',()=>{
 assert.equal(cart.length,2);assert.equal(addCartSelection(cart,selection).cart[0].qty,2);
 const before=JSON.stringify(cart);
 assert.ok(addCartSelection(cart,[selection[0],{...selection[1],size:''}]).error);
 assert.ok(addCartSelection(cart,[{...selection[0],quantity:99},selection[1]]).error);
 assert.ok(addCartSelection(cart,[]).error);assert.equal(JSON.stringify(cart),before);
 const colors=addCartItem(cart,tee,'Off-white','P').cart;assert.equal(colors.length,3);
});
test('each editorial look combines an available tee and pants from the preserved catalog',()=>{
 assert.ok(looks.length>=2&&looks.length<=3);assert.equal(products.length,18);
 for(const look of looks){const pieces=look.ids.map(id=>products.find(p=>p.id===id));assert.deepEqual(pieces.map(p=>p.kind),['tee','pants']);assert.ok(pieces.every(p=>p.variants.some(v=>v.stock>0)))}
});
test('orders validate cart, stock, delivery, coupon and payment before creating a simulation',()=>{
 for(const override of [{cart:[]},{cart:[{...cart[0],qty:99}]},{cart:[{...cart[0],qty:0}]},{cart:[{...cart[0],size:'invalid'}]},{shippingId:'invalid'},{paymentId:''},{paymentId:'bank-real'},{couponCode:'bad'}])assert.ok(make(override).error,JSON.stringify(override));
 for(const paymentId of ['card','pix','boleto'])assert.equal(make({paymentId}).order.paymentId,paymentId);
});
test('orders have unique fictional identifiers, immutable value snapshots and no profile or financial fields',()=>{
 const first=make().order,second=make().order;
 assert.notEqual(first.id,second.id);assert.match(first.id,/^LT-DEMO-/);assert.equal(first.totals.totalCents,30772);
 assert.notEqual(first.items[0],cart[0]);assert.ok(Object.isFrozen(first));assert.ok(Object.isFrozen(first.items[0]));assert.ok(Object.isFrozen(first.totals));
 assert.throws(()=>{first.items[0].qty=999});assert.throws(()=>{first.totals.totalCents=0});
 const catalog=products.map(p=>({...p})),sourceCart=cart.map(line=>({...line}));
 const snapshot=make({products:catalog,cart:sourceCart}).order;
 catalog.find(p=>p.id===tee.id).name='Changed catalog';catalog.find(p=>p.id===tee.id).price=0.01;sourceCart[0].qty=2;
 const later=make({products:catalog,cart:sourceCart}).order;
 assert.equal(snapshot.items[0].name,'Boxy Fit Black');assert.equal(snapshot.items[0].unitPriceCents,11990);assert.equal(snapshot.items[0].qty,1);
 assert.equal(later.items[0].name,'Changed catalog');assert.equal(later.items[0].unitPriceCents,1);assert.equal(later.items[0].qty,2);
 assert.equal(snapshot.totals.totalCents,30772);
 assert.deepEqual(Object.keys(first),['id','createdAt','items','totals','shippingId','paymentId','destination','stage']);assert.equal(first.destination.city,'Cidade Demo / BR');
 assert.match(orderDate('2026-10-30T01:00:00.000Z'),/29\/10\/2026/);
});
test('saved order snapshots round trip without depending on future catalog data and reject corruption',()=>{
 const order=make().order,stored=JSON.parse(JSON.stringify(order));
 assert.deepEqual(cleanOrders([stored]),[order]);assert.deepEqual(cleanOrders([stored,stored]),[order]);
 for(const changed of [{...stored,id:'real-order'},{...stored,createdAt:'bad'},{...stored,stage:99},{...stored,paymentId:'bad'},{...stored,items:[]},{...stored,totals:{...stored.totals,totalCents:1}},{...stored,items:[{...stored.items[0],image:'https://example.com/pixel.png'}]}])assert.deepEqual(cleanOrders([changed]),[]);
 const extra={...stored,password:'not-allowed',destination:{street:'real address'},items:stored.items.map(item=>({...item,cpf:'not-allowed'}))};
 const sanitized=cleanOrders([extra])[0];assert.ok(!('password' in sanitized));assert.ok(!('cpf' in sanitized.items[0]));assert.equal(sanitized.destination.street,'Rua Imaginação, 001');
 assert.deepEqual(cleanOrders(null),[]);
});
test('manual fictional progress caps at delivered and never mutates the original order or amounts',()=>{
 const first=make().order;let next=first;
 for(let i=1;i<=3;i++){next=advanceOrder(next);assert.equal(next.stage,i);assert.equal(next.totals,first.totals);assert.equal(next.items,first.items)}
 assert.equal(first.stage,0);assert.equal(advanceOrder(next),next);assert.equal(orderStages[next.stage],'Entregue ficticiamente');
});
