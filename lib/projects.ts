export type Project = {
  title: string
  subtitle: string
  imageSrc: string
  isVideo?: boolean
  tags: string[]
  href: string
  indicatorText?: string
  priority?: boolean
  poster?: string
  gradientFrom: string
  gradientTo: string
}

export const projects: Project[] = [
  {
    title: "Screen Recording 02 — Featured Visual",
    subtitle: "New video card",
    imageSrc: "/screen_recording_02.mp4",
    isVideo: true,
    tags: ["Visual", "Video"],
    href: "#",
    indicatorText: "View the Project",
    priority: false, // Set to false for heavy videos
    gradientFrom: "#1f2937",
    gradientTo: "#10b981",
  },
  {
    title: "Screen Recording 03 — Featured Visual",
    subtitle: "New video card",
    imageSrc: "/screen_recording_03.mp4",
    isVideo: true,
    tags: ["Visual", "Video"],
    href: "#",
    indicatorText: "View the Project",
    priority: true,
    gradientFrom: "#111827",
    gradientTo: "#6b7280",
  },
  {
    title: "Prelude — Featured Visual",
    subtitle: "New photo card",
    imageSrc: "/angonaloy.webp",
    isVideo: false,
    tags: ["Visual", "UI/UX"],
    href: "https://angonaloy.shop/",
    indicatorText: "View the Project",
    priority: false,
    gradientFrom: "#111827",
    gradientTo: "#6b7280",
  },
  {
    title: "Screen Recording — Featured Visual",
    subtitle: "New video card",
    imageSrc: "/screen_recording_01.mp4",
    isVideo: true,
    tags: ["Visual", "Video"],
    href: "#",
    indicatorText: "View the Project",
    priority: false, // Set to false for heavy videos
    gradientFrom: "#0b132b",
    gradientTo: "#5bc0be",
  },
  {
    title: "Bengal Mart — Featured Visual",
    subtitle: "New photo card",
    imageSrc: "/bengal-mart.webp",
    isVideo: false,
    tags: ["Visual", "UI/UX"],
    href: "https://bengal-mart.shop/",
    indicatorText: "View the Project",
    priority: false,
    gradientFrom: "#111827",
    gradientTo: "#6b7280",
  },
  {
    title: "Zair — Featured Visual",
    subtitle: "New photo card",
    imageSrc: "/Zair.webp",
    isVideo: false,
    tags: ["Visual", "UI/UX"],
    href: "https://zairbd.com/",
    indicatorText: "View the Project",
    priority: false,
    gradientFrom: "#0b132b",
    gradientTo: "#5bc0be",
  },
  {
    title: "Hobbyshop — Featured Visual",
    subtitle: "New photo card",
    imageSrc: "/hobbyshop.webp",
    isVideo: false,
    tags: ["Visual", "UI/UX"],
    href: "https://hobbyshopbd.shop/",
    indicatorText: "View the Project",
    priority: false,
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

]
