import {products as originals} from '../../data.js';
import {slugify} from '../catalog.js';
export const categoryNames=[...new Set(originals.map(p=>p.category))];
export const colorNames=['Preto','Off-white','Azul','Grafite'];
export const imageAssets=[...new Set(originals.flatMap(p=>[p.detailImage,...Object.values(p.images).flat().map(image=>image.src)]))];
export function imageForColor(src,color){const suffix={Preto:'black','Off-white':'offwhite',Azul:'cobalt',Grafite:'graphite'}[color];const candidate=src.replace(/-(black|offwhite|cobalt|graphite)\.png$/,`-${suffix}.png`);return imageAssets.includes(candidate)?candidate:src}
export const campaignAssets=['/images/street/hero.png','/images/street/core-tones.png','/images/street/blue-cropped.png','/images/street/graphite.png','/images/street/blueprint.png','/images/street/study.png'];
export const toCents=value=>{const text=String(value??'').trim().replace(',','.');return /^\d+(\.\d{1,2})?$/.test(text)?Math.round(Number(text)*100):NaN};
export const productStock=product=>product.variants.reduce((sum,v)=>sum+v.stock,0);
export const initialProducts=()=>originals.map(p=>({...structuredClone(p),sku:`LT-${String(p.id).padStart(5,'0')}`,basePrice:p.price,promotionalPrice:null,status:'active',featured:false,isNew:Boolean(p.tag?.includes('NOV'))}));
export function productDraft(product){
 if(product)return {...structuredClone(product),price:String(product.basePrice??product.price),promotionalPrice:product.promotionalPrice??'',tags:product.tags.join(', '),frontImage:product.detailImage,finishImage:product.images[product.color][1]?.src||product.detailImage};
 return {name:'',slug:'',sku:'',category:'Camisetas Boxy',line:'Boxy Fit',audience:'Unissex',shortDescription:'',description:'',price:'',promotionalPrice:'',colors:['Preto'],sizes:['P','M','G','GG'],variants:['P','M','G','GG'].map(size=>({color:'Preto',size,stock:10})),frontImage:'/images/products/axis-fit-black.png',finishImage:'/images/v2/cotton-black.png',tags:'LT Axis',featured:false,isNew:true,status:'active'};
}
export function buildProduct(draft,existing,allProducts,nextId){
 const name=String(draft.name||'').trim(),slug=String(draft.slug||slugify(name)).trim(),sku=String(draft.sku||'').trim().toUpperCase();
 const baseCents=toCents(draft.price),promo=draft.promotionalPrice===''||draft.promotionalPrice==null?null:toCents(draft.promotionalPrice);
 if(name.length<3||name.length>100||!/^[-a-z0-9]+$/.test(slug)||slug.length>100||!/^[-A-Z0-9]{3,40}$/.test(sku))return {error:'Preencha nome, slug (letras minúsculas e hífens) e SKU válido.'};
 if(allProducts.some(p=>p.id!==existing?.id&&(p.slug===slug||p.sku===sku)))return {error:'Slug ou SKU já utilizado por outra peça.'};
 if(!Number.isSafeInteger(baseCents)||baseCents<=0||baseCents>10000000||promo!==null&&(!Number.isSafeInteger(promo)||promo<=0||promo>=baseCents))return {error:'Informe preço positivo com até duas casas. O promocional deve ser menor que o preço original.'};
 if(!categoryNames.includes(draft.category)||!['Unissex','Feminino'].includes(draft.audience))return {error:'Selecione categoria e público válidos.'};
 const colors=[...new Set(draft.colors)],sizes=[...new Set(draft.sizes)];
 const kind=draft.category==='Calças Baggy'?'pants':'tee';
 if(!colors.length||colors.some(c=>!colorNames.includes(c))||!sizes.length||sizes.some(size=>kind==='pants'?!/^(3[0-9]|4[0-9]|5[0-9]|60)$/.test(size):!['P','M','G','GG'].includes(size)))return {error:'Selecione cores e tamanhos coerentes. Calças usam grade numérica.'};
 if(!imageAssets.includes(draft.frontImage)||!imageAssets.includes(draft.finishImage))return {error:'Selecione imagens locais disponíveis.'};
 if(!String(draft.description||'').trim()||!String(draft.shortDescription||'').trim())return {error:'Preencha as descrições curta e completa.'};
 const id=existing?.id||nextId||Math.max(0,...allProducts.map(p=>p.id))+1;
 const changedImage=!existing||draft.frontImage!==existing.detailImage;
 const images=Object.fromEntries(colors.map(color=>[color,[{src:changedImage?imageForColor(draft.frontImage,color):existing.images[color]?.[0]?.src||imageForColor(draft.frontImage,color),alt:`${name} — ${color}, vista frontal`,label:'Frente'},{src:existing&&draft.finishImage===existing.images[existing.color]?.[1]?.src?existing.images[color]?.[1]?.src||imageForColor(draft.finishImage,color):imageForColor(draft.finishImage,color),alt:`Detalhe ilustrativo do tecido ${color} e acabamento LT Axis`,label:'Acabamento'},...(!changedImage?(existing?.images[color]?.slice(2)||[]):[])]]));
 const variants=[];
 for(const color of colors)for(const size of sizes){const row=draft.variants.find(v=>v.color===color&&v.size===size);const stock=Number(row?.stock);if(!Number.isInteger(stock)||stock<0||stock>10000)return {error:'Todas as variantes precisam de estoque inteiro entre 0 e 10.000.'};variants.push({id:`${id}-${slugify(color)}-${size}`,color,size,stock,image:images[color][0].src})}
 const tags=String(draft.tags||'').split(',').map(t=>t.trim()).filter(Boolean).slice(0,15);
 const fit=kind==='pants'?'Baggy':draft.line==='Feminino'?'Boxy Cropped':'Boxy Fit';
 return {product:{...existing,id,name,slug,sku,category:draft.category,categorySlug:slugify(draft.category),line:String(draft.line||'Original').slice(0,60),audience:draft.audience,kind,fit:existing?.kind===kind?existing.fit:fit,color:colors[0],colors,sizes,variants,images,detailImage:images[colors[0]][0].src,price:(promo??baseCents)/100,basePrice:baseCents/100,promotionalPrice:promo===null?null:promo/100,description:String(draft.description).trim().slice(0,2000),shortDescription:String(draft.shortDescription).trim().slice(0,200),tags,tag:draft.isNew?(existing?.isNew&&existing.tag?existing.tag:'NOVO'):(existing?.isNew&&existing.tag?.includes('NOV')?'':existing?.tag||''),featured:Boolean(draft.featured),isNew:Boolean(draft.isNew),status:draft.status==='hidden'?'hidden':'active',releasedAt:existing?.releasedAt||new Date().toISOString().slice(0,10),stockIsMock:true,measurements:sizes.map((size,i)=>existing?.kind===kind&&existing.measurements?.find(m=>m.size===size)||({size,width:kind==='pants'?Number(size):52+i*2,length:kind==='pants'?104:62+i*2,hip:kind==='pants'?Number(size)+12:undefined})),details:existing?.details||['Peça conceitual com identidade LT Axis','Modelagem e acabamento ilustrativos'],care:existing?.care||['Lavar do avesso em água fria.','Secar à sombra.']}};
}
export function cleanProducts(value){
 if(!Array.isArray(value))return null;
 const result=[],ids=new Set();
 for(const raw of value){
  if(!raw||!Number.isSafeInteger(raw.id)||raw.id<1||ids.has(raw.id)||!Array.isArray(raw.colors)||!Array.isArray(raw.sizes)||!Array.isArray(raw.variants)||!raw.images||!Array.isArray(raw.tags))return null;
  if(raw.colors.some(color=>!Array.isArray(raw.images[color])||raw.images[color].some(image=>!image||!imageAssets.includes(image.src)||typeof image.alt!=='string'||typeof image.label!=='string'))||!Array.isArray(raw.measurements)||raw.measurements.some(m=>!m||typeof m.size!=='string'||!Number.isFinite(m.width)||!Number.isFinite(m.length)))return null;
  try{const built=buildProduct(productDraft(raw),raw,result);if(built.error)return null;result.push({...built.product,measurements:Array.isArray(raw.measurements)?raw.measurements:built.product.measurements,details:Array.isArray(raw.details)?raw.details.filter(v=>typeof v==='string').slice(0,30):[],care:Array.isArray(raw.care)?raw.care.filter(v=>typeof v==='string').slice(0,30):[]});ids.add(raw.id)}catch{return null}
 }
 return result;
}
