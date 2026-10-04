"use client"

import { LiquidMetal } from "@paper-design/shaders-react"
import { useReducedMotion } from "framer-motion"
import { useRef, useState, type MouseEvent } from "react"

// Full-width, square-cornered take on the liquid-metal button: a moving chrome shader shows as a
// 2px rim around a dark panel. The metal speeds up on hover and surges on press.
export function LiquidMetalButton({
  label,
  onClick,
  disabled,
  className = "",
}: {
  label: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [surge, setSurge] = useState(false)
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const rippleId = useRef(0)

  const speed = reduce || disabled ? 0 : surge ? 2.4 : hovered ? 1 : 0.6

  const click = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    setSurge(true)
    setTimeout(() => setSurge(false), 300)
    const rect = e.currentTarget.getBoundingClientRect()
    const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ }
    setRipples((r) => [...r, ripple])
    setTimeout(() => setRipples((r) => r.filter((x) => x.id !== ripple.id)), 600)
    onClick?.()
  }

  return (
    <button
      type="button"
      onClick={click}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => (setHovered(false), setPressed(false))}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      className={`group relative block h-[54px] w-full overflow-hidden outline-none transition-[transform,opacity,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-[#ff5941] focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-40 ${
        pressed ? "translate-y-px scale-[0.995] shadow-[0_0_0_1px_rgb(0_0_0/0.3)]" : hovered && !disabled
          ? "shadow-[0_0_0_1px_rgb(0_0_0/0.25),0_3px_6px_rgb(0_0_0/0.1)]"
          : "shadow-[0_0_0_1px_rgb(0_0_0/0.2),0_2px_4px_rgb(0_0_0/0.08)]"
      } ${className}`}
    >
      {/* Chrome rim */}
      <LiquidMetal
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        width="100%"
        height="100%"
        colorBack="#aaaaac"
        colorTint="#ffffff"
        shape="none"
        repetition={3}
        softness={0.7}
        shiftRed={0.3}
        shiftBlue={0.3}
        distortion={0.1}
        contour={0}
        angle={45}
        scale={3}
        offsetX={0.1}
        offsetY={-0.1}
        speed={speed}
      />
      {/* Dark panel */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[2px] bg-[linear-gradient(180deg,#202020_0%,#000000_100%)] transition-shadow duration-150 ${
          pressed ? "shadow-[inset_0_2px_4px_rgb(0_0_0/0.4),inset_0_1px_2px_rgb(0_0_0/0.3)]" : ""
        }`}
      />
      <span className="pointer-events-none relative z-10 font-mono text-[12px] uppercase tracking-[0.2em] text-[#d6d1c8] [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]">
        {label}
      </span>
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="pointer-events-none absolute z-20 size-5 rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.4)_0%,rgb(255_255_255/0)_70%)] [animation:lm-ripple_0.6s_ease-out]"
          style={{ left: r.x, top: r.y }}
        />
      ))}
      <style>{`@keyframes lm-ripple { 0% { transform: translate(-50%, -50%) scale(0); opacity: .6 } 100% { transform: translate(-50%, -50%) scale(4); opacity: 0 } }`}</style>
    </button>
  )
}
