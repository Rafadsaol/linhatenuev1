import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {products} from '../src/data.js';
import {campaignStory,completeLookProducts,streetImages} from '../src/lib/campaign.js';
test('complete the look suggests available complementary pieces for the same collection without changing the catalog',()=>{
 const before=JSON.stringify(products);
 assert.deepEqual(completeLookProducts(products.find(p=>p.id===13)).map(p=>p.id),[16]);
 assert.deepEqual(completeLookProducts(products.find(p=>p.id===1)).map(p=>p.id),[5,6]);
 for(const p of products)for(const related of completeLookProducts(p)){
  assert.notEqual(related.id,p.id);assert.notEqual(related.kind,p.kind);assert.equal(related.audience,p.audience);assert.ok(related.variants.some(v=>v.stock>0));
 }
 assert.equal(JSON.stringify(products),before);
});
test('campaign photos exist for every product, color and art edition',()=>{
 for(const path of Object.values(streetImages))assert.ok(existsSync(new URL(`../public${path}`,import.meta.url)),path);
 for(const p of products)for(const color of p.colors){const story=campaignStory(p,color);assert.ok(story.title.length>10&&story.alt.length>10);assert.ok(existsSync(new URL(`../public${story.image}`,import.meta.url)))}
 assert.equal(campaignStory(products.find(p=>p.id===17)).image,streetImages.blueprint);
 assert.equal(campaignStory(products.find(p=>p.id===18)).image,streetImages.study);
});
