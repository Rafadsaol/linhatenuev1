import React from 'react';
import {BrandMark} from './BrandLogo';

export default function BrandIdentity() {
 return <section className="brand-identity" aria-labelledby="identity-title"><div className="identity-heading"><span className="eyebrow">LINHA TÊNUE / IDENTIDADE</span><span>LT AXIS — 001</span></div><div className="identity-board"><div className="identity-symbol"><BrandMark/><span>SÍMBOLO / LT AXIS</span></div><div className="identity-copy"><span className="brand-wordmark">LINHA TÊNUE</span><h2 id="identity-title">UM SÍMBOLO<br/>EM EQUILÍBRIO.</h2><p>A linha que conecta contrastes. Forma, direção e identidade em um mesmo eixo.</p><div className="identity-principles"><span><b>L</b>ESTRUTURA</span><span><b>T</b>DIREÇÃO</span><span><i/>EQUILÍBRIO</span></div></div></div><div className="identity-bottom"><span>MINIMALISTA. ARQUITETÔNICO. CONTEMPORÂNEO.</span><span>ENTRE O QUE SOMOS E O QUE AINDA PODE SER.</span></div></section>;
}
