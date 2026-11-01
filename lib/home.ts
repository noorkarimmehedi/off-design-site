// Content for the homepage (app/page.tsx). Layout follows the Archlinea template; copy is Arc's.

import type { ShapeName } from "@/components/home/dither-mind"

// Where the hero film is served from. Set NEXT_PUBLIC_VIDEO_BASE to the Cloudflare URL
// (an R2 bucket on a custom domain, ending in "/") once sk-achar.mp4 is uploaded there.
export const VIDEO_BASE = process.env.NEXT_PUBLIC_VIDEO_BASE ?? "/home/work/"

export type WorkCard = {
  name: string
  href: string
  alt: string
  /** Image in /public/home/work, without extension */
  img?: string
  /** File name under VIDEO_BASE; `img` is then the poster */
  video?: string
  /** Landscape (5:4) card, wider than the 4:5 phone cards */
  wide?: boolean
}

export const work: WorkCard[] = [
  { name: "Sera Khabar", href: "https://www.serakhabar.com/", video: "sk-achar.mp4", img: "sk-achar-poster", alt: "Sera Khabar achar launch film" },
  { name: "House of Dhaka", href: "/work", img: "w-hod", alt: "House of Dhaka, Latest Drop page on a phone" },
  { name: "Mango Lover", href: "https://www.mangolover.com.bd/", img: "w-ml-desk", wide: true, alt: "Mango Lover categories and best sellers on desktop" },
  { name: "Sera Khabar", href: "https://www.serakhabar.com/", img: "w-sk-mobile", alt: "Sera Khabar best sellers on a phone" },
  { name: "Mango Lover", href: "https://www.mangolover.com.bd/", img: "w-ml-mobile", alt: "Mango Lover categories on a phone" },
  { name: "Sera Khabar", href: "https://www.serakhabar.com/", img: "w-sk-desk", wide: true, alt: "Sera Khabar date-palm jaggery hero on desktop" },
  { name: "Mango Lover", href: "https://www.mangolover.com.bd/", img: "w-ml-foot", wide: true, alt: "Mango Lover footer on desktop" },
]

// Each tile's dithered object steps through three shapes; the last is the result it lingers on.
export const services: { name: string; body: string; steps: [ShapeName, ShapeName, ShapeName] }[] = [
  { name: "Web Design & Development", steps: ["search", "browser", "laptop"], body: "Custom websites and online stores, designed and built from scratch for your brand, fast on every device." },
  { name: "Internal Tools & Dashboards", steps: ["gears", "calculator", "bars"], body: "Admin panels, dashboards and internal apps built around how your team already works." },
  { name: "Intelligent Automation", steps: ["sparkle", "flow", "check"], body: "AI agents and workflows that take repetitive work off your team, connected to the tools you already use." },
  { name: "Custom Software & ERP", steps: ["globe", "chat", "jigsaw"], body: "Bespoke web and mobile apps and business systems, designed, built and maintained for your company alone." },
  { name: "Brand & Product Design", steps: ["bulb", "star", "diamond"], body: "Identity, interfaces and product design, so your brand and your software look and feel like one." },
]

// Logo heights are tuned by eye so tall and wide marks carry the same weight.
export type ClientLogo =
  | { name: string; logo: string; height: number; href?: string }
  | { name: string; wordmark: "gala" | "cober"; href?: string }

export const clientLogos: ClientLogo[] = [
  { name: "Sera Khabar", logo: "sera-khabar", height: 56, href: "https://www.serakhabar.com/" },
  { name: "Zair", logo: "zair", height: 30, href: "https://zairbd.com/" },
  { name: "Mango Lover", logo: "mango-lover", height: 30, href: "https://www.mangolover.com.bd/" },
  { name: "Gala", wordmark: "gala" },
  { name: "Angonaloy", logo: "angonaloy", height: 30, href: "https://angonaloy.shop/" },
  { name: "Tar", logo: "tar", height: 64, href: "https://tar-storefront.tarbd.workers.dev/" },
  { name: "Cober Collective", wordmark: "cober" },
  { name: "Listen Labs", logo: "listen-labs", height: 22 },
]

export const faqs: { q: string; a: string }[] = [
  { q: "How does a project start?", a: "With a discovery call. We look at how the work runs today, where time and money leak, and which steps a system could take over. You get a written scope and a fixed quote before any build starts." },
  { q: "How long does a build take?", a: "A website usually takes a few weeks. Automations and internal tools ship in stages, so your team starts using the first part early while we build the rest." },
  { q: "Do you support the system after launch?", a: "Yes. Every build includes a support period for fixes, and most clients stay on a monthly plan for updates, monitoring and new features." },
  { q: "How is pricing decided?", a: "We price each scope as a fixed project, based on the number of workflows, integrations and screens involved. No hourly billing." },
  { q: "How do revisions and feedback work?", a: "You see working software at every stage. Feedback goes into one shared list, and each stage includes rounds of changes before we move on." },
]

export const fanImages = Array.from({ length: 8 }, (_, i) => `/home/fan/fan-${i + 1}.webp`)

export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "About", href: "#about" },
  { label: "Call", href: "/call" },
  { label: "Contact", href: "#contact" },
]

export const WHATSAPP = "https://api.whatsapp.com/send/?phone=8801733670129"
export const EMAIL = "hello@arc-bangladesh.com"
export const PHONE = "+880 1733-670129"
