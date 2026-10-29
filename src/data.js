export const photo=(id,w=1200)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
export const campaign=photo('photo-1529139513065-c5363dd18c6b',2000);
export const lifestyle=photo('photo-1483985988355-763728e1935b');
export const products=[
{id:1,name:'Boxy Distortion',price:119.9,category:'Camisetas Boxy',color:'Preto',image:photo('photo-1521572163474-6864f9cf17ab'),tag:'BEST SELLER'},
{id:2,name:'Essential Off-White',price:99.9,category:'Essentials',color:'Off-white',image:photo('photo-1503341504253-dff4815485f1'),tag:'ESSENTIAL'},
{id:3,name:'Boxy Blue Frequency',price:129.9,category:'Camisetas Boxy',color:'Azul',image:photo('photo-1503342217505-b0a15ec3261c'),tag:'NOVO DROP'},
{id:4,name:'Boxy Shadow',price:129.9,category:'Camisetas Boxy',color:'Preto',image:photo('photo-1523398002811-999ca8dec234'),tag:'LIMITADO'},
{id:5,name:'Baggy Washed Denim',price:199.9,category:'Calças Baggy',color:'Azul',image:photo('photo-1542272604-787c3835535d')},
{id:6,name:'Baggy Graphite',price:199.9,category:'Calças Baggy',color:'Grafite',image:photo('photo-1473966968600-fa801b869a1a')},
{id:7,name:'Essential Black',price:99.9,category:'Essentials',color:'Preto',image:photo('photo-1503341455253-b2e723bb3dbb')},
{id:8,name:'Boxy Abstract Lines',price:129.9,category:'Camisetas Boxy',color:'Off-white',image:photo('photo-1521572163474-6864f9cf17ab')}
];
export const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
