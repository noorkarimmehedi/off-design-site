// Wordmarks set in type until real client logos are supplied (then add `logo`).
// `featured` brands lead the homepage at full size and link out; the rest sit in a smaller row beneath.
// Logo sizes are widths, balanced by visual weight so wide and square marks read the same.
export type Client = { name: string; label: string; className: string; logo?: string; href?: string; featured?: boolean }

export const clients: Client[] = [
  {
    name: "Sera Khabar",
    label: "Sera Khabar",
    logo: "/clients/sera-khabar.webp",
    href: "https://www.serakhabar.com/",
    featured: true,
    className: "w-[116px] sm:w-[184px]",
  },
  {
    name: "Zair",
    label: "Zair",
    logo: "/clients/zair.webp",
    href: "https://zairbd.com/",
    featured: true,
    className: "w-[126px] sm:w-[200px]",
  },
  {
    name: "ম্যাংগো লাভার",
    label: "Mango Lover",
    logo: "/clients/mango-lover.webp",
    href: "https://www.mangolover.com.bd/",
    featured: true,
    className: "w-[170px] sm:w-[270px]",
  },
  { name: "Gala", label: "Gala", className: "font-serif text-[22px] leading-none tracking-tight sm:text-[30px]" },
  { name: "আঙ্গনালয়", label: "Angonaloy", logo: "/clients/angonaloy.webp", className: "w-[88px] sm:w-[119px]" },
  { name: "Bengal Mart", label: "Bengal Mart", logo: "/clients/bengal-mart.webp", className: "w-[56px] sm:w-[76px]" },
  {
    name: "Cober Collective",
    label: "Cober Collective",
    className:
      "font-[family-name:ui-serif,'New_York','Iowan_Old_Style','Apple_Garamond',Baskerville,Georgia,serif] text-[17px] leading-none tracking-[-0.01em] sm:text-[23px]",
  },
  { name: "Listen Labs", label: "Listen Labs", logo: "/clients/listen-labs.webp", className: "w-[116px] sm:w-[157px]" },
]
