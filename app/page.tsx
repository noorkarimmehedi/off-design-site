import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FancyButton } from "@/components/ui/fancy-button"

import ProjectCard from "@/components/project-card"
import AnimatedHeading from "@/components/animated-heading"
import RevealOnView from "@/components/reveal-on-view"

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63z" />
  </svg>
)

// Custom Play Arrow Component
const PlayArrow = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M6 9.33017V14.6702C6 17.9902 8.35 19.3402 11.22 17.6902L12.5 16.9502C12.81 16.7702 13 16.4402 13 16.0802V7.92017C13 7.56017 12.81 7.23017 12.5 7.05017L11.22 6.31017C8.35 4.66017 6 6.01017 6 9.33017Z" />
    <path d="M14 8.78957V15.2196C14 15.6096 14.42 15.8496 14.75 15.6496L15.85 15.0096C18.72 13.3596 18.72 10.6396 15.85 8.98957L14.75 8.34957C14.42 8.15957 14 8.39957 14 8.78957Z" />
  </svg>
)

export default function Page() {
  const heroImages = [
    {
      src: "/images/portfolio-sample.png",
      caption: "Walletly — Mobile banking overview",
      from: "#0f172a",
      to: "#6d28d9",
    },
    {
      src: "/placeholder.svg?height=900&width=1600",
      caption: "Nimbus — SaaS analytics dashboard",
      from: "#111827",
      to: "#2563eb",
    },
    {
      src: "/placeholder.svg?height=900&width=1600",
      caption: "Arcade — E‑commerce storefront",
      from: "#0b132b",
      to: "#5bc0be",
    },
  ]

  const projects = [
    {
      title: "Walletly — Multi‑account mobile banking",
      subtitle: "End‑to‑end product design",
      imageSrc: "/images/1 (1).webp",
      tags: ["Mobile", "Fintech", "UI/UX"],
      href: "#project-1",
      priority: true,
      gradientFrom: "#0f172a",
      gradientTo: "#6d28d9",
    },
    {
      title: "Nimbus — SaaS analytics",
      subtitle: "Design system & web app",
      imageSrc: "/images/1 (2).webp",
      tags: ["SaaS", "Design System", "Web"],
      href: "#project-2",
      priority: false,
      gradientFrom: "#111827",
      gradientTo: "#2563eb",
    },
    {
      title: "Arcade — E‑commerce for streetwear",
      subtitle: "Mobile‑first storefront",
      imageSrc: "/images/1 (3).webp",
      tags: ["Commerce", "Mobile", "Brand"],
      href: "#project-3",
      priority: false,
      gradientFrom: "#0b132b",
      gradientTo: "#5bc0be",
    },
    {
      title: "CareConnect — Patient portal",
      subtitle: "Accessibility‑first UI",
      imageSrc: "/images/1 (4).webp",
      tags: ["A11y", "Web App", "Health"],
      href: "#project-4",
      priority: false,
      gradientFrom: "#0f172a",
      gradientTo: "#10b981",
    },
    {
      title: "Aurora — Creative portfolio",
      subtitle: "Motion & interaction design",
      imageSrc: "/images/1 (5).webp",
      tags: ["Portfolio", "Animation", "UI/UX"],
      href: "#project-5",
      priority: false,
      gradientFrom: "#1f2937",
      gradientTo: "#8b5cf6",
    },
    {
      title: "Hydra — AI assistant",
      subtitle: "Conversational product UX",
      imageSrc: "/images/1 (6).webp",
      tags: ["AI", "SaaS", "Product"],
      href: "#project-6",
      priority: false,
      gradientFrom: "#0b132b",
      gradientTo: "#10b981",
    },
  ]

  return (
    <main className="bg-neutral-950 text-white">
      {/* HERO: full-viewport row. Left is sticky; right scrolls internally. */}
      <section className="px-4 pt-4 pb-16 lg:pb-4">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
          {/* LEFT: sticky and full height, no cut off */}
          <aside className="lg:sticky lg:top-4 lg:h-[calc(100svh-2rem)]">
            <RevealOnView
              as="div"
              intensity="hero"
              className="sidebar-content relative flex h-full flex-col justify-between overflow-hidden border border-white/10 bg-black p-6 sm:p-8"
              staggerChildren
            >
              {/* Wordmark */}
              <div className="mb-20 lg:mb-20 flex items-center gap-2">
                <div className="text-2xl font-extrabold tracking-tight">off-design</div>
                <div className="h-2 w-2 rounded-full bg-white/60" aria-hidden="true" />
              </div>

              {/* Main content moved to bottom */}
              <div className="mt-30 lg:mt-0">
                {/* Headline with intro blur effect */}
                <AnimatedHeading
                  className="text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl"
                  lines={["WE DESIGN & BUILD", "PRODUCTS USING", "LOVABLE & CURSOR"]}
                />

                <p className="mt-4 text-[10px] sm:text-xs text-white/70">
                  <span className="block sm:inline">Off-Design is a AI-Powered MVP developer based in London.</span>
                  <span className="block sm:inline sm:ml-1">
                    We help early‑stage startups ship beautiful, usable software fast.
                  </span>
                </p>

                {/* CTAs */}
                <div className="mt-6 flex items-center gap-3">
                  <FancyButton asChild size="large" variant="neutral">
                    <Link href="https://cal.com/noor-foumnf/15min" target="_blank" rel="noopener noreferrer">
                      Book a Call
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </FancyButton>
                  <FancyButton asChild size="large" variant="neutral">
                    <Link
                      href="https://api.whatsapp.com/send/?phone=8801733670129"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat
                      <WhatsAppIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </FancyButton>
                </div>

                {/* Pricing */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-2 text-2xl font-black">
                    <span className="text-white/40 line-through">$5000</span>
                    <span className="text-white">$3099</span>
                    <div className="flex items-center gap-1 ml-2">
                      <PlayArrow className="h-5 w-5 text-white/60" />
                      <span
                        className="text-sm text-white/60"
                        style={{
                          fontFamily: '"Kalam", "Caveat", "Dancing Script", cursive',
                          transform: "rotate(-2deg)",
                          fontWeight: "400",
                        }}
                      >
                        (Launching offer)
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-white/70">
                    <div>• Web application</div>
                    <div>• Modern, scalable tech stack</div>
                    <div>• Personalized, founder-led development</div>
                    <div>• Regular updates and transparent process</div>
                    <div>• Complete MVP development in 3-4 weeks</div>
                    <div>• Seamless integrations (payments, auth, etc.)</div>
                  </div>
                </div>

                {/* Social proof */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-[10px] sm:text-xs text-white/60 leading-relaxed">
                    "Off-design" has—and still—partners with some of the most successful founders in the world after
                    only launching in 2024.
                  </p>
                </div>

                {/* Copyright */}
                <div className="mt-1">
                  <p className="text-xs text-white/40">© Off-design</p>
                </div>
              </div>
            </RevealOnView>
          </aside>

          {/* RIGHT: simplified, no internal card or horizontal carousel */}
          <div className="space-y-4">
            {projects.map((p, idx) => (
              <ProjectCard
                key={p.title}
                title={p.title}
                subtitle={p.subtitle}
                imageSrc={p.imageSrc}
                tags={p.tags}
                href={p.href}
                priority={p.priority}
                gradientFrom={p.gradientFrom}
                gradientTo={p.gradientTo}
                imageContainerClassName="lg:h-full"
                containerClassName="lg:h-[calc(100svh-2rem)]"
                revealDelay={idx * 0.06}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
