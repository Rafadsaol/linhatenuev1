export const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const slugify = value => fold(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const categoryOptions = [
 ['todos', 'Todas as peças'], ['camisetas-boxy', 'Boxy Tees'], ['essentials', 'Essentials'],
 ['calcas-baggy', 'Baggy Pants'], ['baby-tees', 'Baby Tees'], ['boxy-fit', 'Boxy Fit'], ['drops', 'Drops limitados'],
];
export const defaultFilters = { q:'', category:'todos', audience:'Todos', size:'', color:'', min:'', max:'', sort:'novidades' };
const parameterKeys = {q:'q',category:'categoria',audience:'colecao',size:'tamanho',color:'cor',min:'min',max:'max',sort:'ordenar'};
const numberFilter = n => n !== null && n !== '' && Number.isFinite(Number(n)) && Number(n) >= 0 ? String(Number(n)) : '';
export function parseFilters(search='', path='/loja') {
 const params = new URLSearchParams(search);
 const fromPath = path.split('/')[2];
 const category = fromPath || params.get('categoria') || 'todos';
 return {
  q:(params.get('q') || '').slice(0,150),
  category:categoryOptions.some(([key])=>key===category)?category:'todos',
  audience:['Unissex','Feminino'].includes(params.get('colecao'))?params.get('colecao'):'Todos',
  size:params.get('tamanho') || '', color:params.get('cor') || '',
  min:numberFilter(params.get('min')), max:numberFilter(params.get('max')),
  sort:['novidades','menor-preco','maior-preco','nome'].includes(params.get('ordenar'))?params.get('ordenar'):'novidades',
 };
}
export function filtersHref(filters, path='/loja') {
 const params = new URLSearchParams();
 for (const [key,param] of Object.entries(parameterKeys)) {
  if (key==='category' && path.split('/')[2]) continue;
  if (String(filters[key] ?? '') !== String(defaultFilters[key]) && filters[key] !== '') params.set(param,filters[key]);
 }
 return path+(params.size?'?'+params.toString():'');
}
export function categoryHref(value) {
 const aliases = {'Todos':'todos','Camisetas Boxy':'camisetas-boxy','Calças Baggy':'calcas-baggy','Essentials':'essentials','Drops Limitados':'drops','Boxy Fit':'boxy-fit','Baby Tees':'baby-tees'};
 if(value==='Feminino')return '/loja?colecao=Feminino';
 const key=aliases[value] || value;
 return key==='todos'?'/loja':`/loja/${key}`;
}
export function getVariant(product,color,size) {
 return product?.variants.find(v=>v.color===color && v.size===String(size));
}
export function selectProducts(products,filters) {
 const query=fold(filters.q);
 const selected=products.filter(p=>{
  const categoryMatches=filters.category==='todos' || (filters.category==='drops'?p.tags.includes('Drop limitado'):filters.category==='boxy-fit'?p.line==='Boxy Fit':p.categorySlug===filters.category);
  const text=fold([p.name,p.category,p.shortDescription,p.description,...p.tags].join(' '));
  const variants=filters.size||filters.color?p.variants.some(v=>(!filters.size||v.size===filters.size)&&(!filters.color||v.color===filters.color)&&v.stock>0):true;
  return categoryMatches && (filters.audience==='Todos'||p.audience===filters.audience) && variants &&
   (filters.min===''||p.price>=Number(filters.min)) && (filters.max===''||p.price<=Number(filters.max)) &&
   (!query||query.split(/\s+/).every(word=>text.includes(word)));
 });
 return [...selected].sort((a,b)=>{
  if(filters.sort==='menor-preco')return a.price-b.price||a.id-b.id;
  if(filters.sort==='maior-preco')return b.price-a.price||a.id-b.id;
  if(filters.sort==='nome')return a.name.localeCompare(b.name,'pt-BR')||a.id-b.id;
  return b.releasedAt.localeCompare(a.releasedAt)||b.id-a.id;
 });
}
export const productHref = product => `/produto/${product.slug}`;
