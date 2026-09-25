import AnimatedButton from "@/components/animated-button"
import AsciiHands from "@/components/ascii-hands"
import RevealOnView from "@/components/reveal-on-view"
import SiteFooter from "@/components/site-footer"
import SiteHeader from "@/components/site-header"
import TodayDate from "@/components/today-date"
import { AnnotatedText } from "@/components/ui/annotated-text"
import { clients } from "@/lib/clients"

export default function Page() {
  return (
    <main className="frame relative overflow-x-clip bg-ink text-ivory">
      {/* HERO: one full screen, centred in the content column */}
      <section className="relative flex min-h-svh flex-col">
        <SiteHeader />
        <AsciiHands />

        <RevealOnView
          as="div"
          intensity="hero"
          staggerChildren
          className="relative z-10 mx-2 mt-2 mb-10 flex max-w-[964px] flex-none flex-col items-center justify-center rounded-none border border-ivory/25 px-3 pt-10 pb-0 text-center sm:mx-auto sm:mt-0 sm:mb-0 sm:w-full sm:flex-1 sm:border-0 sm:px-10 sm:pt-48 sm:pb-16 lg:pt-16"
        >
          {/* Headline: heavy Didone lowercase, a giant ampersand bridging the two lines,
              and a small italic aside in the gap (after Hole & Corner) */}
          {/* Bottom padding keeps the "p" descender inside the box (the reveal's blur layer clips
              to it on iOS Safari); the negative margin cancels it so the layout doesn't move */}
          <h1
            aria-label="The bespoke automation & development for your business"
            className="font-display -mx-3 mb-[calc(0.5rem-4.5vw)] self-stretch pb-[4.5vw] font-black lowercase sm:mx-0 sm:-mb-[18px] sm:self-auto sm:pb-[30px] lg:-mb-[22px] lg:pb-[34px] leading-[0.82] tracking-[-0.035em] text-ivory"
          >
            <span aria-hidden="true" className="flex flex-col items-start">
              <span className="flex items-end gap-[0.35em] text-[14vw] sm:text-[96px] lg:text-[112px]">
                <span>automation</span>
                <span className="hidden pb-[0.32em] text-left font-display text-[13px] font-normal italic leading-[1.35] tracking-normal text-stone normal-case sm:block">
                  “The <AnnotatedText variant="circle" color="text-ivory" delay={1.2}>bespoke</AnnotatedText> —
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
            “The <AnnotatedText variant="circle" color="text-ivory" delay={1.2}>bespoke</AnnotatedText> — for your business.”
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
            <AnimatedButton href="/work" target="_self" rel="" className="whitespace-nowrap px-4 max-sm:!text-[12px] sm:px-6">Explore the Portfolio</AnimatedButton>
            <AnimatedButton href="/call" target="_self" rel="" className="whitespace-nowrap px-4 max-sm:!text-[12px] sm:px-6">Book a Call</AnimatedButton>
          </div>

          {/* WhatsApp chat link */}
          <a
            href="https://api.whatsapp.com/send/?phone=8801733670129"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-ivory/75 transition-colors hover:text-ivory sm:mt-10"
          >
            <span className="h-px w-6 bg-ivory/45 transition-all duration-300 group-hover:w-10 group-hover:bg-ivory" />
            Chat with us
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>

          {/* Clients */}
          <div className="mt-9 w-full max-w-[720px] sm:mt-12">
            <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-stone">
              <span>Brands we’ve built for</span>
              <span className="h-px flex-1 bg-line" />
              <span className="tabular-nums">{String(clients.length).padStart(2, "0")}</span>
            </div>
            {/* Hairline grid: the 1px gaps show the line colour through, so every cell gets an even rule */}
            <ul className="mt-4 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
              {clients.map((c, i) => (
                <li
                  key={c.name}
                  className="group relative flex h-[76px] items-center justify-center bg-ink px-4 text-stone transition-colors duration-300 hover:text-ivory sm:h-[96px]"
                >
                  <span className="absolute top-2 left-2.5 font-mono text-[9px] tabular-nums tracking-[0.15em] text-stone/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {c.logo ? (
                    <img
                      src={c.logo}
                      alt={c.name}
                      className={`${c.className} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
                    />
                  ) : (
                    <span className={c.className}>{c.name}</span>
                  )}
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
              className="h-12 w-auto opacity-80 dark:invert sm:h-16"
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
