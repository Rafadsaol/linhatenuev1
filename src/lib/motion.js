export function scrollIntoView(element,options={}) {
 element?.scrollIntoView({...options,behavior:document.documentElement.classList.contains('demo-reduced-motion')||window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
