import { streamText } from "ai"
import { EMAIL, PHONE, WHATSAPP, callFaqs, faqs, services } from "@/lib/home"
import { clientIp, rateLimit } from "@/lib/rate-limit"

// "Ask anything else" under the FAQ: one question in, a short streamed answer out.
// Runs through Vercel AI Gateway, which reads AI_GATEWAY_API_KEY from the environment.
// The free Gateway tier excludes Claude; set ASK_MODEL (e.g. "anthropic/claude-haiku-5.5") once credits are added.
const MODEL = process.env.ASK_MODEL || "openai/gpt-5-mini"
const MAX_QUESTION = 400
// Per visitor IP: 5 a minute, 30 a day
const LIMITS = [
  { limit: 5, ms: 60_000 },
  { limit: 30, ms: 86_400_000 },
]

const qa = (list: { q: string; a: string }[]) => list.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")

const INSTRUCTIONS = `You answer visitor questions in the FAQ section of arc's website (arc-bangladesh.com).

Names: "arc", "arc lab", "arc labs", "Arc Labs", "arc-lab", "arc-labs" and "arc bangladesh" all mean the same company. Treat questions using any of these names as questions about arc.

About arc: a technology firm serving Bangladesh's consumer goods, food and beverage, life sciences, agribusiness, industrial manufacturing and retail sectors. arc works as a company's product and engineering team: it designs, builds and operates websites, AI systems, automation and custom software built around how each business works. Clients include Sera Khabar, Mango Lover, Zair, Angonaloy and others.

Services:
${services.map((s) => `- ${s.name}: ${s.body}`).join("\n")}

Known answers:
${qa(faqs)}

${qa(callFaqs)}

Contact: book a free 15-minute call at https://arc-bangladesh.com/call, email ${EMAIL}, phone or WhatsApp ${PHONE} (${WHATSAPP}).

Rules:
- Answer in at most 70 words, in 1 or 2 short paragraphs of plain text. No markdown, no bullet points, no headings.
- Reply in the visitor's language. Bangla replies must use only Bangla script (no Hindi/Devanagari words).
- End with one way to get in touch, usually the call page. Don't list every contact method.
- Only state facts given above. Never invent prices, timelines, clients or guarantees. If you don't know, say so and point them to the call page or email.
- For pricing, explain that each scope gets a fixed quote after a discovery call.
- If the question is unrelated to arc or building software for a business, say briefly that you can only help with questions about arc.
- Write full URLs when you mention a link.`

export async function POST(req: Request) {
  let question = ""
  try {
    const body = await req.json()
    question = typeof body?.question === "string" ? body.question.trim() : ""
  } catch {}
  if (!question) return new Response("Ask a question first.", { status: 400 })
  if (question.length > MAX_QUESTION) return new Response("That question is too long.", { status: 413 })

  const wait = rateLimit(`ask:${clientIp(req)}`, LIMITS)
  if (wait) {
    return new Response("You’ve asked a lot of questions. Please wait a little, or book a call.", {
      status: 429,
      headers: { "Retry-After": String(wait) },
    })
  }

  const result = streamText({
    model: MODEL,
    instructions: INSTRUCTIONS,
    prompt: question,
    // GPT-5 models reason before answering; keep it minimal so answers start fast and tokens go to the reply
    maxOutputTokens: 1200,
    providerOptions: { openai: { reasoningEffort: "minimal" } },
  })
  return result.toTextStreamResponse()
}
