import React from 'react';
export default function PhotoViewControls({product,showFinish,onChange,photoId}){
 if(!product.images[product.color]?.[1])return null;
 return <div className="photo-view-controls" role="group" aria-label={`Fotos de ${product.name}`}>
  <button type="button" aria-controls={photoId} aria-label={`Ver frente de ${product.name}`} aria-pressed={!showFinish} onClick={()=>onChange(false)}>Frente</button>
  <button type="button" aria-controls={photoId} aria-label={`Ver acabamento de ${product.name}`} aria-pressed={showFinish} onClick={()=>onChange(true)}>Acabamento</button>
 </div>;
}
