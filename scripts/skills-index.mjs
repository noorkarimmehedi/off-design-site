// Writes public/.well-known/agent-skills/index.json from public/skills/*/SKILL.md, so
// `npx skills add https://www.arc-bangladesh.com` can find every skill. The digest is a
// sha256 of the exact bytes served; the installer refuses a skill whose digest is wrong.
// Runs at the start of every build (see "build" in package.json; pnpm skips prebuild hooks).
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const SITE = process.env.SKILLS_SITE ?? "https://www.arc-bangladesh.com"
const dir = "public/skills"
const skills = []

for (const name of readdirSync(dir).sort()) {
  const file = join(dir, name, "SKILL.md")
  if (!existsSync(file)) continue
  const bytes = readFileSync(file)
  const front = bytes.toString("utf8").match(/^---\n([\s\S]*?)\n---/)
  const field = (k) => front?.[1].match(new RegExp(`^${k}:\\s*(.+)$`, "m"))?.[1].trim()
  if (field("name") !== name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`${file}: frontmatter name must be "${name}" (lowercase letters, digits, single dashes)`)
  }
  skills.push({
    name,
    description: field("description"),
    type: "skill-md",
    url: `${SITE}/skills/${name}/SKILL.md`,
    digest: `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
  })
}

const out = "public/.well-known/agent-skills"
mkdirSync(out, { recursive: true })
writeFileSync(
  join(out, "index.json"),
  JSON.stringify({ $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json", skills }, null, 2) + "\n",
)
console.log(`skills index: ${skills.map((s) => s.name).join(", ")}`)
