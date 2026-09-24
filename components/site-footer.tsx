import TransitionLink from "@/components/transition-link"

const linkClass = "hover:underline underline-offset-4"

export default function SiteFooter() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-neutral-200 bg-white text-[#ff5941]">
      <div className="flex flex-col gap-10 px-6 pt-10 pb-8 sm:h-80 sm:flex-row sm:items-start sm:justify-between sm:px-12 sm:pt-12 sm:pb-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 sm:order-2 sm:hidden">
          Dhaka, Bangladesh
        </p>

        <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-base sm:order-2 sm:ml-auto sm:flex sm:gap-24 sm:text-xl">
          <ul className="space-y-1.5 sm:space-y-0">
            <li>
              <TransitionLink href="/" className={linkClass}>Home</TransitionLink>
            </li>
            <li>
              <TransitionLink href="/work" className={linkClass}>Work</TransitionLink>
            </li>
            <li>
              <a href="https://api.whatsapp.com/send/?phone=8801733670129" target="_blank" rel="noopener noreferrer" className={linkClass}>Whatsapp</a>
            </li>
          </ul>
          <ul className="space-y-1.5 sm:space-y-0">
            <li>
              <a href="https://www.facebook.com/offdesign" target="_blank" rel="noopener noreferrer" className={linkClass}>Facebook</a>
            </li>
            <li className={`${linkClass} cursor-pointer`}>Instagram</li>
            <li className={`${linkClass} cursor-pointer`}>X (Twitter)</li>
          </ul>
        </div>
      </div>

      {/* Giant wordmark: fits the width on mobile, cropped at the bottom edge on desktop */}
      <h2 className="whitespace-nowrap px-4 pb-4 font-ppmondwest text-[10.4vw] leading-[0.9] sm:absolute sm:bottom-0 sm:left-0 sm:translate-y-1/3 sm:px-0 sm:pb-0 sm:text-[192px] sm:leading-normal">
        Arc Labs Corporation
      </h2>
    </footer>
  )
}
