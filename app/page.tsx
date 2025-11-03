import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FancyButton } from "@/components/ui/fancy-button"
import AnimatedButton from "@/components/animated-button"

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
      src: "/angonaloy.webp",
      caption: "A-Trips — AI Travel Planning Assistant",
      from: "#ff6b35",
      to: "#8b5cf6",
    },
    {
      src: "/images/lucid-dreams-app.webp",
      caption: "Lucid — Dream visualization platform",
      from: "#ff6b35",
      to: "#8b5cf6",
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
      title: "Prelude — Featured Visual",
      subtitle: "New photo card",
      imageSrc: "/angonaloy.webp",
      isVideo: false,
      tags: ["Visual", "UI/UX"],
      href: "https://angonaloy.shop/",
      indicatorText: "View the Project",
      priority: true,
      gradientFrom: "#111827",
      gradientTo: "#6b7280",
    },
    {
      title: "Portfolio — New 04",
      subtitle: "Selected work",
      imageSrc: "/new_portfolio_04.webp",
      tags: ["Portfolio", "UI/UX", "Web"],
      href: "#project-1",
      priority: false,
      gradientFrom: "#0b132b",
      gradientTo: "#5bc0be",
    },
    {
      title: "Portfolio — New 02",
      subtitle: "Selected work",
      imageSrc: "/new_portfolio_02.webp",
      tags: ["Portfolio", "UI/UX", "Web"],
      href: "#project-2",
      priority: false,
      gradientFrom: "#1f2937",
      gradientTo: "#10b981",
    },
    {
      title: "Portfolio — New 03",
      subtitle: "Selected work",
      imageSrc: "/new_portfolio_03.webp",
      tags: ["Portfolio", "UI/UX", "Web"],
      href: "#project-3",
      priority: false,
      gradientFrom: "#0f172a",
      gradientTo: "#8b5cf6",
    },
    {
      title: "Portfolio — New 01",
      subtitle: "Selected work",
      imageSrc: "/new_portfolio_01.webp",
      tags: ["Portfolio", "UI/UX", "Web"],
      href: "#project-4",
      priority: true,
      gradientFrom: "#111827",
      gradientTo: "#6b7280",
    },
    // Restored original first four projects (now positioned after the new four)
    {
      title: "A-Trips — AI Travel Planning Assistant",
      subtitle: "Conversational travel planning platform",
      imageSrc: "/images/a-trips-travel-app.webp",
      tags: ["AI", "Travel", "SaaS", "UI/UX"],
      href: "#project-5",
      priority: true,
      gradientFrom: "#ff6b35",
      gradientTo: "#8b5cf6",
    },
    {
      title: "Lucid — Dream Visualization Platform",
      subtitle: "Unlock visuals from your dreams",
      imageSrc: "/images/lucid-dreams-app.webp",
      tags: ["Wellness", "AI", "Mobile", "UI/UX"],
      href: "#project-6",
      priority: false,
      gradientFrom: "#ff6b35",
      gradientTo: "#8b5cf6",
    },
    {
      title: "Arcade — E‑commerce for streetwear",
      subtitle: "Mobile‑first storefront",
      imageSrc: "/x_video_05 copy.mp4",
      isVideo: true,
      tags: ["Commerce", "Mobile", "Brand"],
      href: "#project-7",
      priority: false,
      gradientFrom: "#0b132b",
      gradientTo: "#5bc0be",
    },
    {
      title: "CareConnect — Patient portal",
      subtitle: "Accessibility‑first UI",
      imageSrc: "/Bg_01.webp",
      isVideo: false,
      tags: ["A11y", "Web App", "Health"],
      href: "#project-8",
      priority: false,
      gradientFrom: "#0f172a",
      gradientTo: "#10b981",
    },
    {
      title: "Aurora — Creative portfolio",
      subtitle: "Motion & interaction design",
      imageSrc: "/imgi_2_image (1).webp",
      isVideo: false,
      tags: ["Portfolio", "Animation", "UI/UX"],
      href: "#project-5",
      priority: false,
      gradientFrom: "#1f2937",
      gradientTo: "#8b5cf6",
    },
    {
      title: "Hydra — AI assistant",
      subtitle: "Conversational product UX",
      imageSrc: "/my-image-02.png",
      tags: ["AI", "SaaS", "Product"],
      href: "#project-6",
      priority: false,
      gradientFrom: "#0b132b",
      gradientTo: "#10b981",
    },
    {
      title: "Nexus — Design System",
      subtitle: "Component library showcase",
      imageSrc: "/my-image-07.webp",
      tags: ["Design System", "UI/UX", "Documentation"],
      href: "#project-7",
      priority: false,
      gradientFrom: "#1e293b",
      gradientTo: "#3b82f6",
    },
    {
      title: "Atlas — Visual Showcase",
      subtitle: "Static visual composition",
      imageSrc: "/bg_02.webp",
      isVideo: false,
      tags: ["Visual", "UI/UX", "Web"],
      href: "#project-12",
      priority: false,
      gradientFrom: "#111827",
      gradientTo: "#6b7280",
    },
  ]

  return (
    <main className="bg-white text-neutral-900">
      {/* HERO: full-viewport row. Left is sticky; right scrolls internally. */}
      <section className="px-4 pt-4 pb-16 lg:pb-4">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
          {/* LEFT: sticky and full height, no cut off */}
          <aside className="lg:sticky lg:top-4 lg:h-[calc(100svh-2rem)]">
            <RevealOnView
              as="div"
              intensity="hero"
              className="sidebar-content relative flex h-full flex-col justify-between overflow-hidden border border-neutral-200 bg-neutral-50 p-6 sm:p-8"
              staggerChildren
            >
              {/* Wordmark */}
              <div className="mb-4 lg:mb-4 flex items-center gap-0.5 sm:gap-1 flex-wrap">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="text-2xl font-extrabold tracking-tight font-ppmondwest">Arc Lab Technology</div>
                  <div className="h-2 w-2 rounded-full bg-neutral-400" aria-hidden="true" />
                </div>
                <div className="text-[11px] sm:text-[11px] text-neutral-500 font-ppmondwest">
                  Bangladesh First AI-Powered IT Solution Company
                </div>
              </div>

              {/* Main content moved to bottom */}
              <div className="mt-30 lg:mt-14">
                {/* Headline with intro blur effect */}
                <AnimatedHeading
                  className="text-2xl font-black leading-[1.05] tracking-tight sm:text-3xl"
                  lines={["WE BUILD & SCALE", "BRANDS USING", "SHOPIFY & META"]}
                  lineClassNames={["", "text-[1.22em] sm:text-[1.28em]", "text-[1.12em] sm:text-[1.18em]"]}
                />

                <p className="mt-4 text-[11px] sm:text-[13px] text-neutral-600 font-ppmondwest">
                  <span className="block sm:inline">Arc Lab Technology is an AI-Powered IT solution based in Dhaka, helps early‑stage Businesses & Brands ship and scale fast.</span>
                </p>

                <div className="mt-2">
                  <img src="/download.svg" alt="Download" className="h-auto w-full max-w-[200px]" />
                </div>

                {/* CTAs */}
                <div className="mt-6 flex items-center gap-3">
                  <AnimatedButton href="https://cal.com/noor-foumnf/15min">
                    Book a Call
                  </AnimatedButton>
                  <AnimatedButton href="https://api.whatsapp.com/send/?phone=8801733670129">
                    Chat with us
                  </AnimatedButton>
                </div>

                {/* Feature sentence */}
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-[10px] sm:text-[11px] text-neutral-600">
                    Arc Lab Technology — a Bangladesh’s D2C e-commerce growth & Shopify Partner Based in Dhaka, Bangladesh. We help creators and brands launch, build, and scale D2C businesses using AI and Shopify.
                  </p>
                </div>

                {/* Social proof */}
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-[9px] sm:text-[11px] text-neutral-500 leading-relaxed">
                    "Arc Lab Technology" has—and still—partners with some of the most successful founders in the world after
                    only launching in 2024.
                  </p>
                </div>
                
                {/* Signature image */}
                <div className="mt-4">
                  <img src="/imgi_11_image.webp" alt="Signature" className="h-12 w-auto" />
                </div>

                {/* Copyright */}
                <div className="mt-3">
                  <p className="text-xs text-neutral-400">© Arc Lab Technology</p>
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
                isVideo={p.isVideo}
                tags={p.tags}
                href={p.href}
                indicatorText={(p as any).indicatorText}
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

      {/* Footer preview section */}
      <section>
        <div className="w-full bg-[#efefef] items-center justify-center h-full overflow-auto">
          {/* Sticky footer */}
          <div className="sticky z-0 bottom-0 left-0 w-full h-80 bg-white flex justify-center items-center">
            <div className="relative overflow-hidden w-full h-full flex justify-end px-12 text-center items-start py-12 text-[#ff5941]">
              <div className="flex flex-row space-x-12 sm:pace-x-16  md:space-x-24 text-sm sm:text-lg md:text-xl">
                <ul>
                  <li className="hover:underline cursor-pointer">Home</li>
                  <li className="hover:underline cursor-pointer">About</li>
                  <li>
                    <a href="https://api.whatsapp.com/send/?phone=8801733670129" target="_blank" rel="noopener noreferrer" className="hover:underline cursor-pointer">Whatsapp</a>
                  </li>
                </ul>
                <ul>
                  <li>
                    <a href="https://www.facebook.com/offdesign" target="_blank" rel="noopener noreferrer" className="hover:underline cursor-pointer">Facebook</a>
                  </li>
                  <li className="hover:underline cursor-pointer">Instagram</li>
                  <li className="hover:underline cursor-pointer">X (Twitter)</li>
                </ul>
              </div>
              <h2 className="absolute bottom-0 left-0  translate-y-1/3 sm:text-[192px]  text-[44px] text-[#ff5941] font-ppmondwest">
                Arc Lab Technology
              </h2>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
