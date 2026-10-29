export function scrollIntoView(element,options={}) {
 element?.scrollIntoView({...options,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
