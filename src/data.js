import {slugify} from './lib/catalog.js';
export const campaign='/images/axis/campaign.png';
export const lifestyle='/images/axis/lifestyle.png';
const originalProducts=[
{id:1,name:'Boxy Distortion',price:119.9,category:'Camisetas Boxy',color:'Preto',tag:'BEST SELLER'},
{id:2,name:'Essential Off-White',price:99.9,category:'Essentials',color:'Off-white',tag:'ESSENTIAL'},
{id:3,name:'Boxy Blue Frequency',price:129.9,category:'Camisetas Boxy',color:'Azul',tag:'NOVO DROP'},
{id:4,name:'Boxy Shadow',price:129.9,category:'Camisetas Boxy',color:'Preto',tag:'LIMITADO'},
{id:5,name:'Baggy Washed Denim',price:199.9,category:'Calças Baggy',color:'Azul'},
{id:6,name:'Baggy Graphite',price:199.9,category:'Calças Baggy',color:'Grafite'},
{id:7,name:'Essential Black',price:99.9,category:'Essentials',color:'Preto'},
{id:8,name:'Boxy Abstract Lines',price:129.9,category:'Camisetas Boxy',color:'Off-white'}
];
export const fitEditorial='/images/axis/fit-editorial.png';
const sizes=['P','M','G','GG'];
const makeMeasures=(width,length)=>sizes.map((size,i)=>({size,width:width+i*2,length:length+i*2}));
const newProducts=[
 {id:9,name:'Boxy Fit Black',price:119.9,color:'Preto'},
 {id:10,name:'Boxy Fit Off-White',price:119.9,color:'Off-white'},
 {id:11,name:'Boxy Fit Cobalt',price:129.9,color:'Azul'},
 {id:12,name:'Boxy Fit Graphite',price:129.9,color:'Grafite'},
].map(p=>({...p,category:'Camisetas Boxy',audience:'Unissex',line:'Boxy Fit',fit:'Boxy Fit',tag:'NOVO FIT',sizes,measurements:makeMeasures(52,62),description:'Ombros levemente deslocados, mangas mais curtas e volume equilibrado no tronco. O corte reto e o comprimento no alto do quadril preservam o formato boxy, com um encaixe mais próximo ao corpo. Algodão encorpado e símbolo LT Axis discreto no peito.'}));
const womenProducts=[
 {id:13,name:'Boxy Cropped Off-White',price:109.9,color:'Off-white',category:'Camisetas Boxy',fit:'Boxy Cropped',measurements:makeMeasures(48,44),description:'Silhueta boxy compacta, ombros suaves e barra reta acima do quadril. Algodão encorpado com volume na medida e símbolo LT Axis discreto. Pensada para combinar com peças de cintura alta.'},
 {id:14,name:'Boxy Cropped Black',price:109.9,color:'Preto',category:'Camisetas Boxy',fit:'Boxy Cropped',measurements:makeMeasures(48,44),description:'Corte reto e curto, mangas proporcionais e caimento estruturado. A modelagem boxy traz liberdade de movimento sem excesso de tecido. Acabamento minimalista com símbolo LT Axis no peito.'},
 {id:15,name:'Baby Tee Cobalt',price:89.9,color:'Azul',category:'Baby Tees',fit:'Baby Tee',measurements:makeMeasures(38,48),description:'Modelagem próxima ao corpo, mangas curtas e comprimento na cintura. Uma alternativa à silhueta boxy para compor o mesmo guarda-roupa urbano. Algodão macio e símbolo LT Axis pequeno no peito.'},
 {id:16,name:'Wide Leg High-Waist',price:219.9,color:'Azul',category:'Calças Baggy',fit:'Wide Leg · cintura alta',measurements:makeMeasures(34,104),description:'Cintura alta definida, quadril confortável e pernas amplas até a barra. Denim lavado com estrutura para equilibrar camisetas boxy e croppeds. Um caimento solto que acompanha o movimento.'},
].map(p=>({...p,audience:'Feminino',line:'Feminino',tag:'NOVO',sizes}));
const catalogProducts=[...originalProducts.map(p=>({...p,audience:'Unissex',line:'Original',fit:p.category==='Calças Baggy'?'Baggy':'Boxy Original',sizes,measurements:makeMeasures(p.category==='Calças Baggy'?38:56,p.category==='Calças Baggy'?100:68)})),...newProducts,...womenProducts];
const detailImages={
 1:'original-black',2:'original-offwhite',3:'original-cobalt',4:'original-black',
 5:'baggy-denim',6:'baggy-graphite',7:'essential-black',8:'original-offwhite',
 9:'fit-black',10:'fit-offwhite',11:'fit-cobalt',12:'fit-graphite',
 13:'cropped-offwhite',14:'cropped-black',15:'babytee-cobalt',16:'wideleg-denim',
};
const artProducts=[
 {id:17,name:'Boxy Axis Blueprint',price:149.9,category:'Camisetas Boxy',color:'Off-white',audience:'Unissex',line:'Art Editions',fit:'Boxy Original',tag:'DROP LIMITADO',detailImage:'/images/v2/axis-blueprint.png',description:'O desenho de construção do LT Axis vira uma estampa arquitetônica em azul sobre algodão off-white. Corte boxy reto e amplo, gola estruturada e tiragem conceitual limitada.'},
 {id:18,name:'Boxy Axis Study',price:149.9,category:'Camisetas Boxy',color:'Preto',audience:'Unissex',line:'Art Editions',fit:'Boxy Original',tag:'DROP LIMITADO',detailImage:'/images/v2/axis-study.png',description:'Estampa tonal com linhas de construção do LT Axis e um único eixo azul elétrico. Silhueta boxy, algodão encorpado e acabamento minimalista. Uma edição gráfica para ir além do básico.'},
];
const imageFor = p => p.detailImage || `/images/products/axis-${detailImages[p.id]}.png`;
const fitFamily=[9,10,11,12];
function productColors(p){
 const family=fitFamily.includes(p.id)?catalogProducts.filter(x=>fitFamily.includes(x.id)&&x.price===p.price):[13,14].includes(p.id)?catalogProducts.filter(x=>[13,14].includes(x.id)):[p];
 return [p.color,...family.map(x=>x.color).filter(c=>c!==p.color)];
}
function photoForColor(p,color){
 const match=fitFamily.includes(p.id)?catalogProducts.find(x=>fitFamily.includes(x.id)&&x.color===color):[13,14].includes(p.id)?catalogProducts.find(x=>[13,14].includes(x.id)&&x.color===color):p;
 return imageFor(match);
}
function detailFor(p,color){
 if(p.category==='Calças Baggy')return color==='Grafite'?'/images/v2/denim-graphite.png':'/images/v2/denim-blue.png';
 return `/images/v2/cotton-${({'Preto':'black','Off-white':'offwhite','Azul':'cobalt','Grafite':'graphite'})[color]}.png`;
}
export const products=[...catalogProducts,...artProducts].map(p=>{
 const kind=p.category==='Calças Baggy'?'pants':'tee';
 const productSizes=kind==='pants'?(p.audience==='Feminino'?['34','36','38','40','42','44']:['36','38','40','42','44','46']):['P','M','G','GG'];
 const colors=productColors(p);
 const variants=colors.flatMap(color=>productSizes.map((size,i)=>({
  id:`${p.id}-${slugify(color)}-${size}`,color,size,
  stock:p.id===4||((fitFamily.includes(p.id)&&color==='Azul'&&size==='GG')||(p.id===1&&size==='GG')||(p.id===16&&size==='44'))?0:2+((fitFamily.includes(p.id)?(p.price===119.9?9:11):[13,14].includes(p.id)?13:p.id)+i+(fitFamily.includes(p.id)||[13,14].includes(p.id)?['Preto','Off-white','Azul','Grafite'].indexOf(color):colors.indexOf(color)))%7,
  image:photoForColor(p,color),
 })));
 const baseDescription=p.description||(kind==='pants'?'Denim lavado de pernas amplas, cintura confortável e acabamento reforçado. Detalhe metálico LT Axis junto ao bolso.':'Camiseta de algodão com corte boxy amplo, gola reforçada e símbolo LT Axis discreto no peito. Volume, conforto e identidade em uma peça essencial.');
 const tags=['LT Axis',...(p.tag?[p.tag]:[]),...(p.line==='Art Editions'?['Estampada']:kind==='tee'?['Básica']:['Denim']),...(['LIMITADO','NOVO DROP','DROP LIMITADO'].includes(p.tag)?['Drop limitado']:[])];
 const measurements=kind==='pants'?productSizes.map((size,i)=>({size,width:Number(size),hip:Number(size)+12,length:102+i,inseam:75+i})):p.measurements||makeMeasures(56,68);
 const images=Object.fromEntries(colors.map(color=>[color,[
  {src:photoForColor(p,color),alt:`${p.name} ${color} — vista frontal`,label:'Frente'},
  {src:detailFor(p,color),alt:`Detalhe ilustrativo do tecido ${color} e acabamento LT Axis`,label:'Acabamento'},
  ...(p.id===9&&color==='Preto'||p.id===13&&color==='Off-white'?[{src:fitEditorial,alt:'Editorial de caimento Boxy Fit e Boxy Cropped',label:'No corpo'}]:[]),
 ] ]));
 return {...p,slug:slugify(p.name),kind,sizes:productSizes,colors,variants,measurements,tags,
  categorySlug:slugify(p.category),description:baseDescription,
  shortDescription:kind==='pants'?`${p.fit}. Denim com símbolo LT Axis.`:`${p.fit}. ${p.line==='Art Editions'?'Estampa arquitetônica autoral.':'Algodão com símbolo LT Axis.'}`,
  details:kind==='pants'?['Denim lavado com estrutura e mobilidade','Costuras reforçadas e passantes na cintura','Detalhe metálico com monograma LT Axis']:['Algodão de toque macio e gola canelada','Costuras reforçadas e barra reta',p.line==='Art Editions'?'Estampa gráfica LT Axis':'Símbolo LT Axis aplicado de forma discreta'],
  care:kind==='pants'?['Lavar do avesso com cores semelhantes.','Usar água fria e secar à sombra.','Evitar alvejante; a lavagem pode variar entre as peças.']:['Lavar do avesso em água fria.','Secar à sombra, sem torcer a aplicação.','Passar em temperatura baixa, protegendo o símbolo.'],
  releasedAt:p.id>=17?'2026-10-29':p.id>=13?'2026-10-26':p.id>=9?'2026-10-20':'2026-10-01',
  stockIsMock:true,detailImage:imageFor(p),images,
 };
});
export const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
