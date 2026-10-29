import React from 'react';
/** Catalogue and product gallery share the same individual, branded photograph. */
export default function ProductImage({product,decorative=false}) {
 return <div className="garment-visual"><img src={product.detailImage} alt={decorative?'':`${product.name} com símbolo LT Axis`} aria-hidden={decorative?true:undefined} width="1086" height="1448" loading="lazy" decoding="async"/></div>;
}
