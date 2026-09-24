import type React from "react"
import type { Metadata } from "next"
import "../styles/globals.css"
import SmoothScroll from "@/components/smooth-scroll"

const description =
  "Websites, AI automation, and software — Arc Labs Corporation is built for Bangladeshi businesses that want systems over manual, repetitive work."

// Absolute base for link-preview image URLs. Set NEXT_PUBLIC_SITE_URL to the live
// domain; on Vercel it falls back to the production URL automatically.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Arc Labs Corporation",
  description,
  openGraph: {
    type: "website",
    siteName: "Arc Labs Corporation",
    title: "Arc Labs Corporation — Bespoke automation & development",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arc Labs Corporation — Bespoke automation & development",
    description,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,900;1,400&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Commit+Mono:wght@400&display=swap" rel="stylesheet" />
        <style>{`
@font-face {
  font-family: 'PPMondwest';
  src: url('/ppmondwest-regular.otf');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'DepartureMono';
  src: url('/DepartureMono-Regular.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --font-commit-mono: "Commit Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --font-ppmondwest: "PPMondwest", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}

.font-ppmondwest {
  font-family: 'PPMondwest', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji" !important;
}

.font-script {
  font-family: 'Pinyon Script', 'Snell Roundhand', cursive !important;
  font-weight: 400 !important;
  letter-spacing: 0 !important;
}

.font-display {
  font-family: 'Playfair Display', 'Didot', 'Bodoni 72', serif !important;
}

.font-departuremono {
  font-family: 'DepartureMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
}

.animated-button {
  font-family: monospace;
  font-size: 0.875rem;
  text-transform: uppercase;
  position: relative;
  border: 0;
  line-height: 1;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.75);
  transition: all 0.26s ease-out;
}

.animated-button:focus-visible {
  outline: rgba(0, 0, 0, 0.3) dashed 1px;
  outline-offset: 0.5rem;
}

.animated-button:hover,
.animated-button:focus-visible {
  color: rgba(0, 0, 0, 1);
  background: rgba(0, 0, 0, 0.1);
}

/* Dark mode: same translucent chip, mirrored to ivory */
.dark .animated-button {
  background: rgba(237, 232, 223, 0.06);
  color: rgba(237, 232, 223, 0.8);
}

.dark .animated-button:hover,
.dark .animated-button:focus-visible {
  color: #ede8df;
  background: rgba(237, 232, 223, 0.12);
}

.dark .animated-button:focus-visible {
  outline-color: rgba(237, 232, 223, 0.4);
}

.animated-button .corners {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 3;
  overflow: hidden;
}

.animated-button .corners span {
  width: 12px;
  height: 12px;
  display: grid;
  place-items: center;
  position: absolute;
  transition: transform 0.26s 0.12s ease-out;
}

.animated-button .corners span svg {
  width: 100%;
  height: 100%;
  transition: transform 0.26s 0.12s ease-out;
}

.animated-button .corners span:nth-of-type(1) {
  top: -6px;
  left: -6px;
}

.animated-button .corners span:nth-of-type(2) {
  top: -6px;
  right: -6px;
}

.animated-button .corners span:nth-of-type(3) {
  bottom: -6px;
  right: -6px;
}

.animated-button .corners span:nth-of-type(4) {
  bottom: -6px;
  left: -6px;
}

.animated-button:hover .corners span:nth-of-type(1),
.animated-button:focus-visible .corners span:nth-of-type(1) {
  transform: translate(6px, 6px);
}

.animated-button:hover .corners span:nth-of-type(2),
.animated-button:focus-visible .corners span:nth-of-type(2) {
  transform: translate(-6px, 6px);
}

.animated-button:hover .corners span:nth-of-type(3),
.animated-button:focus-visible .corners span:nth-of-type(3) {
  transform: translate(-6px, -6px);
}

.animated-button:hover .corners span:nth-of-type(4),
.animated-button:focus-visible .corners span:nth-of-type(4) {
  transform: translate(6px, -6px);
}

.animated-button:hover .corners span svg,
.animated-button:focus-visible .corners span svg {
  transform: rotate(360deg);
}

html { font-family: var(--font-sans); background: #000000; }
        `}</style>
      </head>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  )
}
