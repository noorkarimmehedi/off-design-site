import AnimatedButton from "@/components/animated-button"
import AnimatedHeading from "@/components/animated-heading"
import AsciiHands from "@/components/ascii-hands"
import RevealOnView from "@/components/reveal-on-view"
import SiteFooter from "@/components/site-footer"
import SiteHeader from "@/components/site-header"
import TransitionLink from "@/components/transition-link"
import { projects } from "@/lib/projects"

// Placeholder wordmarks set in type until real client logos are supplied
const clients = [
  { name: "Gala", className: "font-serif text-[22px] tracking-tight" },
  { name: "Angonaloy", className: "font-ppmondwest text-[20px]" },
  { name: "Bengal Mart", className: "text-[17px] font-bold tracking-tight" },
  { name: "ZAIR", className: "text-[17px] font-black tracking-[0.2em]" },
  { name: "hobbyshop", className: "font-mono text-[16px] font-medium" },
  { name: "A-Trips", className: "text-[18px] font-semibold italic" },
  { name: "Lucid", className: "font-serif text-[20px] italic" },
  { name: "ARCADE", className: "font-mono text-[15px] font-bold tracking-widest" },
]

export default function Page() {
  return (
    <main className="frame relative overflow-x-clip bg-ink text-ivory">
      <div className="frame-guide frame-guide--left" aria-hidden="true" />
      <div className="frame-guide frame-guide--right" aria-hidden="true" />

      {/* HERO: one full screen, centred between the frame guides */}
      <section className="relative flex min-h-svh flex-col">
        <AsciiHands />
        <SiteHeader />

        <RevealOnView
          as="div"
          intensity="hero"
          staggerChildren
          className="relative z-10 mx-auto flex w-full max-w-[964px] flex-1 flex-col items-center justify-center px-6 pt-40 pb-16 text-center sm:px-10 lg:pt-16"
        >
          {/* Metadata row */}
          <div className="flex w-full max-w-[560px] items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone">
              Archive / 2024 / System
            </span>
            <div className="mx-4 hidden h-px flex-1 bg-line sm:block" />
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-stone sm:block">
              Approach — 01
            </span>
          </div>

          {/* Headline (copy unchanged) */}
          <div className="mt-8 space-y-2 sm:space-y-3">
            <AnimatedHeading
              className="text-[26px] font-black uppercase leading-[0.95] tracking-tighter sm:text-[48px] lg:text-[60px]"
              lines={["THE BESPOKE DESIGN"]}
              lineClassNames={["whitespace-nowrap"]}
            />
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-baseline sm:gap-4">
              <AnimatedHeading
                className="text-[26px] font-black uppercase leading-[0.95] tracking-tighter text-ivory/90 sm:text-[48px] lg:text-[60px]"
                lines={["& DEVELOPMENT"]}
                lineClassNames={["whitespace-nowrap"]}
              />
              <div className="h-px w-12 bg-line sm:h-[28px] sm:w-px" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-stone sm:text-[10px]">
                Core Service / Web
              </span>
            </div>
            <div className="pt-1 sm:pt-2">
              <AnimatedHeading
                className="text-[26px] font-black uppercase leading-[0.95] tracking-tighter text-stone sm:text-[48px] lg:text-[60px]"
                lines={["FOR YOUR BUSINESS"]}
                lineClassNames={["whitespace-nowrap"]}
              />
            </div>
          </div>

          {/* Two-tone subline */}
          <p className="mt-6 max-w-[500px] text-pretty text-[14px] leading-[1.5] text-stone sm:text-[16px]">
            <span className="text-ivory">Websites, AI automation, and Software</span> — Arc Labs Corporation is
            built for Bangladeshi businesses that want systems over manual, repetitive work.
          </p>

          {/* CTAs (unchanged buttons) */}
          <div className="relative mt-7 flex items-center gap-2">
            <img
              src="/download.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -left-[150px] -top-[70px] hidden w-[130px] lg:block"
            />
            <AnimatedButton href="https://cal.com/noor-foumnf/15min">Book a Call</AnimatedButton>
            <AnimatedButton href="https://api.whatsapp.com/send/?phone=8801733670129">Chat with us</AnimatedButton>
          </div>

          {/* Link to the work page */}
          <TransitionLink
            href="/work"
            className="group mt-8 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-stone transition-colors hover:text-ivory"
          >
            <span className="h-px w-6 bg-stone/50 transition-all duration-300 group-hover:w-10 group-hover:bg-[#ff5941]" />
            Selected work — {String(projects.length).padStart(2, "0")}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </TransitionLink>

          {/* Clients */}
          <div className="mt-14 w-full max-w-[720px]">
            <p className="text-[12px] text-stone">Brands we’ve built for</p>
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-9 gap-y-4 text-stone">
              {clients.map((c) => (
                <li key={c.name} className={c.className}>
                  {c.name}
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
