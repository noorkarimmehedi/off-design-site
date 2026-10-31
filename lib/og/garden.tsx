import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { shapedTextSvg } from "@/lib/og/shaped-text"

// The garden link-preview card used across the site: painted linen sky and flower bed
// (artwork by Ryan Brewer, used with permission), the arc logo pill — with the client's logo
// beside it when we have one — and a title with a short mono line underneath.
// Everything sits in the top half so iMessage's title label (bottom-left) never covers it.

export const OG_SIZE = { width: 1200, height: 630 }

const asset = (file: string) => readFile(join(process.cwd(), "assets/og", file))
const isBangla = (s: string) => /[ঀ-৿]/.test(s)
const data = (b: Buffer, type: string) => `data:${type};base64,${b.toString("base64")}`

export async function gardenCard({ title, subtitle, logo }: { title: string; subtitle: string; logo?: string }) {
  const [garden, arc, hind, geist, mono, brandLogo] = await Promise.all([
    asset("garden.jpg"),
    asset("logo-black.png"),
    asset("HindSiliguri-700.ttf"),
    asset("Geist-400.ttf"),
    asset("GeistMono-400.ttf"),
    logo ? asset(logo) : Promise.resolve(null),
  ])
  // Bangla is shaped by HarfBuzz and drawn as an image; Satori can't reorder vowel signs or join conjuncts
  const shaped = isBangla(title) ? shapedTextSvg(title, hind, 67, "#ffffff") : null

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
        <img src={data(garden, "image/jpeg")} width={1200} height={630} style={{ position: "absolute", left: 0, top: 0 }} />

        {/* arc (× brand) */}
        <div
          style={{
            position: "absolute",
            left: 44,
            top: 40,
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: brandLogo ? "14px 26px 14px 16px" : "26px 34px",
            borderRadius: 999,
            background: "#ffffff",
            boxShadow: "0 14px 30px -10px rgba(0,0,0,0.35)",
          }}
        >
          <img src={data(arc, "image/png")} width={140} height={50} style={{ objectFit: "contain" }} />
          {brandLogo && <span style={{ fontFamily: "Geist Mono", fontSize: 30, color: "#8f887d" }}>×</span>}
          {brandLogo && <img src={data(brandLogo, "image/png")} width={104} height={104} style={{ borderRadius: 999 }} />}
        </div>

        {/* Title + mono line */}
        <div style={{ position: "absolute", left: 48, top: 192, display: "flex", flexDirection: "column", gap: shaped ? 6 : 18 }}>
          {shaped ? (
            <img src={shaped.src} width={shaped.width} height={shaped.height} />
          ) : (
            <span style={{ fontFamily: "Geist", fontSize: 62, lineHeight: 1.05, letterSpacing: -2, color: "#ffffff", maxWidth: 1000 }}>
              {title}
            </span>
          )}
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.82)",
            }}
          >
            {subtitle}
          </span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: geist, weight: 400, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
        // Also covers the ৳ sign and Bangla fallbacks
        { name: "Hind Siliguri", data: hind, weight: 700, style: "normal" },
      ],
    },
  )
}
