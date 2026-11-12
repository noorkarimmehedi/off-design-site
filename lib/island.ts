import { animate, type AnimationPlaybackControls, type DOMKeyframesDefinition } from "framer-motion"

// Shared morph for the Dynamic Island-style widgets.
// The shell is drawn once at its largest size and revealed with clip-path, so a resize never
// triggers layout. The shadow is a separate layer moved with transform only (FLIP), and is set to
// the exact final size the moment the animation starts, so it is crisp at rest.
// Everything animates through Framer Motion on values it hands to the compositor (clip-path, one
// transform string, opacity). No blur and no layout per frame: Chrome and Arc on iPhone slide their
// toolbars while scrolling, and anything heavier stutters there. Each element keeps one running
// handle, stopped before the next move starts, so interrupting never snaps.

export const SHELL = { type: "spring", visualDuration: 0.8, bounce: 0.2 } as const
export const CONTENT = { type: "spring", visualDuration: 0.8, bounce: 0.35 } as const
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

export type Anchor = "bottom-right" | "top-center"
export type Box = { w: number; h: number; r: number }

const IDLE = "translateY(0px) scale(1)"
const running = new WeakMap<Element, AnimationPlaybackControls>()

/** Stop whatever is moving `el`, so the next move starts from where it is now. */
export function stop(el: Element) {
  running.get(el)?.stop()
  running.delete(el)
}

/** Run one animation on `el`, replacing any that is still running. `done` fires only on a natural finish. */
export function move(
  el: HTMLElement,
  keyframes: DOMKeyframesDefinition,
  options: Record<string, unknown>,
  done?: () => void,
) {
  stop(el)
  const c = animate(el, keyframes, { ...options, onComplete: done })
  running.set(el, c)
  return c
}

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

/** Snap to a box with no animation (first paint, or a real width change). */
export function setIsland(shell: HTMLElement, shadow: HTMLElement, W: number, H: number, b: Box, anchor: Anchor) {
  stop(shell)
  stop(shadow)
  shell.style.clipPath = clip(W, H, b, anchor)
  shadow.style.transform = ""
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
  const current = getComputedStyle(shell).clipPath // read before stopping: this is where it is now
  const target = clip(W, H, to, anchor)
  if (reduce) return setIsland(shell, shadow, W, H, to, anchor)

  move(shell, { clipPath: [current && current !== "none" ? current : clip(W, H, from, anchor), target] }, SHELL)
  // FLIP the shadow layer: one transform, origin at the anchored edge
  place(shadow, W, H, to, anchor)
  shadow.style.transformOrigin = anchor === "bottom-right" ? "100% 100%" : "50% 0%"
  move(shadow, { transform: [`scale(${from.w / to.w}, ${from.h / to.h})`, "scale(1, 1)"] }, SHELL)
}

/** Swap content: outgoing is pulled back fast, incoming springs in with the shell.
    Opacity and one transform each, so the compositor runs it. */
export function swapContent(incoming: HTMLElement, outgoing: HTMLElement | null, up: boolean, reduce: boolean) {
  const dy = up ? -1 : 1
  if (outgoing) {
    move(
      outgoing,
      reduce ? { opacity: [1, 0] } : { opacity: [1, 0], transform: [IDLE, `translateY(${6 * dy}px) scale(0.9)`] },
      { duration: reduce ? 0.1 : 0.08, ease: EASE_OUT },
      () => {
        // Rest state comes from CSS ([data-on]); clear what the exit left inline
        outgoing.style.opacity = ""
        outgoing.style.transform = ""
      },
    )
  }
  move(
    incoming,
    reduce ? { opacity: [0, 1] } : { opacity: [0, 1], transform: [`translateY(${8 * dy}px) scale(0.9)`, IDLE] },
    reduce ? { duration: 0.15, ease: "easeOut" } : CONTENT,
  )
}

/** Drop a whole dock in (`show`) or pull it out. Opacity + one transform. */
export function dockMotion(dock: HTMLElement, show: boolean, reduce: boolean, done?: () => void) {
  const away = show ? "translateY(-14px) scale(0.9)" : "translateY(-12px) scale(0.92)"
  const opacity = show ? [0, 1] : [1, 0]
  if (reduce) return move(dock, { opacity }, { duration: show ? 0.2 : 0.22, ease: "easeOut" }, done)
  return move(
    dock,
    { opacity, transform: show ? [away, IDLE] : [IDLE, away] },
    show ? CONTENT : { duration: 0.22, ease: EASE_OUT },
    done,
  )
}
