import type { Metadata, Viewport } from "next"
import CalEmbed from "@/components/cal-embed"
import DhakaTime from "@/components/home/dhaka-time"
import FaqList from "@/components/home/faq-list"
import HomeHeader from "@/components/home/home-header"
import { RollLink } from "@/components/home/roll"
import ScrollReveal from "@/components/home/scroll-reveal"
import { satoshi } from "@/lib/fonts"
import { callFaqs, callSteps, WHATSAPP } from "@/lib/home"
import "../home.css"
import "./call.css"

export const metadata: Metadata = {
  title: "Book a call — Arc Labs & Co.",
}

// Paints the phone's status bar / browser bar in the page grey, as on the homepage
export const viewport: Viewport = { themeColor: "#ededed" }

// Book a discovery call, in the homepage's shell: hero line, a label/content intro, the live
// Cal.com booker from the centre line, then what happens next and a short FAQ.
export default function CallPage() {
  return (
    <main className={`ah cp ${satoshi.variable}`}>
      <HomeHeader />

      <section className="cp-hero" aria-label="Book a call">
        <h1>
          <span className="line">
            <span className="ink">Book a 15 minute call.</span>
          </span>
          <span className="line">
            <span>And we’ll take it from there.</span>
          </span>
        </h1>
      </section>
      <div className="hero-foot">
        <span className="label">Discovery call</span>
        <div>
          <p>
            Tell us how the work runs today.{" "}
            <span className="m">We’ll come back with where a system could take over, and a fixed quote.</span>
          </p>
          <div className="facts">
            <span className="chip">15 min</span>
            <span className="chip">Free</span>
            <span className="chip">
              <span className="dot" aria-hidden="true" />
              <span>
                Dhaka <DhakaTime />
              </span>
            </span>
          </div>
        </div>
      </div>

      <section className="split" aria-labelledby="cp-pick">
        <h2 className="label rv" id="cp-pick">
          Pick a time
        </h2>
        <div className="booker rv">
          <CalEmbed calLink="noor-foumnf/15min" theme="light" brand="#222222" className="cal" />
        </div>
      </section>

      <section className="split" aria-labelledby="cp-next">
        <h2 className="label rv" id="cp-next">
          What happens next
        </h2>
        <ol className="steps rv">
          {callSteps.map((s, i) => (
            <li key={s.title}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                {s.title}
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="split" aria-labelledby="cp-faq">
        <h2 className="label rv" id="cp-faq">
          Before you book
        </h2>
        <FaqList items={callFaqs} id="cp" />
      </section>

      <footer className="foot">
        <nav aria-label="Footer">
          <RollLink href="/">Home</RollLink>
          <RollLink href="/work">Work</RollLink>
          <RollLink href="/#about">About</RollLink>
          <RollLink href="/call">Call</RollLink>
          <RollLink href="/#contact">Contact</RollLink>
        </nav>
        <div className="col">
          <RollLink href={WHATSAPP}>Chat on WhatsApp ↗</RollLink>
        </div>
        <div className="col">
          <RollLink href="/work">Portfolio ↗</RollLink>
        </div>
        <p className="fine l">© 2026 Arc Labs Corporation. All Rights Reserved.</p>
      </footer>
      <ScrollReveal />
    </main>
  )
}
