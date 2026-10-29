import test from 'node:test';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createCampaignMiddleware,campaignSyncPlugin} from '../scripts/campaign-server.js';
import {defaultCampaign} from '../src/lib/admin/campaign.js';
import {createCampaignSync} from '../src/lib/campaignSync.js';
async function setup(t){const dir=await mkdtemp(join(tmpdir(),'lt-campaign-'));t.after(()=>rm(dir,{recursive:true,force:true}));const file=join(dir,'campaign.json');return {file,handler:createCampaignMiddleware(file)}}
async function call(handler,{method='GET',value,body,headers={}}={}){
 const req=Readable.from(body!==undefined?(Array.isArray(body)?body:[body]):value?[JSON.stringify(value)]:[]);req.url='/';req.method=method;req.headers={host:'localhost:3000',...(method==='PUT'?{'content-type':'application/json',origin:'http://localhost:3000'}:{}),...headers};
 const res={headers:{},headersSent:false,setHeader(key,value){this.headers[key]=value},writeHead(status,headers){this.status=status;this.headers={...this.headers,...headers};this.headersSent=true},end(body){this.body=JSON.parse(body)}};
 await handler(req,res,()=>res.writeHead(404,{}));return {status:res.status,data:res.body,headers:res.headers};
}
test('campaign server starts empty, without replacing a browser campaign with defaults',async t=>{
 const {handler}=await setup(t);const response=await call(handler);assert.equal(response.status,200);assert.deepEqual(response.data,{revision:0,campaign:null,updatedAt:null});assert.equal(response.headers['Cache-Control'],'no-store');
});
test('validated campaign persists across server instances and strips unrelated entities',async t=>{
 const {handler,file}=await setup(t);const campaign={...defaultCampaign,title:'COMPARTILHADA.',orders:['not stored'],customer:'not stored'};
 const saved=await call(handler,{method:'PUT',value:{campaign}});assert.equal(saved.status,200);assert.equal(saved.data.revision,1);assert.ok(!('orders' in saved.data.campaign));
 const other=createCampaignMiddleware(file),read=await call(other);assert.equal(read.data.campaign.title,'COMPARTILHADA.');const raw=JSON.parse(await readFile(file,'utf8'));assert.deepEqual(Object.keys(raw),['revision','updatedAt','campaign']);assert.ok(!('customer' in raw.campaign));
});
test('first migration cannot overwrite a campaign already shared by another device',async t=>{
 const {handler}=await setup(t);await call(handler,{method:'PUT',value:{campaign:{...defaultCampaign,title:'ATUAL.'}}});
 const response=await call(handler,{method:'PUT',value:{initialize:true,campaign:{...defaultCampaign,title:'ANTIGA.'}}});assert.equal(response.status,409);assert.equal(response.data.campaign.title,'ATUAL.');assert.equal((await call(handler)).data.revision,1);
});
test('invalid payloads, external links, unsupported methods, foreign origin and oversized bodies do not write',async t=>{
 const {handler}=await setup(t);
 for(const campaign of [{...defaultCampaign,buttonLink:'https://external.test'},{...defaultCampaign,image:'/missing.png'},{...defaultCampaign,title:''}])assert.equal((await call(handler,{method:'PUT',value:{campaign}})).status,400);
 assert.equal((await call(handler,{method:'PUT',body:'{bad'})).status,400);
 assert.equal((await call(handler,{method:'POST',value:{campaign:defaultCampaign}})).status,405);
 assert.equal((await call(handler,{method:'PUT',value:{campaign:defaultCampaign},headers:{origin:'https://another.test'}})).status,403);
 assert.equal((await call(handler,{method:'PUT',value:{campaign:defaultCampaign},headers:{'content-type':'text/plain'}})).status,415);
 assert.equal((await call(handler,{method:'PUT',body:'x'.repeat(16001)})).status,413);assert.equal((await call(handler)).data.revision,0);
});
test('concurrent writes remain whole, ordered revisions rather than partial JSON',async t=>{
 const {handler,file}=await setup(t);const writes=await Promise.all(['UM.','DOIS.','TRÊS.'].map(title=>call(handler,{method:'PUT',value:{campaign:{...defaultCampaign,title}}})));
 assert.deepEqual(writes.map(r=>r.data.revision).sort(),[1,2,3]);const saved=JSON.parse(await readFile(file,'utf8'));assert.equal(saved.revision,3);assert.ok(['UM.','DOIS.','TRÊS.'].includes(saved.campaign.title));
});
const settle=async predicate=>{for(let i=0;i<200&&!predicate();i++)await new Promise(resolve=>setTimeout(resolve,5));assert.ok(predicate())};
function bridge(handler){return async(url,options={})=>{const response=await call(handler,{method:options.method||'GET',body:options.body});return new Response(JSON.stringify(response.data),{status:response.status,headers:{'content-type':'application/json'}})}}
test('client automatically migrates an edited local campaign and another isolated client receives it',async t=>{
 const {handler}=await setup(t);let local={...defaultCampaign,title:'CAMPANHA DO COMPUTADOR.'},phone={...defaultCampaign},state;
 const desktop=createCampaignSync({getCampaign:()=>local,onCampaign:value=>local=value,onStatus:value=>state=value,fetcher:bridge(handler)});t.after(()=>desktop.stop());await desktop.poll();await settle(()=>state?.state==='synced');
 const mobile=createCampaignSync({getCampaign:()=>phone,onCampaign:value=>phone=value,onStatus:()=>{},fetcher:bridge(handler)});t.after(()=>mobile.stop());await mobile.poll();assert.equal(phone.title,local.title);
 local={...local,title:'NOVA CAMPANHA.'};desktop.publish(local);await settle(()=>state.state==='synced');await mobile.poll();assert.equal(phone.title,'NOVA CAMPANHA.');
});
test('client retains failed edits, retries after connectivity returns and never changes other local data',async t=>{
 const {handler}=await setup(t);let offline=true,status,local={...defaultCampaign,title:'EDIÇÃO OFFLINE.'};const fetcher=async(...args)=>{if(offline)throw Error('offline');return bridge(handler)(...args)};
 const client=createCampaignSync({getCampaign:()=>local,onCampaign:c=>local=c,onStatus:s=>status=s,fetcher});t.after(()=>client.stop());client.publish(local);await settle(()=>status?.state==='offline');assert.equal(local.title,'EDIÇÃO OFFLINE.');offline=false;await client.poll();await settle(()=>status?.state==='synced');assert.equal((await call(handler)).data.campaign.title,'EDIÇÃO OFFLINE.');
});
test('Vite hooks install middleware without accidentally returning a post-hook handler',()=>{
 const plugin=campaignSyncPlugin(),registered=[];const server={config:{root:'/tmp'},middlewares:{use:(...args)=>{registered.push(args);return ()=>{throw Error('must not become a Vite hook')}}}};
 assert.equal(plugin.configureServer(server),undefined);assert.equal(plugin.configurePreviewServer(server),undefined);assert.equal(registered.length,2);assert.equal(registered[0][0],'/api/demo/campaign');
});

test('Portuguese accents survive UTF-8 sequences split across network chunks',async t=>{
 const {handler}=await setup(t),title='LINHA TÊNUE — UMA EXPRESSÃO.';
 const bytes=Buffer.from(JSON.stringify({campaign:{...defaultCampaign,title}}));const split=bytes.indexOf(Buffer.from('Ê'))+1;
 const response=await call(handler,{method:'PUT',body:[bytes.subarray(0,split),bytes.subarray(split)]});assert.equal(response.status,200);assert.equal(response.data.campaign.title,title);
});
