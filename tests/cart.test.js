import test from 'node:test';
import assert from 'node:assert/strict';
import {products} from '../src/data.js';
import {addCartItem,cleanCart,safeRead,subtotalCents} from '../src/lib/cart.js';
const tee=products.find(p=>p.id===9);
test('adding the same variant merges quantity while colors and sizes remain separate',()=>{
 let cart=addCartItem([],tee,'Preto','P',1).cart;
 cart=addCartItem(cart,tee,'Preto','P',1).cart;
 cart=addCartItem(cart,tee,'Off-white','P',1).cart;
 cart=addCartItem(cart,tee,'Preto','M',1).cart;
 assert.equal(cart.length,3);assert.equal(cart[0].qty,2);assert.equal(subtotalCents(cart,products),47960);
});
test('out-of-stock, missing selections, fractions and quantities over stock are rejected without mutation',()=>{
 const empty=[];
 assert.ok(addCartItem(empty,tee,'Preto','',1).error);
 assert.ok(addCartItem(empty,products.find(p=>p.id===11),'Azul','GG',1).error);
 assert.ok(addCartItem(empty,tee,'Preto','P',99).error);
 assert.ok(addCartItem(empty,tee,'Preto','P',1.5).error);
 const full=addCartItem([],tee,'Preto','P',4).cart;const before=JSON.stringify(full);
 assert.ok(addCartItem(full,tee,'Preto','P',1).error);assert.equal(JSON.stringify(full),before);assert.deepEqual(empty,[]);
});
test('legacy V1 pants sizes migrate to numeric sizes and duplicated persisted variants are capped',()=>{
 const migrated=cleanCart([{id:5,color:'Azul',size:'M',qty:2},{id:5,color:'Azul',size:'M',qty:99}],products);
 assert.equal(migrated.length,1);assert.equal(migrated[0].size,'38');assert.equal(migrated[0].qty,8);
});
test('corrupt, stale, unavailable and malformed persisted cart entries do not crash or create invalid lines',()=>{
 assert.deepEqual(cleanCart({},products),[]);
 assert.deepEqual(cleanCart([null,{id:999,color:'Preto',size:'P',qty:1},{id:4,color:'Preto',size:'M',qty:1},{id:9,color:'not real',size:'P',qty:1},{id:9,color:'Preto',size:'P',qty:-2},{id:9,color:'Preto',size:'P',qty:Infinity}],products),[]);
 assert.deepEqual(safeRead({getItem:()=>'{bad'},'lt-cart',[]),[]);
 assert.deepEqual(safeRead({getItem:()=>{throw Error('blocked')}},'lt-cart',[]),[]);
});
test('subtotal uses integer cents and follows the variant quantity',()=>{
 const cart=[{id:1,color:'Preto',size:'P',qty:3},{id:2,color:'Off-white',size:'P',qty:1}];
 assert.equal(subtotalCents(cart,products),45960);
});
