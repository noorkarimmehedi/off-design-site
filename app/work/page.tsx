import type { Metadata } from "next"
import CountUp from "@/components/count-up"
import FrameGuides from "@/components/frame-guides"
import LiveEmbed from "@/components/live-embed"
import ProjectCard from "@/components/project-card"
import RevealOnView from "@/components/reveal-on-view"
import ScrollScale from "@/components/scroll-scale"
import SiteFooter from "@/components/site-footer"
import SiteHeader from "@/components/site-header"
import TodayDate from "@/components/today-date"
import TransitionLink from "@/components/transition-link"
import { Testimonial } from "@/components/ui/design-testimonial"
import { clients } from "@/lib/clients"
import { projects } from "@/lib/projects"

export const metadata: Metadata = {
  title: "Selected Work — Arc Labs & Co.",
}

export default function WorkPage() {
  const count = String(projects.length).padStart(2, "0")

  return (
    <main className="frame relative overflow-x-clip bg-ink text-ivory">
      <FrameGuides />

      <SiteHeader
        left={
          <TransitionLink href="/" className="group inline-flex items-center gap-2 transition-colors hover:text-ivory">
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Back
          </TransitionLink>
        }
      />

      {/* Intro: a counted-up stat in the frame's red, a two-tone subline, then a crosshair rule */}
      <RevealOnView
        as="section"
        intensity="hero"
        staggerChildren
        className="relative z-10 mx-auto w-full max-w-[964px] px-2 pt-24 pb-10 text-center sm:px-10 sm:pt-32"
      >
        <div className="mx-auto flex max-w-[560px] items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone">Archive / Work</span>
          <div className="mx-4 hidden h-px flex-1 bg-line sm:block" />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-stone sm:block">
            Index — {count}
          </span>
        </div>
        <h1 className="mt-8 text-[34px] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-[50px]">
          <CountUp value={projects.length} className="text-[var(--frame-accent)]" /> projects shipped
          <br />
          for {clients.length}+ brands
        </h1>
        <p className="mx-auto mt-4 max-w-[420px] text-[14px] leading-[1.45] text-ivory sm:text-[15px]">
          We build websites, systems, AI and automation
          <span className="block text-stone">for businesses in Bangladesh and beyond</span>
        </p>
        <div className="relative mt-14 h-px w-full bg-line sm:mt-20" aria-hidden="true">
          {["left-0 -translate-x-1/2", "right-0 translate-x-1/2"].map((side) => (
            <span key={side} className={`absolute top-1/2 size-[11px] -translate-y-1/2 ${side}`}>
              <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-ivory/30" />
              <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-ivory/30" />
            </span>
          ))}
        </div>
      </RevealOnView>

      {/* Projects */}
      <section className="relative z-10 mx-auto w-full max-w-[964px] px-1 pb-16 sm:px-8">
        <div className="space-y-6">
          <ScrollScale>
            <LiveEmbed url="https://www.serakhabar.com/step/am-sotto-achar" title="Sera Khabar — Am Sotto Achar" />
          </ScrollScale>
          <ScrollScale>
            <LiveEmbed url="https://www.mangolover.com.bd/step/homemade-pumpkin-bori" title="Mango Lover — Homemade Pumpkin Bori" />
          </ScrollScale>
          <ScrollScale>
            <LiveEmbed url="https://www.mangolover.com.bd/step/katimon-mango" title="Mango Lover — Katimon Mango" />
          </ScrollScale>
          {projects.map((p, idx) => (
            <ScrollScale key={`${p.title}-${idx}`}>
              <ProjectCard
                title={p.title}
                subtitle={p.subtitle}
                imageSrc={p.imageSrc}
                isVideo={p.isVideo}
                tags={p.tags}
                href={p.href}
                indicatorText={p.indicatorText}
                priority={idx === 0 || p.priority}
                gradientFrom={p.gradientFrom}
                gradientTo={p.gradientTo}
                imageContainerClassName="lg:h-full"
                containerClassName="lg:aspect-[16/10]"
                poster={p.poster}
              />
            </ScrollScale>
          ))}
        </div>

        {/* About + social proof */}
        <div className="mt-16 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
          <div className="space-y-4">
            <p className="text-[12px] leading-relaxed text-stone">
              <span className="text-ivory">Websites, AI automation, and Software</span>&nbsp;— Arc Labs Corporation is
              built for Bangladeshi businesses that want systems over manual, repetitive work.
            </p>
            {/* Signature + today's date, as the home page signs off its hero */}
            <div className="flex flex-col items-start">
              <img
                src="/imgi_11_image.webp"
                alt="Signature"
                width={256}
                height={236}
                className="h-12 w-auto opacity-80 dark:invert sm:h-14"
                draggable={false}
              />
              <TodayDate className="-mt-1 font-mono text-[10px] uppercase leading-none tracking-[0.2em] text-ivory/45" />
            </div>
            <p className="text-xs text-stone">© Arc Labs Corporation</p>
          </div>
          <Testimonial />
        </div>
      </section>

      <SiteFooter hideSignature />
    </main>
  )
}
