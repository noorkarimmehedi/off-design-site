import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { shapedTextSvg } from "@/lib/og/shaped-text"

// The garden link-preview card used across the site: painted linen sky and flower bed
// (artwork by Ryan Brewer, used with permission), with the homepage's type on it — a grey arc
// pill (the client's logo beside it when we have one), a two-tone Satoshi headline and a row of
// frosted chips. Everything sits in the top half so iMessage's title label (bottom-left) never covers it.

export const OG_SIZE = { width: 1200, height: 630 }

/** One headline line. Ink lines are full white; the rest are softened, like the homepage's grey hero. */
export type GardenLine = { text: string; ink?: boolean }

const asset = (file: string) => readFile(join(process.cwd(), "assets/og", file))
const isBangla = (s: string) => /[ঀ-৿]/.test(s)
const data = (b: Buffer, type: string) => `data:${type};base64,${b.toString("base64")}`

const SIZE = 64
const INK = "#ffffff"
const SOFT = "rgba(255,255,255,0.66)"

export async function gardenCard({ lines, chips = [], logo }: { lines: GardenLine[]; chips?: string[]; logo?: string }) {
  const [garden, arc, hind, satoshi, brandLogo] = await Promise.all([
    asset("garden.jpg"),
    asset("logo-black.png"),
    asset("HindSiliguri-700.ttf"),
    asset("Satoshi-400.ttf"),
    logo ? asset(logo) : Promise.resolve(null),
  ])

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "Satoshi" }}>
        <img src={data(garden, "image/jpeg")} width={1200} height={630} style={{ position: "absolute", left: 0, top: 0 }} />

        {/* arc (× brand), on the homepage's grey */}
        <div
          style={{
            position: "absolute",
            left: 48,
            top: 44,
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: brandLogo ? "12px 22px 12px 26px" : "22px 30px",
            borderRadius: 22,
            background: "#ededed",
          }}
        >
          <img src={data(arc, "image/png")} width={112} height={40} style={{ objectFit: "contain" }} />
          {brandLogo && <span style={{ fontSize: 28, color: "#7a7a7a" }}>×</span>}
          {brandLogo && (
            <div style={{ display: "flex", width: 76, height: 76, borderRadius: 999, overflow: "hidden", background: "#ffffff", alignItems: "center", justifyContent: "center" }}>
              <img src={data(brandLogo, "image/png")} width={70} height={70} style={{ objectFit: "contain" }} />
            </div>
          )}
        </div>

        {/* Headline and chips, in one column so a long name pushes the chips down instead of under them */}
        <div style={{ position: "absolute", left: 52, top: 146, width: 1080, display: "flex", flexDirection: "column" }}>
          {lines.map((l, i) => {
            const color = l.ink ? INK : SOFT
            // Bangla is shaped by HarfBuzz and drawn as an image; Satori can't reorder vowel signs or join conjuncts
            if (isBangla(l.text)) {
              const shaped = shapedTextSvg(l.text, hind, 58, INK)
              return <img key={i} src={shaped.src} width={shaped.width} height={shaped.height} style={{ marginTop: -2, marginBottom: -6, opacity: l.ink ? 1 : 0.66 }} />
            }
            return (
              <span key={i} style={{ fontSize: SIZE, lineHeight: 1.125, letterSpacing: -2.9, color }}>
                {l.text}
              </span>
            )
          })}
          {chips.length > 0 && (
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              {chips.map((c) => (
                <span
                  key={c}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 42,
                    padding: "0 16px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.16)",
                    color: "#ffffff",
                    fontSize: 21,
                    letterSpacing: -0.2,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Satoshi", data: satoshi, weight: 400, style: "normal" },
        // Also covers the ৳ sign, which Satoshi doesn't have, and Bangla fallbacks
        { name: "Hind Siliguri", data: hind, weight: 700, style: "normal" },
      ],
    },
  )
}
