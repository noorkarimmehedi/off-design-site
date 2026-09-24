import type { Metadata } from "next"
import AnimatedHeading from "@/components/animated-heading"
import ProjectCard from "@/components/project-card"
import ScrollScale from "@/components/scroll-scale"
import SiteFooter from "@/components/site-footer"
import SiteHeader from "@/components/site-header"
import TransitionLink from "@/components/transition-link"
import { Testimonial } from "@/components/ui/design-testimonial"
import { projects } from "@/lib/projects"

export const metadata: Metadata = {
  title: "Selected Work — Arc Labs Corporation",
}

export default function WorkPage() {
  const count = String(projects.length).padStart(2, "0")

  return (
    <main className="frame relative overflow-x-clip bg-ink text-ivory">
      <div className="frame-guide frame-guide--left" aria-hidden="true" />
      <div className="frame-guide frame-guide--right" aria-hidden="true" />

      <SiteHeader
        left={
          <TransitionLink href="/" className="group inline-flex items-center gap-2 transition-colors hover:text-ivory">
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Back
          </TransitionLink>
        }
      />

      {/* Intro */}
      <section className="relative z-10 mx-auto w-full max-w-[964px] px-6 pt-24 pb-12 text-center sm:px-10 sm:pt-32">
        <div className="mx-auto flex max-w-[560px] items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone">Archive / Work</span>
          <div className="mx-4 hidden h-px flex-1 bg-line sm:block" />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-stone sm:block">
            Index — {count}
          </span>
        </div>
        <AnimatedHeading
          className="mt-8 text-[34px] font-black uppercase leading-[0.95] tracking-tighter sm:text-[48px] lg:text-[60px]"
          lines={["SELECTED WORK"]}
          lineClassNames={["whitespace-nowrap"]}
        />
        <p className="mx-auto mt-5 max-w-[420px] text-[14px] leading-[1.5] text-stone sm:text-[16px]">
          <span className="text-ivory">Websites, stores and products</span> we’ve designed and built for brands
          in Bangladesh and beyond
        </p>
      </section>

      {/* Projects */}
      <section className="relative z-10 mx-auto w-full max-w-[964px] px-4 pb-16 sm:px-8">
        <div className="space-y-6">
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
              Arc Lab Technology — a Bangladesh’s D2C e-commerce growth & Shopify Partner Based in Dhaka, Bangladesh. We
              help creators and brands launch, build, and scale D2C businesses using AI and Shopify.
            </p>
            <img src="/imgi_11_image.webp" alt="Signature" className="h-10 w-auto invert opacity-80" />
            <p className="text-xs text-stone">© Arc Lab Technology</p>
          </div>
          <Testimonial />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
