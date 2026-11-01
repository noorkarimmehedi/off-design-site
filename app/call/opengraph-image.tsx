import { gardenCard, OG_SIZE } from "@/lib/og/garden"

// Link preview for /call
export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Book a 15 minute call with Arc Labs"

export default function CallPreview() {
  return gardenCard({
    lines: [
      { text: "Book a 15 minute call.", ink: true },
      { text: "And we’ll take it from there." },
    ],
    chips: ["15 min", "Free"],
  })
}
