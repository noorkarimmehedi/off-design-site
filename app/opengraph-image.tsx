import { gardenCard, OG_SIZE } from "@/lib/og/garden"

// Site-wide link preview: the garden card with the arc logo and the tagline
export const size = OG_SIZE
export const contentType = "image/png"
export const alt =
  "Arc Labs Corporation — The bespoke automation & development for your business. Websites, AI automation, and software built for Bangladeshi businesses."

export default function SitePreview() {
  return gardenCard({
    title: "Bespoke automation & development for your business",
    subtitle: "Websites · AI automation · Software",
  })
}
