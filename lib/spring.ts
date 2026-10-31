// Apple-style spring (duration in seconds, bounce 0–1) sampled into a CSS `linear()` easing,
// so the Web Animations API can run real spring motion on the compositor.
// The curve runs 25% past `duration` so the settle is not cut off.
export function springEasing(duration: number, bounce: number, samples = 60) {
  const w0 = (2 * Math.PI) / duration
  const zeta = 1 - bounce
  const pts: number[] = []
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * duration * 1.25
    let x: number
    if (zeta < 1) {
      const wd = w0 * Math.sqrt(1 - zeta * zeta)
      x = 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
    } else {
      x = 1 - Math.exp(-w0 * t) * (1 + w0 * t)
    }
    pts.push(Number(x.toFixed(4)))
  }
  pts[pts.length - 1] = 1
  return { easing: `linear(${pts.join(", ")})`, ms: Math.round(duration * 1250) }
}
