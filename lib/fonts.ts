import localFont from "next/font/local"

// Satoshi, self-hosted. Used by the homepage and the site-wide chat island.
export const satoshi = localFont({
  src: [
    { path: "../app/fonts/satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/satoshi-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
})

// TWK Lausanne (Weltkern), self-hosted. Weights 400 and 600.
export const lausanne = localFont({
  src: [
    { path: "../app/fonts/TWKLausanne-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/TWKLausanne-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-lausanne",
  display: "swap",
})
