import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { priceSelection, taka } from "@/lib/work-order/catalog"
import { shapedTextSvg } from "@/lib/og/shaped-text"
import { resolveClient } from "@/lib/work-order/clients"

// Link preview for WhatsApp, Messenger and social shares: one card per brand link
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Arc Labs work order"

const asset = (file: string) => readFile(join(process.cwd(), "assets/og", file))
const isBangla = (s: string) => /[ঀ-৿]/.test(s)

const INK = "#000000"
const IVORY = "#ede8df"
const STONE = "#8f887d"
const FRAME = "#2a2824"
const CORAL = "#ff5941"

export default async function OrderPreview({ params }: { params: Promise<{ slug: string }> }) {
  const { name } = resolveClient((await params).slug)
  const [playfair, geist, mono, hind, amp, logo] = await Promise.all([
    asset("PlayfairDisplay-900.ttf"),
    asset("Geist-400.ttf"),
    asset("GeistMono-400.ttf"),
    asset("HindSiliguri-700.ttf"),
    asset("amp.png"),
    asset("logo.png"),
  ])
  const src = (b: Buffer) => `data:image/png;base64,${b.toString("base64")}`
  const from = taka(priceSelection({}).total)
  const brand = name ?? "your business"
  const long = brand.length > 16
  const nameSize = long ? 92 : 120
  // Bangla is shaped by HarfBuzz and drawn as an image; Satori can't reorder vowel signs or join conjuncts
  const banglaName = isBangla(brand) ? shapedTextSvg(brand, hind, nameSize * 1.05, name ? IVORY : STONE) : null

  const label = {
    fontFamily: "Geist Mono",
    // Sized for the ~400px-wide chat bubble WhatsApp shrinks this card into
    fontSize: 28,
    letterSpacing: 3,
    textTransform: "uppercase" as const,
    color: STONE,
    whiteSpace: "nowrap" as const,
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: INK, padding: 28 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: `1px solid ${FRAME}`,
            padding: "44px 60px 40px",
            color: IVORY,
          }}
        >
          {/* Top rule: logo · line · label */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <img src={src(logo)} width={120} height={45} style={{ objectFit: "contain" }} />
            <div style={{ flex: 1, height: 1, background: FRAME }} />
            <span style={{ ...label, fontSize: 24 }}>Work order</span>
          </div>

          {/* arc & brand */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <span style={{ fontFamily: "Playfair Display", fontSize: 150, lineHeight: 0.8, letterSpacing: -5 }}>arc</span>
              <img src={src(amp)} width={long ? 120 : 150} height={long ? 119 : 149} />
            </div>
            {banglaName ? (
              <img src={banglaName.src} width={banglaName.width} height={banglaName.height} style={{ marginTop: 14 }} />
            ) : (
              <span
                style={{
                  marginTop: 18,
                  fontFamily: "Playfair Display",
                  fontSize: nameSize,
                  lineHeight: 0.9,
                  letterSpacing: -4,
                  textTransform: "lowercase",
                  color: name ? IVORY : STONE,
                }}
              >
                {brand}
              </span>
            )}
          </div>

          {/* Terms row */}
          <div style={{ display: "flex", alignItems: "center", borderTop: `1px solid ${FRAME}`, paddingTop: 26, gap: 36 }}>
            <span style={{ ...label, color: CORAL }}>Ready to sign</span>
            <div style={{ flex: 1 }} />
            <span style={{ ...label, color: IVORY }}>From {from}</span>
            <span style={label}>· 7–15 days</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair Display", data: playfair, weight: 900, style: "normal" },
        { name: "Geist", data: geist, weight: 400, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
        // Also covers the ৳ sign, which the Latin faces don't have
        { name: "Hind Siliguri", data: hind, weight: 700, style: "normal" },
      ],
    },
  )
}
