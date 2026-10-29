import React from 'react';
/** Each local contact sheet has eight cells; imageIndex selects the garment independently of product IDs. */
export default function ProductImage({product,decorative=false,zoom=false}) {
 const index=product.imageIndex ?? product.id-1;
 return <div className={`garment-visual${zoom?' garment-zoom':''}`} role={decorative?undefined:'img'} aria-hidden={decorative?true:undefined} aria-label={decorative?undefined:product.name} style={{backgroundImage:`url(${product.image})`,backgroundPosition:`${(index%4)*100/3}% ${index<4?0:100}%`}}/>;
}
