import React from 'react';
/** The locally generated contact sheet keeps all eight garments in one consistent studio. */
export default function ProductImage({product,decorative=false,zoom=false}) {
 const index=product.id-1;
 return <div className={`garment-visual${zoom?' garment-zoom':''}`} role={decorative?undefined:'img'} aria-hidden={decorative?true:undefined} aria-label={decorative?undefined:product.name} style={{backgroundImage:`url(${product.image})`,backgroundPosition:`${(index%4)*100/3}% ${index<4?0:100}%`}}/>;
}
