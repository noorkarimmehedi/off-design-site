import { WHATSAPP } from "@/lib/home"
import { satoshi } from "@/lib/fonts"
import FooterCurtain from "./footer-curtain"
import PressedMark from "./pressed-mark"
import "./site-foot.css"

// The site-wide footer: small print over the debossed arc wordmark, revealed like a curtain.
// Carries its own palette and font so it looks the same on every page, light or dark.
export default function SiteFoot({ className = "" }: { className?: string }) {
  return (
    <FooterCurtain className={`sf ${satoshi.variable} ${className}`}>
      <div className="sf-grid">
        <p className="sf-credit">
          arc is a technology firm for Bangladesh&apos;s industries, based in Dhaka. The sites under What if are our own
          concepts and aren&apos;t affiliated with Ghorer Bazar, Gentleman&apos;s Wardrobe or SSLCOMMERZ. If one is yours
          and you&apos;d like it taken down,{" "}
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            message us on WhatsApp
          </a>
          .
        </p>
        <footer className="sf-legal">
          <nav className="sf-links" aria-label="Footer">
            <a href="/">Home</a>
            <a href="/skills">Skills</a>
            <a href="/#about">About</a>
            <a href="/call">Call</a>
            <a href="/#contact">Contact</a>
          </nav>
          <p className="sf-copy">© 2026 Arc Labs Corporation. All rights reserved.</p>
        </footer>
      </div>
      <div className="sf-mark">
        <PressedMark />
      </div>
    </FooterCurtain>
  )
}
