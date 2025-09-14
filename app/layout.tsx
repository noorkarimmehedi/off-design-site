import type React from "react"
import type { Metadata } from "next"
import "../styles/globals.css"

export const metadata: Metadata = {
  title: "Off-design: An Award-Winning MVP Studio",
  description:
    "AI-Powered MVP developer based in London. We help early-stage startups ship beautiful, usable software fast.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/new-favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon_02.webp" type="image/webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
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

:root {
  --font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --font-commit-mono: "Commit Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --font-ppmondwest: "PPMondwest", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}

.font-ppmondwest {
  font-family: 'PPMondwest', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji" !important;
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

html { font-family: var(--font-sans); }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
