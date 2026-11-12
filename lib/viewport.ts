/*
 * Phone toolbars (Chrome/Arc on iPhone, Android browsers) grow and shrink while the page scrolls,
 * which fires `resize` with a new height and moves `innerHeight` under any running animation.
 * Layout and scroll maths use these two instead, so only a real width change re-lays things out.
 */

/** Calls `fn` on resize only when the viewport WIDTH changed (rotation, window resize). Returns the unsubscribe. */
export function onWidthResize(fn: () => void) {
  let w = window.innerWidth
  const on = () => {
    if (window.innerWidth === w) return // toolbar showing/hiding: height-only, ignore
    w = window.innerWidth
    fn()
  }
  window.addEventListener("resize", on)
  return () => window.removeEventListener("resize", on)
}

let svhProbe: HTMLDivElement | null = null
/** The small-viewport height (CSS `100svh`): the visible height with toolbars shown. It doesn't change while they slide. */
export function stableVh() {
  if (!svhProbe) {
    svhProbe = document.createElement("div")
    svhProbe.style.cssText =
      "position:fixed;left:0;top:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none"
    document.body.appendChild(svhProbe)
  }
  return svhProbe.offsetHeight || window.innerHeight
}
