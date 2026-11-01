import Link from "next/link"

// The template's hover: the label rolls up and an identical copy rolls in from below.
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}

export function RollLink({ href, children, onClick, current }: { href: string; children: string; onClick?: () => void; current?: boolean }) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        <Roll>{children}</Roll>
      </a>
    )
  }
  return (
    <Link href={href} onClick={onClick} aria-current={current ? "page" : undefined}>
      <Roll>{children}</Roll>
    </Link>
  )
}
