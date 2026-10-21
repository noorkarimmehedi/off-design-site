import { createHmac, timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { bookingSubject, renderBookingHtml, renderBookingText, type Booking } from "@/lib/emails/booking-confirmation"

// Cal.com booking webhook → branded confirmation email from hello@ via Resend.
// Cal's own attendee emails should be switched off so people don't get two.
const FROM = "Arc <hello@arc-bangladesh.com>"
const REPLY_TO = "hello@arc-bangladesh.com"

type Attendee = { name?: string; email?: string; timeZone?: string }
type CalPayload = {
  uid?: string
  bookingId?: number
  bookerUrl?: string
  startTime?: string
  endTime?: string
  status?: string
  location?: string
  attendees?: Attendee[]
  videoCallData?: { url?: string }
  metadata?: { videoCallUrl?: string }
}

const KINDS: Record<string, Booking["kind"]> = { BOOKING_CREATED: "created", BOOKING_RESCHEDULED: "rescheduled" }

const LOCATIONS: Record<string, string> = {
  "integrations:google:meet": "Google Meet",
  "integrations:daily": "Cal Video",
  "integrations:zoom": "Zoom",
  "integrations:office365_video": "Microsoft Teams",
}

function verify(raw: string, signature: string | null, secret: string) {
  if (!signature) return false
  const expected = Buffer.from(createHmac("sha256", secret).update(raw).digest("hex"))
  const given = Buffer.from(signature)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

function validZone(tz?: string) {
  try {
    return tz ? new Intl.DateTimeFormat("en", { timeZone: tz }).resolvedOptions().timeZone : "Asia/Dhaka"
  } catch {
    return "Asia/Dhaka"
  }
}

const isUrl = (v?: string) => typeof v === "string" && /^https?:\/\//.test(v)

function whereLabel(location?: string) {
  if (!location) return "Online"
  if (LOCATIONS[location]) return LOCATIONS[location]
  if (isUrl(location)) return new URL(location).hostname.replace(/^www\./, "")
  return location
}

async function send(booking: Booking, key: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": key,
    },
    body: JSON.stringify({
      from: FROM,
      to: [booking.email],
      reply_to: REPLY_TO,
      subject: bookingSubject(booking),
      html: renderBookingHtml(booking),
      text: renderBookingText(booking),
    }),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
}

export async function POST(req: Request) {
  const secret = process.env.CAL_WEBHOOK_SECRET
  if (!secret || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Booking emails are not configured yet." }, { status: 503 })
  }

  const raw = await req.text()
  if (!verify(raw, req.headers.get("x-cal-signature-256"), secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 })
  }

  let body: { triggerEvent?: string; payload?: CalPayload }
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const kind = KINDS[body.triggerEvent ?? ""]
  const b = body.payload
  // Pings, cancellations and bookings still awaiting approval get no confirmation
  if (!kind || !b || (b.status && b.status !== "ACCEPTED")) return NextResponse.json({ ignored: body.triggerEvent ?? null })
  if (!b.uid || !b.startTime || !b.endTime) return NextResponse.json({ error: "Missing booking fields." }, { status: 400 })

  const bookerUrl = isUrl(b.bookerUrl) ? b.bookerUrl!.replace(/\/$/, "") : "https://cal.com"
  const join = [b.metadata?.videoCallUrl, b.videoCallData?.url, b.location].find(isUrl)
  const attendees = (b.attendees ?? []).filter((a): a is Attendee & { email: string } => Boolean(a.email))

  try {
    for (const a of attendees) {
      const booking: Booking = {
        kind,
        name: a.name ?? "",
        email: a.email,
        start: b.startTime,
        end: b.endTime,
        timeZone: validZone(a.timeZone),
        ref: `ARC-${b.bookingId ?? b.uid.slice(0, 6).toUpperCase()}`,
        where: whereLabel(b.location),
        join,
        reschedule: `${bookerUrl}/reschedule/${b.uid}`,
        cancel: `${bookerUrl}/booking/${b.uid}?cancel=true`,
      }
      // Cal retries failed deliveries; the key stops a retry from sending twice
      await send(booking, `cal-${body.triggerEvent}-${b.uid}-${a.email}`.slice(0, 256))
    }
    return NextResponse.json({ sent: attendees.length })
  } catch (err) {
    console.error("booking email failed", err)
    return NextResponse.json({ error: "Could not send the confirmation email." }, { status: 502 })
  }
}
