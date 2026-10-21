// Wordmarks set in type until real client logos are supplied (then add `logo`).
// Order is the homepage bento's: the first three get the large tiles. Brands with an `href` link out.
// Logo sizes are widths, balanced by visual weight so wide and square marks read the same.
export type Client = { name: string; label: string; className: string; logo?: string; href?: string }

export const clients: Client[] = [
  {
    name: "Sera Khabar",
    label: "Sera Khabar",
    logo: "/clients/sera-khabar.webp",
    href: "https://www.serakhabar.com/",
    className: "w-[136px] sm:w-[177px]",
  },
  {
    name: "Zair",
    label: "Zair",
    logo: "/clients/zair.webp",
    href: "https://zairbd.com/",
    className: "w-[148px] sm:w-[192px]",
  },
  {
    name: "ম্যাংগো লাভার",
    label: "Mango Lover",
    logo: "/clients/mango-lover.webp",
    href: "https://www.mangolover.com.bd/",
    className: "w-[170px] sm:w-[220px]",
  },
  { name: "Gala", label: "Gala", className: "font-serif text-[28px] leading-none tracking-tight sm:text-[36px]" },
  { name: "আঙ্গনালয়", label: "Angonaloy", logo: "/clients/angonaloy.webp", className: "w-[114px] sm:w-[150px]" },
  { name: "Bengal Mart", label: "Bengal Mart", logo: "/clients/bengal-mart.webp", className: "w-[73px] sm:w-[95px]" },
  {
    name: "Cober Collective",
    label: "Cober Collective",
    className:
      "font-[family-name:ui-serif,'New_York','Iowan_Old_Style','Apple_Garamond',Baskerville,Georgia,serif] text-[22px] leading-none tracking-[-0.01em] sm:text-[28px]",
  },
  { name: "Listen Labs", label: "Listen Labs", logo: "/clients/listen-labs.webp", className: "w-[130px] sm:w-[170px]" },
]
