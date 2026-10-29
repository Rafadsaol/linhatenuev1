import React from 'react';
export default function CampaignLabel({children,code='LT / 001',className=''}){return <div className={`campaign-label ${className}`}><span className="axis-line" aria-hidden="true"/><span>{children}</span><span className="campaign-label-code">{code}</span></div>}
