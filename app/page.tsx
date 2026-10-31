import type { Viewport } from "next"
import CallIsland from "@/components/home/call-island"
import CursorDot from "@/components/home/cursor-dot"
import FaqList from "@/components/home/faq-list"
import HomeHeader from "@/components/home/home-header"
import { RollLink } from "@/components/home/roll"
import ScrollReveal from "@/components/home/scroll-reveal"
import ServiceTiles from "@/components/home/service-tiles"
import WorkRail from "@/components/home/work-rail"
import { clientLogos, fanImages, WHATSAPP } from "@/lib/home"
import { satoshi } from "@/lib/fonts"
import "./home.css"


// Paints the phone's status bar / browser bar in the hero grey
export const viewport: Viewport = { themeColor: "#ededed" }

const TALK = "Let's Talk"

function Arrow({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 124 104" fill="none" stroke="currentColor" strokeWidth="13" aria-hidden="true">
      <path d="M0 52h112M66 6l46 46-46 46" />
    </svg>
  )
}

export default function Page() {
  return (
    <main className={`ah ${satoshi.variable}`}>
      <HomeHeader />

      <section className="hero" aria-label="Intro">
        <h1>
          <span className="line">
            <span>Bespoke software.</span>
          </span>
          <span className="line">
            <span>
              Engineered, Automated, Perfected by{" "}
              <img className="h-logo" src="/home/arc-gloss.webp" alt="arc" width={720} height={270} draggable={false} />
            </span>
          </span>
        </h1>
        <WorkRail />
      </section>

      <section className="split" id="about">
        <h2 className="label rv">About</h2>
        <div className="copy rv">
          <p>
            arc is an AI automation and software company for Bangladesh&apos;s industries. We work with FMCG, food, pharma,
            agri, manufacturing and retail teams that still run on spreadsheets, phone calls and paper, and we replace that
            manual work with systems that run on their own.
          </p>
          <p>
            We work as your product and engineering team. From the first idea to launch and beyond, we design, build and
            run custom software and AI automation that fits your business exactly.
          </p>
        </div>
      </section>

      <section aria-labelledby="ah-services">
        <div className="svc-head">
          <h2 className="label rv" id="ah-services">
            Services
          </h2>
          <p className="rv">Everything we build is made for one business. Here is what we design, build and automate.</p>
        </div>
        <ServiceTiles />
      </section>

      <section className="split" aria-labelledby="ah-clients">
        <h2 className="label rv" id="ah-clients">
          Clients
        </h2>
        <ul className="clients rv">
          {clientLogos.map((c) => {
            const mark =
              "logo" in c ? (
                <img
                  className="logo"
                  src={`/home/logos/${c.logo}.webp`}
                  alt={c.name}
                  style={{ ["--h" as string]: `${c.height}px` }}
                  draggable={false}
                />
              ) : (
                <span className={`wordmark ${c.wordmark}`}>{c.name}</span>
              )
            // On phones each client becomes a tile like the Services cards: name, logo, website.
            // Desktop hides the name and website and keeps the plain logo grid.
            const site = c.href ? new URL(c.href).hostname.replace(/^www\./, "") : null
            const body = (
              <>
                <span className="cl-name" aria-hidden="true">
                  {c.name}
                </span>
                <span className="cl-mark">{mark}</span>
                <span className="cl-site" aria-hidden="true">
                  {site ? `${site} ↗` : "Private work"}
                </span>
              </>
            )
            return (
              <li key={c.name}>
                {c.href ? (
                  <a className="cl" href={c.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.name} (opens in a new tab)`}>
                    {body}
                  </a>
                ) : (
                  <span className="cl mark">{body}</span>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="split" aria-labelledby="ah-faq">
        <h2 className="label rv" id="ah-faq">
          Frequently Asked Questions
        </h2>
        <FaqList />
      </section>

      {/* The template's card fan: a tilted box spinning on its vertical axis, eight blades hinged
          45° apart, each card turned another 45° about its own centre */}
      <div className="fan-box" aria-hidden="true">
        <div className="fan-tilt">
          <div className="fan-spin">
            {fanImages.map((src, i) => (
              <div className="blade" key={src} style={{ ["--a" as string]: `${i * 45}deg` }}>
                <div className="blade-card">
                  <img src={src} alt="" loading="lazy" draggable={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <a className="talk" href="/call" id="contact" aria-label="Let's talk: book a call">
        <Arrow className="a-in" />
        <span className="word" aria-hidden="true">
          {[...TALK].map((c, i) =>
            c === " " ? (
              " "
            ) : (
              <span className="ch" key={i} style={{ ["--i" as string]: i }}>
                {c}
              </span>
            ),
          )}
        </span>
        <Arrow className="a-out" />
      </a>

      <footer className="foot">
        <nav aria-label="Footer">
          <RollLink href="/">Home</RollLink>
          <RollLink href="/work">Work</RollLink>
          <RollLink href="#about">About</RollLink>
          <RollLink href="/call">Call</RollLink>
          <RollLink href="#contact">Contact</RollLink>
        </nav>
        <div className="col">
          <RollLink href="/call">Book a call ↗</RollLink>
        </div>
        <div className="col">
          <RollLink href={WHATSAPP}>Chat on WhatsApp ↗</RollLink>
        </div>
        <p className="fine l">© 2026 Arc Labs Corporation. All Rights Reserved.</p>
      </footer>

      <CallIsland />
      <CursorDot />
      <ScrollReveal />
    </main>
  )
}
