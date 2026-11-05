import { ARC_MARK_PATHS, ARC_MARK_TRANSFORM } from "./arc-mark-paths"

// The wordmark debossed into the page: barely darker than the background, with an inner shadow
// along the top edge, a light catch along the bottom and a bright lip just outside it.
// Offsets are in viewBox units (4141 wide), so they scale with the mark.
export default function PressedMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 4141 1517" className="pressed-mark">
      <defs>
        <filter id="arc-deboss" x="-2%" y="-6%" width="104%" height="112%" colorInterpolationFilters="sRGB">
          <feOffset in="SourceAlpha" dy="6.2" result="down" />
          <feGaussianBlur in="down" stdDeviation="3.9" result="downSoft" />
          <feComposite in="SourceAlpha" in2="downSoft" operator="out" result="topBand" />
          <feFlood style={{ floodColor: "var(--press-shade)" }} result="shadeInk" />
          <feComposite in="shadeInk" in2="topBand" operator="in" result="innerShade" />
          <feOffset in="SourceAlpha" dy="-3.6" result="up" />
          <feGaussianBlur in="up" stdDeviation="2.3" result="upSoft" />
          <feComposite in="SourceAlpha" in2="upSoft" operator="out" result="bottomBand" />
          <feFlood style={{ floodColor: "var(--press-light)" }} result="lightInk" />
          <feComposite in="lightInk" in2="bottomBand" operator="in" result="innerLight" />
          <feOffset in="SourceAlpha" dy="18.2" result="deep" />
          <feGaussianBlur in="deep" stdDeviation="13" result="deepSoft" />
          <feComposite in="SourceAlpha" in2="deepSoft" operator="out" result="floorBand" />
          <feFlood style={{ floodColor: "var(--press-floor)" }} result="floorInk" />
          <feComposite in="floorInk" in2="floorBand" operator="in" result="floor" />
          <feOffset in="SourceAlpha" dy="3.6" result="lipDown" />
          <feComposite in="lipDown" in2="SourceAlpha" operator="out" result="lipBand" />
          <feFlood style={{ floodColor: "var(--press-lip)" }} result="lipInk" />
          <feComposite in="lipInk" in2="lipBand" operator="in" result="lip" />
          <feMerge>
            <feMergeNode in="lip" />
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="floor" />
            <feMergeNode in="innerShade" />
            <feMergeNode in="innerLight" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#arc-deboss)">
        <g transform={ARC_MARK_TRANSFORM} fill="currentColor">
          {ARC_MARK_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>
    </svg>
  )
}
