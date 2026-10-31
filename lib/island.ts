import { springEasing } from "./spring"

// Shared morph for the Dynamic Island-style widgets.
// The shell is drawn once at its largest size and revealed with clip-path, so a resize never
// triggers layout. The shadow is a separate layer moved with transform only (FLIP), and is set to
// the exact final size the moment the animation starts, so it is crisp at rest.
// No layout per frame keeps it smooth on WebKit web views with little headroom (Chrome and other
// in-app browsers on iPhone). Content keeps its soft blur-in; that only paints the small slot.

export const SHELL = springEasing(0.8, 0.2)
export const CONTENT = springEasing(0.8, 0.35)
export const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"

export type Anchor = "bottom-right" | "top-center"
export type Box = { w: number; h: number; r: number }

const clip = (W: number, H: number, b: Box, anchor: Anchor) => {
  if (anchor === "bottom-right") return `inset(${H - b.h}px 0px 0px ${W - b.w}px round ${b.r}px)`
  const side = (W - b.w) / 2
  return `inset(0px ${side}px ${H - b.h}px ${side}px round ${b.r}px)`
}

const place = (shadow: HTMLElement, W: number, H: number, b: Box, anchor: Anchor) => {
  shadow.style.width = `${b.w}px`
  shadow.style.height = `${b.h}px`
  shadow.style.borderRadius = `${b.r}px`
  shadow.style.left = anchor === "bottom-right" ? `${W - b.w}px` : `${(W - b.w) / 2}px`
  shadow.style.top = anchor === "bottom-right" ? `${H - b.h}px` : "0px"
}

export const boxOf = (el: HTMLElement, maxRadius = 32): Box => ({
  w: el.offsetWidth,
  h: el.offsetHeight,
  r: Math.min(el.offsetHeight / 2, maxRadius),
})

/** Snap to a box with no animation (first paint). */
export function setIsland(shell: HTMLElement, shadow: HTMLElement, W: number, H: number, b: Box, anchor: Anchor) {
  shell.style.clipPath = clip(W, H, b, anchor)
  place(shadow, W, H, b, anchor)
}

/** Spring from the box currently shown to `to`. Interruptible: starts from wherever the clip is now. */
export function morphIsland(
  shell: HTMLElement,
  shadow: HTMLElement,
  W: number,
  H: number,
  from: Box,
  to: Box,
  anchor: Anchor,
  reduce: boolean,
) {
  const current = getComputedStyle(shell).clipPath
  shell.getAnimations().forEach((a) => a.cancel())
  shadow.getAnimations().forEach((a) => a.cancel())
  const target = clip(W, H, to, anchor)
  shell.style.clipPath = target
  place(shadow, W, H, to, anchor)
  if (reduce) return

  shell.animate(
    [{ clipPath: current && current !== "none" ? current : clip(W, H, from, anchor) }, { clipPath: target }],
    { duration: SHELL.ms, easing: SHELL.easing },
  )
  // FLIP the shadow layer: transform only, origin at the anchored edge
  shadow.style.transformOrigin = anchor === "bottom-right" ? "100% 100%" : "50% 0%"
  shadow.animate(
    [{ transform: `scale(${from.w / to.w}, ${from.h / to.h})` }, { transform: "none" }],
    { duration: SHELL.ms, easing: SHELL.easing },
  )
}

/** Swap content: outgoing is pulled back fast, incoming springs in from a soft blur with the shell.
    The blur only covers the small slot, so it stays cheap; the shell itself never blurs or relayouts. */
export function swapContent(incoming: HTMLElement, outgoing: HTMLElement | null, up: boolean, reduce: boolean) {
  const dy = up ? -1 : 1
  outgoing?.animate(
    [
      { opacity: 1, transform: "none" },
      { opacity: 0, transform: `scale(0.9) translateY(${6 * dy}px)` },
    ],
    { duration: reduce ? 100 : 80, easing: EASE_OUT },
  )
  incoming.animate(
    reduce
      ? [{ opacity: 0 }, { opacity: 1 }]
      : [
          { opacity: 0, transform: `scale(0.9) translateY(${8 * dy}px)`, filter: "blur(5px)" },
          { opacity: 1, transform: "none", filter: "blur(0px)" },
        ],
    { duration: reduce ? 150 : CONTENT.ms, easing: reduce ? "ease" : CONTENT.easing },
  )
}
