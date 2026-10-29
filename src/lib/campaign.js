import {products} from '../data.js';
export const streetImages={
 hero:'/images/street/hero.png',
 core:'/images/street/core-tones.png',
 blue:'/images/street/blue-cropped.png',
 graphite:'/images/street/graphite.png',
 blueprint:'/images/street/blueprint.png',
 study:'/images/street/study.png',
};
export const campaignOutfits={
 [streetImages.hero]:{
  masculino:{x:.62,description:'Boxy Fit Black e Baggy Washed Denim.'},
  feminino:{x:.83,description:'Boxy Cropped Off-White e Wide Leg High-Waist.'}
 },
 [streetImages.core]:{
  masculino:{x:.30,description:'Boxy Fit Off-White e denim claro.'},
  feminino:{x:.70,description:'Baby Tee Cobalt e Wide Leg High-Waist.'}
 },
 [streetImages.blue]:{
  masculino:{x:.33,description:'Boxy Fit Cobalt e Baggy Washed Denim.'},
  feminino:{x:.59,description:'Boxy Cropped Black e Wide Leg High-Waist.'}
 }
};
export function campaignStory(product,color=product?.color){
 if(product?.id===17)return {image:streetImages.blueprint,code:'ART EDITION / 017',title:'FORMA QUE VIRA EXPRESSÃO.',alt:'Boxy Axis Blueprint em uso, com estampa arquitetônica azul',copy:'O desenho de construção do LT Axis sai do papel e ganha a rua.'};
 if(product?.id===18)return {image:streetImages.study,code:'ART EDITION / 018',title:'O IMPACTO ESTÁ NO DETALHE.',alt:'Boxy Axis Study em uso, com estampa tonal e eixo azul',copy:'Uma nova leitura do básico. Linhas sutis, presença que permanece.'};
 const image=color==='Grafite'?streetImages.graphite:color==='Azul'?(product?.audience==='Feminino'&&product?.kind==='tee'?streetImages.core:streetImages.blue):color==='Preto'&&product?.audience==='Feminino'?streetImages.blue:color==='Off-white'&&product?.audience!=='Feminino'?streetImages.core:streetImages.hero;
 return {image,code:'STREET CAMPAIGN / 001',title:product?.kind==='pants'?'LIBERDADE EM CADA MOVIMENTO.':'O CAIMENTO MUDA A PERSPECTIVA.',alt:`Editorial da coleção ${product?.fit||'Linha Tênue'}, com símbolo LT Axis`,copy:'Peças para ocupar o seu espaço. Forma, movimento e identidade em uma mesma frequência.'};
}
export function completeLookProducts(product,catalog=products){
 return catalog.filter(p=>p.id!==product.id&&p.audience===product.audience&&p.kind!==product.kind&&p.variants.some(v=>v.stock>0))
  .sort((a,b)=>Number(b.line==='Boxy Fit')-Number(a.line==='Boxy Fit')||a.id-b.id).slice(0,3);
}
