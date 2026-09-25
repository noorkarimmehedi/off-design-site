"use client"

import { useEffect, useRef } from "react"

// Video frame size; the canvas keeps it so object-fit: cover crops it like the video did
const WIDTH = 1280
const HEIGHT = 800

const VERTEX = `
attribute vec2 p;
varying vec2 uv;
void main() {
  uv = vec2(p.x, -p.y) * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`

// Luminance → alpha: white footage becomes fully transparent, dark glyphs become the
// theme's foreground colour. Output is premultiplied (WebGL's default canvas blending).
const FRAGMENT = `
precision mediump float;
uniform sampler2D frame;
uniform vec3 ink;
varying vec2 uv;
void main() {
  float lum = dot(texture2D(frame, uv).rgb, vec3(0.299, 0.587, 0.114));
  float a = clamp((0.94 - lum) / 0.94, 0.0, 1.0);
  gl_FragColor = vec4(ink * a, a);
}`

function foreground() {
  const hex = getComputedStyle(document.documentElement).getPropertyValue("--color-ivory").trim()
  const n = parseInt(hex.replace("#", ""), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => c / 255) as [number, number, number]
}

function compile(gl: WebGLRenderingContext) {
  const program = gl.createProgram()!
  for (const [type, src] of [
    [gl.VERTEX_SHADER, VERTEX],
    [gl.FRAGMENT_SHADER, FRAGMENT],
  ] as const) {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, src)
    gl.compileShader(shader)
    gl.attachShader(program, shader)
  }
  gl.linkProgram(program)
  gl.useProgram(program)

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const p = gl.getAttribLocation(program, "p")
  gl.enableVertexAttribArray(p)
  gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0)

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  return gl.getUniformLocation(program, "ink")
}

// Pre-rendered ASCII videos (dark glyphs on white). A hidden video feeds a WebGL canvas
// that keeps only the glyphs, in the theme's text colour, on a transparent background —
// so the page shows through exactly. (Showing the <video> itself with CSS blend/filter
// left a visible box on iOS, which composites video with its own colour handling.)
// Placeholder footage in /public/video — swap for our own ASCII renders.
function HandVideo({ side }: { side: "left" | "right" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    const gl = canvas?.getContext("webgl", { premultipliedAlpha: true, alpha: true })
    if (!canvas || !video || !gl) return

    const ink = compile(gl)
    let stopped = false
    let visible = true
    let hasFrame = false

    const setInk = () => gl.uniform3fv(ink, foreground())
    const render = () => gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    const draw = (source: TexImageSource) => {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
      hasFrame = true
      render()
    }
    setInk()

    // Re-tint when the theme flips
    const themeObserver = new MutationObserver(() => {
      setInk()
      if (hasFrame) render()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    // Poster first, so there's an image before (or without) playback
    const poster = new Image()
    poster.src = video.poster
    poster.onload = () => {
      if (!stopped && video.readyState < 2) draw(poster)
    }

    // Upload each decoded frame; requestVideoFrameCallback where supported, rAF otherwise
    const tick = () => {
      if (stopped) return
      if (video.readyState >= 2 && !video.paused) draw(video)
      if ("requestVideoFrameCallback" in video) video.requestVideoFrameCallback(tick)
      else requestAnimationFrame(tick)
    }
    tick()
    video.addEventListener("loadeddata", () => draw(video), { once: true })

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => {
      if (reduce.matches || !visible) video.pause()
      else video.play().catch(() => {})
    }
    // Don't decode frames nobody can see
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
      sync()
    })
    observer.observe(canvas)
    reduce.addEventListener("change", sync)

    return () => {
      stopped = true
      observer.disconnect()
      themeObserver.disconnect()
      reduce.removeEventListener("change", sync)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className={`ascii-hand ascii-hand--${side}`} aria-hidden="true" />
      <video
        ref={videoRef}
        className="pointer-events-none absolute size-px opacity-0"
        src={`/video/hand-${side}.mp4`}
        poster={`/video/hand-${side}.webp`}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </>
  )
}

export default function AsciiHands() {
  return (
    // Phones: a hairline box in flow under the header (matches the hero box); sm+: full-bleed layer
    <div className="ascii-stage">
      <div className="ascii-clip ascii-clip--left">
        <HandVideo side="left" />
      </div>
      <div className="ascii-clip ascii-clip--right">
        <HandVideo side="right" />
      </div>
    </div>
  )
}
