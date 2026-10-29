export const campaign='/images/campaign.png';
export const lifestyle='/images/lifestyle.png';
const originalProducts=[
{id:1,name:'Boxy Distortion',price:119.9,category:'Camisetas Boxy',color:'Preto',image:'/images/collection.png',tag:'BEST SELLER'},
{id:2,name:'Essential Off-White',price:99.9,category:'Essentials',color:'Off-white',image:'/images/collection.png',tag:'ESSENTIAL'},
{id:3,name:'Boxy Blue Frequency',price:129.9,category:'Camisetas Boxy',color:'Azul',image:'/images/collection.png',tag:'NOVO DROP'},
{id:4,name:'Boxy Shadow',price:129.9,category:'Camisetas Boxy',color:'Preto',image:'/images/collection.png',tag:'LIMITADO'},
{id:5,name:'Baggy Washed Denim',price:199.9,category:'Calças Baggy',color:'Azul',image:'/images/collection.png'},
{id:6,name:'Baggy Graphite',price:199.9,category:'Calças Baggy',color:'Grafite',image:'/images/collection.png'},
{id:7,name:'Essential Black',price:99.9,category:'Essentials',color:'Preto',image:'/images/collection.png'},
{id:8,name:'Boxy Abstract Lines',price:129.9,category:'Camisetas Boxy',color:'Off-white',image:'/images/collection.png'}
];
export const fitEditorial='/images/fit-editorial.png';
const sizes=['P','M','G','GG'];
const makeMeasures=(width,length)=>sizes.map((size,i)=>({size,width:width+i*2,length:length+i*2}));
const newProducts=[
 {id:9,name:'Boxy Fit Black',price:119.9,color:'Preto',imageIndex:0},
 {id:10,name:'Boxy Fit Off-White',price:119.9,color:'Off-white',imageIndex:1},
 {id:11,name:'Boxy Fit Cobalt',price:129.9,color:'Azul',imageIndex:2},
 {id:12,name:'Boxy Fit Graphite',price:129.9,color:'Grafite',imageIndex:3},
].map(p=>({...p,category:'Camisetas Boxy',audience:'Unissex',line:'Boxy Fit',fit:'Boxy Fit',tag:'NOVO FIT',image:'/images/fit-collection.png',sizes,measurements:makeMeasures(52,62),description:'Ombros levemente deslocados, mangas mais curtas e volume equilibrado no tronco. O corte reto e o comprimento no alto do quadril preservam o formato boxy, com um encaixe mais próximo ao corpo. Algodão encorpado e logomarca discreta no peito.'}));
const womenProducts=[
 {id:13,name:'Boxy Cropped Off-White',price:109.9,color:'Off-white',category:'Camisetas Boxy',fit:'Boxy Cropped',imageIndex:4,measurements:makeMeasures(48,44),description:'Silhueta boxy compacta, ombros suaves e barra reta acima do quadril. Algodão encorpado com volume na medida e logomarca discreta. Pensada para combinar com peças de cintura alta.'},
 {id:14,name:'Boxy Cropped Black',price:109.9,color:'Preto',category:'Camisetas Boxy',fit:'Boxy Cropped',imageIndex:5,measurements:makeMeasures(48,44),description:'Corte reto e curto, mangas proporcionais e caimento estruturado. A modelagem boxy traz liberdade de movimento sem excesso de tecido. Acabamento minimalista com logomarca no peito.'},
 {id:15,name:'Baby Tee Cobalt',price:89.9,color:'Azul',category:'Baby Tees',fit:'Baby Tee',imageIndex:6,measurements:makeMeasures(38,48),description:'Modelagem próxima ao corpo, mangas curtas e comprimento na cintura. Uma alternativa à silhueta boxy para compor o mesmo guarda-roupa urbano. Algodão macio e logomarca pequena no peito.'},
 {id:16,name:'Wide Leg High-Waist',price:219.9,color:'Azul',category:'Calças Baggy',fit:'Wide Leg · cintura alta',imageIndex:7,measurements:makeMeasures(34,104),description:'Cintura alta definida, quadril confortável e pernas amplas até a barra. Denim lavado com estrutura para equilibrar camisetas boxy e croppeds. Um caimento solto que acompanha o movimento.'},
].map(p=>({...p,audience:'Feminino',line:'Feminino',tag:'NOVO',image:'/images/fit-collection.png',sizes}));
export const products=[...originalProducts.map(p=>({...p,audience:'Unissex',line:'Original',fit:p.category==='Calças Baggy'?'Baggy':'Boxy Original',sizes,measurements:makeMeasures(p.category==='Calças Baggy'?38:56,p.category==='Calças Baggy'?100:68)})),...newProducts,...womenProducts];
export const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
