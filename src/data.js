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
export const products=catalogProducts.map(p=>({...p,detailImage:`/images/products/axis-${detailImages[p.id]}.png`}));
export const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
