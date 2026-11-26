import { clientLogos } from "@/lib/home"

// The homepage's client logos (lib/home.ts). On phones each client is a tile with its name and
// website; on desktop it's the plain logo grid. Styles: .ah .clients in app/home.css.
export default function ClientLogos({ className = "" }: { className?: string }) {
  return (
    <ul className={`clients ${className}`}>
      {clientLogos.map((c) => {
        const mark =
          "logo" in c ? (
            <img
              className="logo"
              src={`/home/logos/${c.logo}.webp`}
              alt={c.name}
              style={{ ["--h" as string]: `${c.height}px` }}
              draggable={false}
            />
          ) : (
            <span className={`wordmark ${c.wordmark}`}>{c.name}</span>
          )
        // On phones each client becomes a tile like the Services cards: name, logo, website.
        // Desktop hides the name and website and keeps the plain logo grid.
        const site = c.href ? new URL(c.href).hostname.replace(/^www\./, "") : null
        const body = (
          <>
            <span className="cl-name" aria-hidden="true">
              {c.name}
            </span>
            <span className="cl-mark">{mark}</span>
            <span className="cl-site" aria-hidden="true">
              {site ? `${site} ↗` : "Private work"}
            </span>
          </>
        )
        return (
          <li key={c.name}>
            {c.href ? (
              <a className="cl" href={c.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.name} (opens in a new tab)`}>
                {body}
              </a>
            ) : (
              <span className="cl mark">{body}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
