import type { Metadata } from "next"
import AsciiHands from "@/components/ascii-hands"
import CalEmbed from "@/components/cal-embed"
import RevealOnView from "@/components/reveal-on-view"
import SiteHeader from "@/components/site-header"
import TransitionLink from "@/components/transition-link"

export const metadata: Metadata = {
  title: "Book a call — Arc Labs Corporation",
}

export default function CallPage() {
  return (
    <main className="frame relative min-h-svh overflow-x-clip bg-ink text-ivory">
      <SiteHeader
        left={
          <TransitionLink href="/" className="group inline-flex items-center gap-2 transition-colors hover:text-ivory">
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Back
          </TransitionLink>
        }
      />
      <AsciiHands />

      <RevealOnView
        as="section"
        intensity="hero"
        staggerChildren
        className="relative z-10 mx-auto w-full max-w-[964px] px-2 pt-10 pb-24 sm:px-10 sm:pt-24"
      >
        {/* Two-tone headline: the ask in the frame's red, the promise in the foreground */}
        <h1 className="text-center text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[48px]">
          <span className="block text-[var(--frame-accent)]">Book a 15 min call.</span>
          <span className="block">And we’ll reach out.</span>
        </h1>

        <CalEmbed calLink="noor-foumnf/15min" className="mt-10 min-h-[560px] w-full overflow-hidden sm:mt-14" />
      </RevealOnView>
    </main>
  )
}
