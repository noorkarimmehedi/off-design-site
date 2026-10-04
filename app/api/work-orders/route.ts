import { NextResponse } from "next/server"
import { lineLabel, priceSelection, taka, TERMS, type Selection } from "@/lib/work-order/catalog"

// Signed work orders are stored as rows in the Notion "Signed Work Orders" data source.
const NOTION = "https://api.notion.com/v1"
const NOTION_VERSION = "2025-09-03"

type Body = {
  business?: string
  slug?: string
  signer?: string
  phone?: string
  email?: string
  selection?: Selection
  signature?: string
  agreed?: boolean
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "")

function notionHeaders(extra: Record<string, string> = {}) {
  return { Authorization: `Bearer ${process.env.NOTION_TOKEN}`, "Notion-Version": NOTION_VERSION, ...extra }
}

async function notion(path: string, body: unknown) {
  const res = await fetch(`${NOTION}${path}`, {
    method: "POST",
    headers: notionHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`Notion ${path} ${res.status}: ${json.message ?? "request failed"}`)
  return json
}

// Two-step Notion file upload: create the upload, then send the bytes
async function uploadSignature(png: Buffer, filename: string) {
  const upload = await notion("/file_uploads", { mode: "single_part", filename, content_type: "image/png" })
  const form = new FormData()
  form.append("file", new Blob([new Uint8Array(png)], { type: "image/png" }), filename)
  const res = await fetch(`${NOTION}/file_uploads/${upload.id}/send`, { method: "POST", headers: notionHeaders(), body: form })
  if (!res.ok) throw new Error(`Notion file send ${res.status}`)
  return upload.id as string
}

const text = (content: string, bold = false) => ({ type: "text", text: { content }, annotations: { bold } })
const para = (...rich: ReturnType<typeof text>[]) => ({ object: "block", type: "paragraph", paragraph: { rich_text: rich } })
const h2 = (content: string) => ({ object: "block", type: "heading_2", heading_2: { rich_text: [text(content)] } })
const bullet = (...rich: ReturnType<typeof text>[]) => ({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: rich } })

function workOrderNumber(now: Date) {
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  return `WO-${ym}-${String(Math.floor(1000 + Math.random() * 9000))}`
}

export async function POST(req: Request) {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATA_SOURCE_ID) {
    return NextResponse.json({ error: "Work orders are not configured yet." }, { status: 503 })
  }

  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const business = clean(body.business, 120)
  const signer = clean(body.signer, 120)
  const phone = clean(body.phone, 30)
  const email = clean(body.email, 120)
  const signature = typeof body.signature === "string" ? body.signature : ""
  const match = signature.match(/^data:image\/png;base64,([A-Za-z0-9+/=]+)$/)

  if (!business || !signer || !phone) return NextResponse.json({ error: "Business name, your name and phone are required." }, { status: 400 })
  if (!body.agreed) return NextResponse.json({ error: "Please accept the terms." }, { status: 400 })
  if (!match) return NextResponse.json({ error: "Please sign before accepting." }, { status: 400 })
  const png = Buffer.from(match[1], "base64")
  if (png.length > 600_000) return NextResponse.json({ error: "Signature image is too large." }, { status: 400 })

  // Prices always come from the catalogue, never from the browser
  const order = priceSelection(body.selection ?? {})
  const now = new Date()
  const number = workOrderNumber(now)
  const origin = new URL(req.url).origin

  try {
    const fileId = await uploadSignature(png, `${number}-signature.png`)

    const page = await notion("/pages", {
      parent: { type: "data_source_id", data_source_id: process.env.NOTION_DATA_SOURCE_ID },
      icon: { type: "emoji", emoji: "🧾" },
      properties: {
        Client: { title: [{ text: { content: business } }] },
        "Work order": { rich_text: [{ text: { content: number } }] },
        Status: { select: { name: "Signed" } },
        Features: { multi_select: order.lines.map((l) => ({ name: l.feature.name.replace(/,/g, "") })) },
        Total: { number: order.total },
        "Compare-at": { number: order.compareAt },
        "Advance due": { number: order.advance },
        "Signed by": { rich_text: [{ text: { content: signer } }] },
        Phone: { phone_number: phone },
        ...(email ? { Email: { email } } : {}),
        "Signed at": { date: { start: now.toISOString() } },
        Link: { url: `${origin}/order/${clean(body.slug, 60) || "new"}` },
      },
      children: [
        para(text(`${business} × Arc Labs Corporation — work order ${number}`, true)),
        h2("Selected features"),
        ...order.lines.map((l) => bullet(text(`${lineLabel(l)} — `), text(taka(l.price), true), text(`  (was ${taka(l.compareAt)})`))),
        para(text("Total "), text(taka(order.total), true), text(` · compare-at ${taka(order.compareAt)} · saving ${taka(order.savings)}`)),
        para(text("Advance due (50%) "), text(taka(order.advance), true), text(` · final ${taka(order.total - order.advance)}`)),
        h2("Terms accepted"),
        ...TERMS.map(([k, v]) => bullet(text(`${k}: `, true), text(v))),
        h2("Signature"),
        { object: "block", type: "image", image: { type: "file_upload", file_upload: { id: fileId } } },
        para(text(`Signed by ${signer} · ${phone}${email ? ` · ${email}` : ""} · ${now.toISOString()}`)),
        para(text(`IP ${req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown"} · ${clean(req.headers.get("user-agent"), 200)}`)),
      ],
    })

    return NextResponse.json({ number, total: order.total, advance: order.advance, signedAt: now.toISOString(), id: page.id })
  } catch (err) {
    console.error("work order save failed", err)
    return NextResponse.json({ error: "We couldn't save your work order. Please try again or message us on WhatsApp." }, { status: 502 })
  }
}
