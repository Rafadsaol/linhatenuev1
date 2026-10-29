import React from 'react';
export function BrandMark({className=''}) {
 return <svg className={`brand-mark ${className}`} viewBox="0 0 260 380" fill="none" aria-hidden="true"><g fill="currentColor"><path d="M16 72H86C63 80 55 85 55 99V217C55 242 66 257 91 266V286H16Z"/><path d="M99 138H249V190C246 174 240 164 226 164H173V374C167 329 141 303 99 286V266H134V205C134 182 122 169 99 164Z"/><path d="M91 16H97V164H91Z M91 220H97V374H91Z"/></g><path d="M91 164H97V213H91Z" fill="var(--blue, #143aff)"/></svg>;
}
export default function BrandLogo({stacked=false}) {
 return <a className={`brand-logo${stacked?' brand-logo-stacked':''}`} href="#/" aria-label="Linha Tênue — início"><BrandMark/><span className="brand-lockup"><span className="brand-wordmark">LINHA TÊNUE</span><span className="brand-signature">FASHION / STREETWEAR / CULTURE</span></span></a>;
}
