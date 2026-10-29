import {readFile,mkdir,writeFile,rename} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {validateCampaign} from '../src/lib/admin/campaign.js';
const json=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value))};
export function createCampaignMiddleware(file){
 let writes=Promise.resolve();
 async function read(){try{const value=JSON.parse(await readFile(file,'utf8'));const checked=validateCampaign(value.campaign);if(checked.error||!Number.isSafeInteger(value.revision)||value.revision<1)throw Error('Documento compartilhado inválido.');return {revision:value.revision,updatedAt:value.updatedAt,campaign:checked.campaign}}catch(error){if(error.code==='ENOENT')return {revision:0,campaign:null,updatedAt:null};throw error}}
 return async function campaignMiddleware(req,res,next){
  if(!['','/'].includes(req.url.split('?')[0]))return next();
  if(req.method==='GET'){try{return json(res,200,await read())}catch{return json(res,500,{error:'Não foi possível ler a campanha compartilhada.'})}}
  if(req.method!=='PUT'){res.setHeader('Allow','GET, PUT');return json(res,405,{error:'Método não permitido.'})}
  try{if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return json(res,403,{error:'Origem não permitida.'})}catch{return json(res,403,{error:'Origem inválida.'})}
  if(!req.headers['content-type']?.startsWith('application/json'))return json(res,415,{error:'Envie uma campanha em JSON.'});
  const chunks=[];let bytes=0;try{for await(const chunk of req){const buffer=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);bytes+=buffer.length;if(bytes>16000)return json(res,413,{error:'Campanha acima do limite de tamanho.'});chunks.push(buffer)}}catch{return json(res,400,{error:'Não foi possível receber a campanha.'})}
  const body=Buffer.concat(chunks).toString('utf8');
  let value;try{value=JSON.parse(body)}catch{return json(res,400,{error:'JSON inválido.'})}
  const checked=validateCampaign(value?.campaign);if(checked.error)return json(res,400,{error:checked.error});
  const operation=writes.then(async()=>{
   let current;try{current=await read()}catch{return json(res,500,{error:'Revise o arquivo de campanha compartilhada antes de salvar.'})}
   if(value.initialize&&current.revision)return json(res,409,current);
   const saved={revision:current.revision+1,updatedAt:new Date().toISOString(),campaign:checked.campaign};
   await mkdir(dirname(file),{recursive:true});await writeFile(file+'.tmp',JSON.stringify(saved,null,2),'utf8');await rename(file+'.tmp',file);return json(res,200,saved);
  });
  writes=operation.catch(()=>{});try{await operation}catch{if(!res.headersSent)json(res,500,{error:'Não foi possível salvar a campanha compartilhada.'})}
 };
}
export function campaignSyncPlugin(){
 const attach=server=>{server.middlewares.use('/api/demo/campaign',createCampaignMiddleware(resolve(server.config.root,'.linha-tenue/campaign.json')))};
 return {name:'linha-tenue-campaign-sync',configureServer:attach,configurePreviewServer:attach};
}
