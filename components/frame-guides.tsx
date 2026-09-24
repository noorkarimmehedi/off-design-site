// Swiss-style frame rules either side of the content column: a hairline with
// ruler ticks, registration crosshairs at the header line, and vertical
// coordinate labels (Dhaka).
const GUIDES = [
  { side: "left", label: "23.8103° N — Arc Labs" },
  { side: "right", label: "90.4125° E — Dhaka" },
] as const

export default function FrameGuides() {
  return (
    <>
      {GUIDES.map(({ side, label }) => (
        <div key={side} className={`frame-guide frame-guide--${side}`} aria-hidden="true">
          <span className="frame-guide__cross" />
          <span className="frame-guide__label">{label}</span>
        </div>
      ))}
    </>
  )
}
