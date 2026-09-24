import AnimatedButton from "@/components/animated-button"
import AsciiHands from "@/components/ascii-hands"
import RevealOnView from "@/components/reveal-on-view"
import SiteFooter from "@/components/site-footer"
import SiteHeader from "@/components/site-header"
import TodayDate from "@/components/today-date"
import TransitionLink from "@/components/transition-link"
import { projects } from "@/lib/projects"

// Wordmarks set in type until real client logos are supplied (then add `logo`)
const clients: { name: string; className: string; logo?: string }[] = [
  { name: "Gala", className: "font-serif text-[22px] tracking-tight" },
  { name: "আঙ্গনালয়", logo: "/clients/angonaloy.webp", className: "h-[21px] w-auto sm:h-[23px]" },
  { name: "Bengal Mart", logo: "/clients/bengal-mart.webp", className: "h-[34px] w-auto sm:h-[38px]" },
  { name: "Zair", logo: "/clients/zair.webp", className: "h-[17px] w-auto sm:h-[18px]" },
  { name: "ম্যাংগো লাভার", logo: "/clients/mango-lover.webp", className: "h-[27px] w-auto sm:h-[29px]" },
  {
    name: "Cober Collective",
    className: "font-[family-name:ui-serif,'New_York','Iowan_Old_Style','Apple_Garamond',Baskerville,Georgia,serif] text-[20px] tracking-[-0.01em]",
  },
  { name: "Listen Labs", logo: "/clients/listen-labs.webp", className: "h-[19px] w-auto sm:h-[21px]" },
  { name: "ARCADE", className: "font-mono text-[15px] font-bold tracking-widest" },
]

export default function Page() {
  return (
    <main className="frame relative overflow-x-clip bg-ink text-ivory">
      {/* HERO: one full screen, centred in the content column */}
      <section className="relative flex min-h-svh flex-col">
        <AsciiHands />
        <SiteHeader />

        <RevealOnView
          as="div"
          intensity="hero"
          staggerChildren
          className="relative z-10 mx-2 mt-40 mb-10 flex max-w-[964px] flex-none flex-col items-center justify-center rounded-none border border-ivory/25 px-3 pt-10 pb-0 text-center sm:mx-auto sm:mt-0 sm:mb-0 sm:w-full sm:flex-1 sm:border-0 sm:px-10 sm:pt-48 sm:pb-16 lg:pt-16"
        >
          {/* Headline: heavy Didone lowercase, a giant ampersand bridging the two lines,
              and a small italic aside in the gap (after Hole & Corner) */}
          <h1
            aria-label="The bespoke automation & development for your business"
            className="font-display -mx-3 mb-2 self-stretch font-black lowercase sm:mx-0 sm:self-auto leading-[0.82] tracking-[-0.035em] text-ivory sm:mb-3"
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
                <span className="relative block self-center text-[1.5em] leading-[0.62] tracking-[-0.06em] text-ivory/90 sm:my-0 sm:inline-block sm:text-[1.32em] sm:leading-[0]">&amp;</span>
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

          {/* Two-tone subline. Mobile: exactly two lines, edge to edge in the box */}
          <p className="-mx-3 mt-6 self-stretch text-[2.6vw] leading-[1.65] text-stone sm:mx-0 sm:mt-10 sm:max-w-[560px] sm:self-auto sm:text-balance sm:text-[14px] sm:leading-[1.6]">
            <span className="block whitespace-nowrap sm:inline sm:whitespace-normal">
              <span className="text-ivory">Websites, AI automation, and Software</span>&nbsp;— Arc Labs Corporation is
              built for{" "}
            </span>
            <span className="block whitespace-nowrap sm:inline sm:whitespace-normal">
              Bangladeshi businesses that want systems over manual, repetitive work.
            </span>
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

          {/* Signature + today's date sign off the box, bottom right (desktop: the frame-guide column) */}
          <div className="mt-8 flex flex-col items-end self-end sm:absolute sm:right-6 sm:bottom-6 sm:mt-0">
            <img
              src="/imgi_11_image.webp"
              alt="Signature"
              width={256}
              height={236}
              className="h-12 w-auto invert opacity-80 sm:h-16"
              draggable={false}
            />
            <TodayDate className="-mt-1 font-mono text-[10px] uppercase leading-none tracking-[0.2em] text-ivory/45 sm:text-[11px]" />
          </div>
        </RevealOnView>
      </section>

      <SiteFooter hideSignature />
    </main>
  )
}
