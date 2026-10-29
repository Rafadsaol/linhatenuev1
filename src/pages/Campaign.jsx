import React from 'react';
import {ArrowUpRight} from 'lucide-react';
import {products} from '../data';
import {productHref} from '../lib/catalog';
import {streetImages} from '../lib/campaign';
import CampaignLabel from '../components/CampaignLabel';
import CampaignEditorial from '../components/CampaignEditorial';
import Lookbook from '../components/Lookbook';
import {BrandMark} from '../components/BrandLogo';
const scenes=[
 {code:'02',image:streetImages.core,title:'O ESSENCIAL TEM PRESENÇA.',copy:'Tons que contrastam. Silhuetas que se encontram. O básico é só o começo.',ids:[10,15]},
 {code:'03',image:streetImages.blue,title:'COR É POSICIONAMENTO.',copy:'Uma assinatura elétrica para quem prefere abrir o próprio caminho.',ids:[11,14]},
 {code:'04',image:streetImages.graphite,title:'O SILÊNCIO TAMBÉM EXPRESSA.',copy:'Textura, proporção e tons de concreto. O contraste aparece nos detalhes.',ids:[12,6]},
];
export default function Campaign(){return <main className="campaign-page"><section className="campaign-page-intro"><CampaignLabel code="COLLECTION / 001">LINHA TÊNUE — STREET CAMPAIGN</CampaignLabel><div><h1>A RUA COMO<br/>PONTO DE PARTIDA.</h1><p>A linha entre o comum e o extraordinário não é um lugar. É uma maneira de olhar. Esta é a nossa.</p><BrandMark/></div></section><CampaignEditorial image={streetImages.hero} code="FRAME 01 / THE FIRST LINE" title="SEM PADRÃO. SEM LIMITES." copy="Uma coleção sobre contraste, movimento e a liberdade de ocupar o próprio espaço." href="#/loja" cta="Shop the Drop"/>{scenes.map(scene=><section className="campaign-scene" key={scene.code}><div className="campaign-scene-image"><img src={scene.image} alt={`Editorial Linha Tênue: ${scene.title.toLowerCase()}`} width="1536" height="1024" loading="lazy"/><span>FRAME / {scene.code}</span></div><div className="campaign-scene-copy"><CampaignLabel code={`SCENE / ${scene.code}`}>STREET CAMPAIGN</CampaignLabel><h2>{scene.title}</h2><p>{scene.copy}</p><div className="campaign-scene-pieces">{scene.ids.map(id=>{const p=products.find(p=>p.id===id);return <a key={id} href={'#'+productHref(p)}>{p.name}<ArrowUpRight size={17}/></a>})}</div></div></section>)}<Lookbook/></main>}
