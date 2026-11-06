import type { Viewport } from "next"
import CallIsland from "@/components/home/call-island"
import CursorDot from "@/components/home/cursor-dot"
import FaqList from "@/components/home/faq-list"
import HomeHeader from "@/components/home/home-header"
import SiteFoot from "@/components/home/site-foot"
import ScrollReveal from "@/components/home/scroll-reveal"
import ServiceTiles from "@/components/home/service-tiles"
import WorkRail from "@/components/home/work-rail"
import { clientLogos, concepts, fanImages } from "@/lib/home"
import { LiveShot } from "@/components/home/live-shot"
import { satoshi } from "@/lib/fonts"
import { AnnotatedText } from "@/components/ui/annotated-text"
import "./home.css"


// Paints the phone's status bar / browser bar in the hero grey
export const viewport: Viewport = { themeColor: "#ededed" }

const TALK = "Let's Talk"
const INDUSTRIES = ["FMCG", "food", "pharma", "agri", "manufacturing", "retail"]

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
            arc is a technology firm for Bangladesh&apos;s industries. We build websites, AI systems and custom software for{" "}
            {INDUSTRIES.map((name, i) => (
              <span key={name}>
                <AnnotatedText variant="highlight" delay={0.15 + i * 0.18} duration={0.5}>
                  {name}
                </AnnotatedText>
                {i < INDUSTRIES.length - 2 ? ", " : i === INDUSTRIES.length - 2 ? " and " : ""}
              </span>
            ))}{" "}
            teams, and we build each one around the way that team actually works.
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

      <section aria-labelledby="ah-whatif">
        <div className="svc-head">
          <h2 className="label rv" id="ah-whatif">
            What if
          </h2>
          <p className="rv">
            What if we designed and engineered the sites of brands Bangladesh uses every day? These are our own concepts,
            not commissioned work.
          </p>
        </div>
        <ul className="concepts rv">
          {concepts.map((c) => (
            <li key={c.name}>
              <a className="concept" href={c.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.name}, ${c.category} website concept (opens in a new tab)`}>
                {c.live === false ? (
                  <span className="shot">
                    <img src={c.image} alt="" width={1600} height={1000} loading="lazy" draggable={false} />
                  </span>
                ) : (
                  <LiveShot src={c.href} poster={c.image} />
                )}
                <span className="meta">
                  <span className="name">{c.name}</span>
                  <span className="tag">{c.category} ↗</span>
                </span>
                <span className="body">{c.body}</span>
              </a>
            </li>
          ))}
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

      <SiteFoot />

      <CallIsland />
      <CursorDot />
      <ScrollReveal />
    </main>
  )
}
