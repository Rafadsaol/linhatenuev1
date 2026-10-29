import {defaultCampaign,validateCampaign} from './admin/campaign.js';
const key=campaign=>JSON.stringify(validateCampaign(campaign).campaign);
export function createCampaignSync({getCampaign,onCampaign,onStatus,fetcher=fetch}){
 let stopped=false,busy=false,reading=false,pending=null,revision=0,unavailable=false;
 const status=(state,message)=>{if(!stopped)onStatus({state,message})};
 async function request(options){
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),5000);
  try{const response=await fetcher('/api/demo/campaign',{cache:'no-store',...options,signal:controller.signal});
   if(response.status===404||response.headers.get('content-type')?.includes('text/html')){unavailable=true;throw Error('unavailable')}
   const data=await response.json();if(!response.ok&&response.status!==409)throw Error(data.error||'Não foi possível sincronizar.');
   if(!Number.isSafeInteger(data.revision)||data.revision<0||data.campaign&&validateCampaign(data.campaign).error)throw Error('Resposta de campanha inválida.');return {data,conflict:response.status===409};
  }finally{clearTimeout(timeout)}
 }
 const accept=data=>{revision=data.revision;if(data.campaign&&key(getCampaign())!==key(data.campaign))onCampaign(data.campaign)};
 async function drain(){
  if(stopped||busy||!pending)return;busy=true;const active=pending;pending=null;let succeeded=false;
  status('saving','Sincronizando campanha com os dispositivos conectados…');
  try{const {data,conflict}=await request({method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(active)});if(stopped)return;
   revision=data.revision;if(!pending){if(conflict||key(getCampaign())===key(active.campaign))accept(data);status('synced','Campanha sincronizada com os dispositivos conectados.')}succeeded=true;
  }catch{pending=pending||active;status(unavailable?'unavailable':'offline',unavailable?'Campanha salva neste navegador. Inicie o servidor do projeto para compartilhar com o celular.':'Campanha salva neste navegador. A sincronização será tentada novamente quando o servidor responder.');}
  finally{busy=false;if(succeeded&&pending&&!stopped)queueMicrotask(drain)}
 }
 function publish(campaign,{initialize=false}={}){const checked=validateCampaign(campaign);if(checked.error)return;pending={campaign:checked.campaign,initialize};unavailable=false;void drain()}
 async function poll(){
  if(stopped||reading||busy)return;if(pending){if(!unavailable)void drain();return}if(unavailable)return;reading=true;
  try{const {data}=await request();if(stopped||busy||pending)return;
   if(data.campaign){if(data.revision>=revision)accept(data);status('synced','Campanha sincronizada com os dispositivos conectados.');}
   else if(key(getCampaign())!==key(defaultCampaign))publish(getCampaign(),{initialize:true});
   else status('ready','Servidor conectado. Salve a campanha para compartilhá-la com os outros dispositivos.');
  }catch{status(unavailable?'unavailable':'offline',unavailable?'Compartilhamento disponível com o servidor do projeto (npm run dev ou npm run preview).':'Servidor de campanha indisponível. Sua vitrine local continua disponível.');}finally{reading=false}
 }
 return {publish,poll,stop:()=>{stopped=true}};
}
