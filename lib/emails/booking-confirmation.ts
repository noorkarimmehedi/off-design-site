// Booking confirmation email ("Frame" design): the site's white theme with frame guides,
// red ticks and registration marks. Table layout and inline styles so it survives Gmail and Outlook.

const SITE = "https://www.arc-bangladesh.com"
const WA = "https://wa.me/8801733670129"
const LOGO = `${SITE}/email/arc-logo.png` // 144×52
const AMP = `${SITE}/email/ampersand.png` // 88×87
const SIG = `${SITE}/email/signature.png` // 128×118

// Same stacks as the site. Gmail drops web fonts, so Macs/iPhones get Didot, others Georgia.
const DISPLAY = "'Playfair Display',Didot,'Bodoni 72','Bodoni MT',Georgia,serif"
const MONO = "'Geist Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const SANS = "Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"
const RED = "#ff5941"
const INK = "#16140f"
const STONE = "#69635a"
const LINE = "#e8e8e7"
const MARK = "#b9b5ae"

export type Booking = {
  kind: "created" | "rescheduled"
  name: string
  email: string
  /** ISO timestamps */
  start: string
  end: string
  /** IANA zone of the attendee, e.g. "Asia/Dhaka" */
  timeZone: string
  ref: string
  /** Human label for the meeting location, e.g. "Google Meet" */
  where: string
  join?: string
  reschedule: string
  cancel: string
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

const fmt = (iso: string, timeZone: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone, ...opts }).format(new Date(iso))

const clock = (iso: string, timeZone: string) =>
  fmt(iso, timeZone, { hour: "numeric", minute: "2-digit", hour12: true }).replace(/\s?([ap])m/i, (_, m) => ` ${m.toUpperCase()}M`)

function zoneLabel(iso: string, timeZone: string) {
  const city = timeZone.split("/").pop()!.replace(/_/g, " ")
  const offset = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
    .formatToParts(new Date(iso))
    .find((p) => p.type === "timeZoneName")?.value
  return offset ? `${city} · ${offset}` : city
}

const utcStamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")

function googleCalendarLink(b: Booking) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Arc — 15 min call",
    dates: `${utcStamp(b.start)}/${utcStamp(b.end)}`,
    details: `Intro call with Arc.${b.join ? ` Join: ${b.join}` : ""}`,
    location: b.join || b.where,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

/** Everything the template and the plain-text part need, already formatted for the attendee. */
function view(b: Booking, now = new Date()) {
  const tz = b.timeZone || "Asia/Dhaka"
  const minutes = Math.round((new Date(b.end).getTime() - new Date(b.start).getTime()) / 60000)
  const sent = now.toISOString()
  return {
    first: b.name.trim().split(/\s+/)[0] || "there",
    day: fmt(b.start, tz, { weekday: "long", day: "numeric", month: "long" }),
    dayShort: fmt(b.start, tz, { weekday: "short", day: "numeric", month: "short" }),
    time: `${clock(b.start, tz).replace(/ [AP]M$/, (m) => (clock(b.end, tz).endsWith(m) ? "" : m))} – ${clock(b.end, tz)}`,
    timeShort: clock(b.start, tz),
    zone: zoneLabel(b.start, tz),
    length: `${minutes} minutes`,
    calendar: googleCalendarLink(b),
    sentClock: `${fmt(sent, "Asia/Dhaka", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }).toUpperCase()} · Dhaka`,
    sentDate: fmt(sent, "Asia/Dhaka", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "."),
  }
}

export function bookingSubject(b: Booking) {
  const v = view(b)
  return `${b.kind === "rescheduled" ? "Rescheduled" : "Confirmed"}: 15 min call with Arc — ${v.dayShort}, ${v.timeShort}`
}

const T = (inner: string, extra = "") =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;${extra}">${inner}</table>`
const TW = (inner: string, extra = "") =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;${extra}">${inner}</table>`
const mono = (size: number, color: string, ls = 2) =>
  `font-family:${MONO};font-size:${size}px;line-height:${Math.round(size * 1.5)}px;letter-spacing:${ls}px;text-transform:uppercase;color:${color};`

// The site's crosshair button: square fill, L-ticks on the four corners.
function xbtn(label: string, href: string) {
  const bg = "#f1f1f0"
  const c = `width:6px;height:6px;font-size:0;line-height:0;`
  const f = `font-size:0;line-height:0;`
  return T(`
      <tr>
        <td bgcolor="${bg}" style="${c}border-top:1px solid ${MARK};border-left:1px solid ${MARK};">&nbsp;</td>
        <td bgcolor="${bg}" style="${f}">&nbsp;</td>
        <td bgcolor="${bg}" style="${c}border-top:1px solid ${MARK};border-right:1px solid ${MARK};">&nbsp;</td>
      </tr>
      <tr>
        <td bgcolor="${bg}" style="${f}">&nbsp;</td>
        <td bgcolor="${bg}"><a href="${escapeHtml(href)}" target="_blank" style="display:block;padding:7px 14px;${mono(12, "#4a463f", 1.5)}line-height:16px;text-decoration:none;white-space:nowrap;">${label}</a></td>
        <td bgcolor="${bg}" style="${f}">&nbsp;</td>
      </tr>
      <tr>
        <td bgcolor="${bg}" style="${c}border-bottom:1px solid ${MARK};border-left:1px solid ${MARK};">&nbsp;</td>
        <td bgcolor="${bg}" style="${f}">&nbsp;</td>
        <td bgcolor="${bg}" style="${c}border-bottom:1px solid ${MARK};border-right:1px solid ${MARK};">&nbsp;</td>
      </tr>`)
}

function details(rows: [string, string, string][]) {
  return rows
    .map(([l, v, s], i) => {
      const edge = `border-top:1px solid ${LINE};${i === rows.length - 1 ? `border-bottom:1px solid ${LINE};` : ""}`
      return `
      <tr>
        <td width="96" style="padding:14px 0;${edge}vertical-align:top;${mono(10, STONE)}line-height:22px;white-space:nowrap;">${l}</td>
        <td style="padding:14px 0;${edge}font-family:${SANS};font-size:15px;line-height:22px;color:${INK};">${v}${s ? `<br><span style="font-size:13px;color:${STONE};">${s}</span>` : ""}</td>
      </tr>`
    })
    .join("")
}

export function renderBookingHtml(b: Booking, now = new Date()) {
  const v = view(b, now)
  const p = `margin:0 0 16px;font-family:${SANS};font-size:15px;line-height:25px;color:${INK};`
  const G = 18 // gutter width beside each guide
  const link = (href: string, label: string) =>
    `<a href="${escapeHtml(href)}" target="_blank" style="color:${STONE};text-decoration:underline;">${label}</a>`

  const tick = `
    <tr>
      <td width="${G}" style="font-size:0;line-height:0;">&nbsp;</td>
      <td height="14" style="height:14px;font-size:0;line-height:0;border-left:1px solid ${RED};border-right:1px solid ${RED};">&nbsp;</td>
      <td width="${G}" style="font-size:0;line-height:0;">&nbsp;</td>
    </tr>`
  const row = (inner: string, style = "") => `
    <tr>
      <td width="${G}" style="font-size:0;line-height:0;">&nbsp;</td>
      <td style="border-left:1px solid ${LINE};border-right:1px solid ${LINE};padding:0 28px;${style}">${inner}</td>
      <td width="${G}" style="font-size:0;line-height:0;">&nbsp;</td>
    </tr>`
  const reg = `
    <tr>
      <td width="${G}" align="right" style="font-family:${MONO};font-size:13px;line-height:13px;color:${MARK};">+</td>
      <td style="border-left:1px solid ${LINE};border-right:1px solid ${LINE};"><div style="height:1px;line-height:1px;font-size:0;background:${LINE};">&nbsp;</div></td>
      <td width="${G}" align="left" style="font-family:${MONO};font-size:13px;line-height:13px;color:${MARK};">+</td>
    </tr>`

  const rescheduled = b.kind === "rescheduled"
  const intro = rescheduled
    ? `Your call with Arc has moved to the new time below. Same fifteen minutes, no slides &mdash; tell us about your store and we'll tell you honestly what we'd do with it.`
    : `Thanks for booking a call with Arc. It's fifteen minutes, no slides &mdash; tell us about your store and we'll tell you honestly what we'd do with it.`
  const rows: [string, string, string][] = [
    ["Date", v.day, ""],
    ["Time", v.time, escapeHtml(v.zone)],
    ["Length", v.length, "Intro call &mdash; no prep needed"],
    ["Where", escapeHtml(b.where), b.join ? `<a href="${escapeHtml(b.join)}" target="_blank" style="color:inherit;">Open the meeting link</a>` : ""],
  ]
  const buttons = b.join
    ? `<td style="vertical-align:middle;padding-right:10px;">${xbtn("Join call", b.join)}</td><td style="vertical-align:middle;">${xbtn("Add to calendar", v.calendar)}</td>`
    : `<td style="vertical-align:middle;">${xbtn("Add to calendar", v.calendar)}</td>`
  const preheader = `${v.day}, ${v.time} (${v.zone}) — ${b.where}.`

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${escapeHtml(bookingSubject(b))}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
${TW(`<tr><td align="center" bgcolor="#ffffff">
  ${TW(`
    ${tick}
    ${row(`
      <div style="padding:22px 0 18px;text-align:center;">
        <a href="${SITE}" target="_blank"><img src="${LOGO}" width="72" height="26" alt="arc." style="display:block;border:0;margin:0 auto;"></a>
        <div style="${mono(10, STONE, 2.5)}padding-top:8px;">${v.sentClock}</div>
      </div>`)}
    ${reg}
    ${row(
      TW(`<tr>
        <td style="${mono(10, STONE)}white-space:nowrap;"><span style="color:${RED};">&#9679;</span>&nbsp; ${rescheduled ? "Booking rescheduled" : "Booking confirmed"}</td>
        <td align="right" style="${mono(10, STONE)}white-space:nowrap;">N&deg; ${escapeHtml(b.ref)}</td>
      </tr>`),
      "padding-top:14px;",
    )}
    ${row(
      `<div style="font-family:${DISPLAY};font-weight:900;font-size:52px;line-height:46px;letter-spacing:-1.8px;color:${INK};">
        ${rescheduled ? "moved" : "booked"} <img src="${AMP}" width="44" height="44" alt="&amp;" style="display:inline-block;vertical-align:-7px;border:0;"><br>confirmed.
      </div>`,
      "padding-top:48px;padding-bottom:44px;text-align:center;",
    )}
    ${row(`
      <p style="${p}">Hi ${escapeHtml(v.first)},</p>
      <p style="${p}">${intro}</p>
      ${TW(details(rows), "margin:8px 0 28px;")}`)}
    ${row(
      `${T(`<tr>${buttons}</tr>`)}
      <p style="margin:18px 0 0;font-family:${SANS};font-size:13px;line-height:20px;color:${STONE};">Need another time? ${link(b.reschedule, "Reschedule")}&nbsp;&nbsp;&middot;&nbsp;&nbsp;${link(b.cancel, "Cancel")}</p>`,
      "padding-bottom:44px;",
    )}
    ${row(
      TW(`<tr>
        <td style="vertical-align:bottom;font-family:${DISPLAY};font-style:italic;font-size:14px;line-height:20px;color:${STONE};padding-right:12px;">
          &ldquo;The bespoke &mdash;<br>for your business.&rdquo;<br><span style="font-style:normal;color:#9a958d;">&ndash; Arc Labs Corporation</span>
        </td>
        <td align="right" style="vertical-align:bottom;white-space:nowrap;">
          <img src="${SIG}" width="64" height="59" alt="" style="display:block;border:0;margin:0 0 2px auto;">
          <div style="font-family:${SANS};font-size:14px;line-height:20px;color:${INK};">Kaarim</div>
          <div style="${mono(10, STONE)}">${v.sentDate}</div>
        </td>
      </tr>`),
      "padding-bottom:32px;",
    )}
    ${reg}
    ${row(
      TW(`<tr>
        <td style="${mono(10, STONE, 1.5)}white-space:nowrap;padding-right:12px;"><a href="${WA}" target="_blank" style="${mono(11, STONE, 2)}text-decoration:none;white-space:nowrap;"><span style="color:${RED};font-size:9px;">&#9679;</span>&nbsp; Chat with us &rarr;</a></td>
        <td align="right" style="${mono(10, STONE, 1.5)}white-space:nowrap;">23.81&deg; N &mdash; 90.41&deg; E</td>
      </tr>`),
      "padding-top:14px;padding-bottom:14px;",
    )}
    ${tick}
  `, "max-width:600px;")}
</td></tr>`)}
</body>
</html>`
}

export function renderBookingText(b: Booking, now = new Date()) {
  const v = view(b, now)
  return [
    `Hi ${v.first},`,
    "",
    b.kind === "rescheduled"
      ? "Your call with Arc has moved to the new time below."
      : "Thanks for booking a call with Arc. It's fifteen minutes, no slides — tell us about your store and we'll tell you honestly what we'd do with it.",
    "",
    `Date:   ${v.day}`,
    `Time:   ${v.time} (${v.zone})`,
    `Length: ${v.length}`,
    `Where:  ${b.where}${b.join ? ` — ${b.join}` : ""}`,
    `Ref:    ${b.ref}`,
    "",
    `Add to calendar: ${v.calendar}`,
    `Reschedule: ${b.reschedule}`,
    `Cancel: ${b.cancel}`,
    "",
    "Kaarim",
    "Arc Labs Corporation",
    `WhatsApp: ${WA}`,
  ].join("\n")
}
