import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {products} from '../src/data.js';
import {defaultFilters,filtersHref,parseFilters,selectProducts,getVariant} from '../src/lib/catalog.js';
const filter=patch=>selectProducts(products,{...defaultFilters,...patch});
test('existing products remain and every garment has valid variants and local photographs',()=>{
 assert.equal(products.length,18);
 assert.deepEqual(products.slice(0,8).map(p=>p.name),['Boxy Distortion','Essential Off-White','Boxy Blue Frequency','Boxy Shadow','Baggy Washed Denim','Baggy Graphite','Essential Black','Boxy Abstract Lines']);
 assert.equal(new Set(products.map(p=>p.slug)).size,products.length);
 for(const p of products){
  assert.ok(p.description.length>30&&p.shortDescription.length>10&&p.tags.length>0&&p.stockIsMock);
  assert.ok(p.kind==='pants'?p.sizes.every(s=>/^\d+$/.test(s)):p.sizes.every(s=>['P','M','G','GG'].includes(s)));
  assert.equal(p.variants.length,p.sizes.length*p.colors.length);
  for(const images of Object.values(p.images))for(const image of images)assert.ok(existsSync(new URL(`../public${image.src}`,import.meta.url)),image.src);
 }
});
test('combined collection, category, available size, color and price filters select the intended women tee',()=>{
 assert.deepEqual(filter({audience:'Feminino',category:'camisetas-boxy',size:'M',color:'Off-white',min:'100',max:'115'}).map(p=>p.id).sort((a,b)=>a-b),[13,14]);
 assert.deepEqual(filter({audience:'Feminino',size:'34'}).map(p=>p.id),[16]);
 assert.ok(filter({size:'M'}).every(p=>p.kind==='tee'));
});
test('availability is checked for the selected color and size together, including sold-out pieces',()=>{
 assert.equal(getVariant(products.find(p=>p.id===11),'Azul','GG').stock,0);
 assert.ok(!filter({color:'Azul',size:'GG'}).some(p=>p.id===11));
 assert.ok(!filter({size:'P'}).some(p=>p.id===4));
 assert.ok(filter({}).some(p=>p.id===4));
});
test('search includes accent-insensitive descriptions, categories and tags',()=>{
 assert.ok(filter({q:'cintura alta'}).some(p=>p.id===16));
 assert.ok(filter({q:'calcas baggy'}).every(p=>p.kind==='pants'));
 assert.deepEqual(filter({q:'estampada'}).map(p=>p.id).sort((a,b)=>a-b),[17,18]);
 assert.equal(filter({q:'peca que nao existe 000'}).length,0);
 assert.equal(filter({min:'250',max:'10'}).length,0);
});
test('price, name and release sort orders are stable and meaningful',()=>{
 const cheap=filter({sort:'menor-preco'});assert.equal(cheap[0].id,15);assert.equal(cheap.at(-1).id,16);
 assert.equal(filter({sort:'maior-preco'})[0].id,16);
 const named=filter({sort:'nome'}).map(p=>p.name);assert.deepEqual(named,[...named].sort((a,b)=>a.localeCompare(b,'pt-BR')));
 assert.deepEqual(filter({}).slice(0,2).map(p=>p.id),[18,17]);
});
test('shareable URLs round trip search and combined filters, with a category path',()=>{
 const filters={...defaultFilters,q:'símbolo LT',category:'camisetas-boxy',audience:'Feminino',size:'M',color:'Off-white',min:'99.9',max:'150',sort:'menor-preco'};
 const href=filtersHref(filters,'/loja/camisetas-boxy');const url=new URL(href,'https://example.test');
 assert.deepEqual(parseFilters(url.search,url.pathname),filters);
 assert.equal(url.searchParams.get('categoria'),null);
 assert.equal(parseFilters('?min=-5&max=invalid&ordenar=unknown').min,'');
 assert.equal(parseFilters('?min=-5&max=invalid&ordenar=unknown').sort,'novidades');
});
