import type { Metadata, Viewport } from "next"
import CallIsland from "@/components/home/call-island"
import CursorDot from "@/components/home/cursor-dot"
import HomeHeader from "@/components/home/home-header"
import SiteFoot from "@/components/home/site-foot"
import InstallCommand from "@/components/skills/install-command"
import QueryPrompt from "@/components/skills/query-prompt"
import { satoshi } from "@/lib/fonts"
import "../home.css"
import "./skills.css"

const description =
  "Skills for coding agents from arc. ask-secrets lets Claude Code, Codex and OpenCode ask for API keys through a prompt on your Mac instead of in chat."

export const metadata: Metadata = {
  title: "Skills — Arc Labs & Co.",
  description,
  openGraph: { title: "Skills for coding agents — arc.", description },
  twitter: { title: "Skills for coding agents — arc.", description },
}
export const viewport: Viewport = { themeColor: "#111111" }

const INSTALL = "npx skills add https://www.arc-bangladesh.com --skill ask-secrets"

const MODES = [
  { k: "query run", d: "The value goes to one command as an environment variable. The agent uses this by default." },
  { k: "query write", d: "The value is saved into a git-ignored .env file, readable only by you." },
  { k: "query get", d: "The value is printed back. Only for things that aren't secret, like a region or a project ID." },
]

export default function SkillsPage() {
  return (
    <main className={`ah sk ${satoshi.variable}`}>
      <HomeHeader />

      <section className="sk-hero">
        <h1>
          <span>Skills for coding agents.</span>
          <span>Written while we build.</span>
        </h1>
      </section>

      <section className="split sk-first" aria-labelledby="sk-ask-secrets">
        <h2 className="label" id="sk-ask-secrets">
          ask-secrets
        </h2>
        <div className="copy">
          <p>
            When Claude Code, Codex or OpenCode needs an API key it doesn&apos;t have, it opens a small prompt on your Mac
            instead of asking in chat. You type the key, it goes straight to the command, and it never ends up in the
            transcript.
          </p>
        </div>
      </section>

      <div className="sk-tile sk-desk">
        <QueryPrompt />
      </div>

      <section className="split" aria-labelledby="sk-install">
        <h2 className="label" id="sk-install">
          Install
        </h2>
        <div className="copy">
          <InstallCommand command={INSTALL} />
          <p className="sk-small">
            Needs macOS and the{" "}
            <a href="https://github.com/R44VC0RP/query" target="_blank" rel="noopener noreferrer">
              query CLI
            </a>
            . If it&apos;s missing, the agent offers to install it. You can also{" "}
            <a href="/skills/ask-secrets/SKILL.md" target="_blank" rel="noopener noreferrer">
              read the skill
            </a>{" "}
            first.
          </p>
        </div>
      </section>

      <section className="split" aria-labelledby="sk-modes">
        <h2 className="label" id="sk-modes">
          Three ways to ask
        </h2>
        <div className="faq">
          {MODES.map((m) => (
            <div className="qa sk-mode" key={m.k}>
              <div className="sk-mode-row">
                <span className="sk-mono">{m.k}</span>
                <span>{m.d}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sk-end" />
      <SiteFoot />
      <CallIsland />
      <CursorDot />
    </main>
  )
}
