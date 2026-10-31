import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { getCatalog, priceSelection, taka } from "@/lib/work-order/catalog"
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
  const client = resolveClient((await params).slug)
  if (client.preview === "garden" && client.name && client.logo) {
    return GardenPreview({ name: client.name, logo: client.logo, catalogName: getCatalog(client.catalog).name })
  }
  const { name, catalog: catalogId } = client
  const catalog = getCatalog(catalogId)
  const [playfair, geist, mono, hind, amp, logo] = await Promise.all([
    asset("PlayfairDisplay-900.ttf"),
    asset("Geist-400.ttf"),
    asset("GeistMono-400.ttf"),
    asset("HindSiliguri-700.ttf"),
    asset("amp.png"),
    asset("logo.png"),
  ])
  const src = (b: Buffer) => `data:image/png;base64,${b.toString("base64")}`
  const from = taka(priceSelection({}, catalog).total)
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
            <span style={label}>· {catalog.delivery}</span>
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

// Garden card: painted linen sky and flower bed (artwork by Ryan Brewer, used with permission),
// the arc × brand logo pill top-left, and the brand name with the package underneath.
// Everything sits in the top half so iMessage's title label (bottom-left) never covers it.
async function GardenPreview({ name, logo, catalogName }: { name: string; logo: string; catalogName: string }) {
  const [garden, arc, brandLogo, hind, mono] = await Promise.all([
    asset("garden.jpg"),
    asset("logo-black.png"),
    asset(logo),
    asset("HindSiliguri-700.ttf"),
    asset("GeistMono-400.ttf"),
  ])
  const data = (b: Buffer, type: string) => `data:${type};base64,${b.toString("base64")}`
  // Bangla is shaped by HarfBuzz and drawn as an image; Latin names fall back to plain text
  const shaped = isBangla(name) ? shapedTextSvg(name, hind, 67, "#ffffff") : null

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
        <img src={data(garden, "image/jpeg")} width={1200} height={630} style={{ position: "absolute", left: 0, top: 0 }} />

        {/* arc × brand */}
        <div
          style={{
            position: "absolute",
            left: 44,
            top: 40,
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "14px 26px 14px 16px",
            borderRadius: 999,
            background: "#ffffff",
            boxShadow: "0 14px 30px -10px rgba(0,0,0,0.35)",
          }}
        >
          <img src={data(arc, "image/png")} width={140} height={50} style={{ objectFit: "contain" }} />
          <span style={{ fontFamily: "Geist Mono", fontSize: 30, color: STONE }}>×</span>
          <img src={data(brandLogo, "image/png")} width={104} height={104} style={{ borderRadius: 999 }} />
        </div>

        {/* Brand name + package */}
        <div style={{ position: "absolute", left: 48, top: 192, display: "flex", flexDirection: "column", gap: 6 }}>
          {shaped ? (
            <img src={shaped.src} width={shaped.width} height={shaped.height} />
          ) : (
            <span style={{ fontFamily: "Hind Siliguri", fontSize: 64, color: "#ffffff", lineHeight: 1 }}>{name}</span>
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
            {`Work order · ${catalogName}`}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
        { name: "Hind Siliguri", data: hind, weight: 700, style: "normal" },
      ],
    },
  )
}
