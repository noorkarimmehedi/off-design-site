import AnimatedButton from "@/components/animated-button"
import AsciiHands from "@/components/ascii-hands"
import FrameGuides from "@/components/frame-guides"
import RevealOnView from "@/components/reveal-on-view"
import SiteFooter from "@/components/site-footer"
import SiteHeader from "@/components/site-header"
import TransitionLink from "@/components/transition-link"
import { projects } from "@/lib/projects"

// Wordmarks set in type until real client logos are supplied (then add `logo`)
const clients: { name: string; className: string; logo?: string }[] = [
  { name: "Gala", className: "font-serif text-[22px] tracking-tight" },
  { name: "আঙ্গনালয়", logo: "/clients/angonaloy.webp", className: "h-[21px] w-auto sm:h-[23px]" },
  { name: "Bengal Mart", className: "text-[17px] font-bold tracking-tight" },
  { name: "Zair", logo: "/clients/zair.webp", className: "h-[17px] w-auto sm:h-[18px]" },
  { name: "ম্যাংগো লাভার", logo: "/clients/mango-lover.webp", className: "h-[27px] w-auto sm:h-[29px]" },
  { name: "A-Trips", className: "text-[18px] font-semibold italic" },
  { name: "Lucid", className: "font-serif text-[20px] italic" },
  { name: "ARCADE", className: "font-mono text-[15px] font-bold tracking-widest" },
]

export default function Page() {
  return (
    <main className="frame relative overflow-x-clip bg-ink text-ivory">
      <FrameGuides />

      {/* HERO: one full screen, centred between the frame guides */}
      <section className="relative flex min-h-svh flex-col">
        <AsciiHands />
        <SiteHeader />

        <RevealOnView
          as="div"
          intensity="hero"
          staggerChildren
          className="relative z-10 mx-3 mt-40 mb-10 flex max-w-[964px] flex-none flex-col items-center justify-center rounded-none border border-ivory/25 px-3 py-10 text-center sm:mx-auto sm:mt-0 sm:mb-0 sm:w-full sm:flex-1 sm:border-0 sm:px-10 sm:pt-48 sm:pb-16 lg:pt-16"
        >
          {/* Headline: heavy Didone lowercase, a giant ampersand bridging the two lines,
              and a small italic aside in the gap (after Hole & Corner) */}
          <h1
            aria-label="The bespoke automation & development for your business"
            className="font-display mb-2 font-black lowercase leading-[0.82] tracking-[-0.035em] text-ivory sm:mb-3"
          >
            <span aria-hidden="true" className="flex flex-col items-start">
              <span className="flex items-end gap-[0.35em] text-[14vw] sm:text-[96px] lg:text-[112px]">
                <span>automation</span>
                <span className="hidden pb-[0.32em] text-left font-display text-[13px] font-normal italic leading-[1.35] tracking-normal text-stone normal-case sm:block">
                  “The bespoke —
                  <br />
                  for your business.”
                  <br />
                  <span className="font-normal not-italic text-ivory/60">– Arc Labs Corporation</span>
                </span>
              </span>
              {/* Mobile: the ampersand gets its own line between the words; sm+: it leads "development" */}
              <span className="flex flex-col self-stretch whitespace-nowrap text-[14vw] sm:-mt-[0.02em] sm:block sm:self-end sm:pl-[0.5em] sm:text-[96px] lg:text-[112px]">
                <span className="relative block self-center text-[1.7em] leading-[0.7] tracking-[-0.06em] text-ivory/90 sm:my-0 sm:inline-block sm:text-[1.32em] sm:leading-[0]">&amp;</span>
                <span className="self-end">development</span>
              </span>
            </span>
          </h1>

          {/* Mobile: the aside sits under the headline */}
          <p className="mt-4 self-end pr-3 text-right font-display text-[12px] italic leading-[1.35] text-stone sm:hidden">
            “The bespoke — for your business.”
            <br />
            <span className="font-normal not-italic text-ivory/60">– Arc Labs Corporation</span>
          </p>

          {/* Two-tone subline */}
          <p className="mt-6 max-w-full text-balance text-[2.7vw] leading-[1.65] text-stone sm:mt-10 sm:max-w-[560px] sm:text-[14px] sm:leading-[1.6]">
            <span className="text-ivory">Websites, AI automation, and Software</span>&nbsp;— Arc Labs Corporation is
            built for Bangladeshi businesses that want systems over manual, repetitive work.
          </p>

          {/* CTAs (unchanged buttons) */}
          <div className="relative mt-8 flex items-center gap-2 sm:mt-12">
            <img
              src="/download.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -left-[150px] -top-[64px] hidden w-[130px] lg:block"
            />
            <AnimatedButton href="https://cal.com/noor-foumnf/15min">Book a Call</AnimatedButton>
            <AnimatedButton href="https://api.whatsapp.com/send/?phone=8801733670129">Chat with us</AnimatedButton>
          </div>

          {/* Link to the work page */}
          <TransitionLink
            href="/work"
            className="group mt-8 inline-flex items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-ivory/75 transition-colors hover:text-ivory sm:mt-10"
          >
            <span className="h-px w-6 bg-ivory/45 transition-all duration-300 group-hover:w-10 group-hover:bg-ivory" />
            Selected work — {String(projects.length).padStart(2, "0")}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </TransitionLink>

          {/* Clients */}
          <div className="mt-9 w-full max-w-[720px] sm:mt-12">
            <p className="text-[12px] text-stone">Brands we’ve built for</p>
            <ul className="mt-5 flex flex-wrap sm:mt-6 items-center justify-center gap-x-9 gap-y-4 text-stone">
              {clients.map((c) => (
                <li key={c.name} className={c.logo ? undefined : c.className}>
                  {c.logo ? <img src={c.logo} alt={c.name} className={c.className} /> : c.name}
                </li>
              ))}
            </ul>
          </div>
        </RevealOnView>
      </section>

      <SiteFooter />
    </main>
  )
}
