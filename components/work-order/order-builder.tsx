"use client"

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import {
  BANK,
  defaultSelection,
  lineLabel,
  priceSelection,
  taka,
  type Catalog,
  type Feature,
  type FeaturePointGroup,
  type Selection,
} from "@/lib/work-order/catalog"
import { TakaFlow } from "@/components/ui/number-flow"
import SignatureField, { type SignatureFieldHandle } from "./signature-field"

const WHATSAPP = "+880 1733-670129"
const WA_LINK = "https://api.whatsapp.com/send/?phone=8801733670129"
const isBangla = (s: string) => /[ঀ-৿]/.test(s)
const pad = (i: number) => String(i + 1).padStart(2, "0")
const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const smooth = (): ScrollBehavior => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth")

type Result = { number: string; total: number; advance: number; signedAt: string }

// The work order as one document, in the homepage's style (see app/order/order.css): pick items with
// pen ticks, check the totals, unfold the terms, then sign and pay the advance in three steps.
// Prices always come from the catalogue; the API re-prices the selection on submit.
export default function OrderBuilder({
  slug,
  clientName,
  preset,
  catalog,
  nameLocked = false,
}: {
  slug: string
  clientName?: string
  preset?: Selection
  /** Price list this order is built from */
  catalog: Catalog
  /** Name came from a saved client entry, so the client can't edit it */
  nameLocked?: boolean
}) {
  const [selection, setSelection] = useState<Selection>(() => defaultSelection(catalog, preset))
  const [business, setBusiness] = useState(clientName ?? "")
  const [signer, setSigner] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [showEmail, setShowEmail] = useState(false)
  const [signed, setSigned] = useState(false)
  // Accept flow: 1 details → 2 review & sign → 3 pay the advance. Done steps fold to one line.
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle")
  const [error, setError] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [signaturePng, setSignaturePng] = useState<string | null>(null)
  const [reference, setReference] = useState("")
  const [showRef, setShowRef] = useState(false)
  const [slip, setSlip] = useState<{ url: string; name: string } | null>(null)
  const [slipError, setSlipError] = useState("")
  const [termsOpen, setTermsOpen] = useState(false)
  // Ticks already in place on first paint shouldn't draw themselves in
  const [still, setStill] = useState(true)
  const [dock, setDock] = useState(false)
  const padRef = useRef<SignatureFieldHandle>(null)
  const heroRef = useRef<HTMLElement>(null)
  const signRef = useRef<HTMLElement>(null)
  const termsRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  const order = useMemo(() => priceSelection(selection, catalog), [selection, catalog])
  const locked = Boolean(result)
  const quote = catalog.mode === "quote"
  const paid = Boolean(reference.trim() || slip)
  const detailsDone = Boolean(business.trim() && signer.trim() && phone.trim())
  const ready = detailsDone && signaturePng && paid

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setStill(false)))
    return () => cancelAnimationFrame(id)
  }, [])

  // The dock shows once the hero has scrolled away, and steps aside while the sign section is on screen
  useEffect(() => {
    let pastHero = false
    let signing = false
    const update = () => setDock(pastHero && !signing)
    const a = new IntersectionObserver(([e]) => ((pastHero = !e.isIntersecting), update()))
    const b = new IntersectionObserver(([e]) => ((signing = e.isIntersecting), update()), { rootMargin: "0px 0px -35% 0px" })
    if (heroRef.current) a.observe(heroRef.current)
    if (signRef.current) b.observe(signRef.current)
    return () => (a.disconnect(), b.disconnect())
  }, [])

  // Opening a step scrolls it into view once the fold has opened, but only if its header is off screen
  const goTo = (n: 1 | 2 | 3) => {
    setStep(n)
    window.setTimeout(() => {
      const el = stepRefs.current[n - 1]
      if (!el) return
      const top = el.getBoundingClientRect().top
      if (top < 0 || top > window.innerHeight * 0.6) el.scrollIntoView({ behavior: smooth(), block: "start" })
    }, 540)
  }
  const sign = async () => {
    const png = await padRef.current?.toPng()
    if (!png) return
    setSignaturePng(png)
    goTo(3)
  }
  const scrollToFlow = () => (stepRefs.current[step - 1] ?? signRef.current)?.scrollIntoView({ behavior: smooth(), block: "start" })
  const openTerms = () => {
    setTermsOpen(true)
    termsRef.current?.scrollIntoView({ behavior: smooth(), block: "start" })
  }

  const toggle = (f: Feature) => {
    if (f.required || locked) return
    setSelection((s) => ({ ...s, [f.id]: s[f.id] ? 0 : f.perUnit?.default || 1 }))
  }
  const setQty = (f: Feature, qty: number) => {
    if (locked || !f.perUnit) return
    setSelection((s) => ({ ...s, [f.id]: Math.min(Math.max(qty, f.perUnit!.min), f.perUnit!.max) }))
  }

  async function accept() {
    if (!ready || status === "saving") return
    setStatus("saving")
    const signature = signaturePng
    setError("")
    try {
      const res = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business,
          slug,
          catalog: catalog.id,
          signer,
          phone,
          email,
          selection,
          signature,
          agreed: true,
          reference,
          slip: slip?.url,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.")
      setResult(json)
      setStatus("idle")
      requestAnimationFrame(() => signRef.current?.scrollIntoView({ behavior: smooth(), block: "start" }))
    } catch (e) {
      setStatus("error")
      setError(e instanceof Error ? e.message : "Something went wrong.")
    }
  }

  const who = business.trim()
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  // Folded terms show their own titles, so the line is true for every catalogue
  const termsSummary = catalog.terms.map(([k]) => k).join(" · ")

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" precedence="default" />
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          html, body { background: #fff !important; }
          body > *:not(#print-order) { display: none !important; }
          #print-order { display: block !important; }
        }
      `}</style>

      {/* Hero: the homepage's big soft line, with the client's name in ink */}
      <section ref={heroRef} className="wo-hero print:hidden" aria-label="Work order">
        <h1>
          <span className="line">
            <span>{sentence(catalog.headline)}</span>
          </span>
          <span className="line">
            <span>
              By <img className="h-logo" src="/home/arc-gloss.webp" alt="arc" width={720} height={270} draggable={false} /> for{" "}
              {/* Follows the Business name field, so a corrected spelling shows here too */}
              <span className={`who ${isBangla(who) ? "bn" : ""}`}>{who || "you"}</span>
            </span>
          </span>
        </h1>
        <div className="hero-foot">
          <span className="label">
            Work order · {result ? result.number : catalog.name}
          </span>
          <div>
            <p>
              <span className="lead">{catalog.lead}</span> <span className="rest">{catalog.blurb}</span>
            </p>
            <div className="facts">
              <span className="chip">
                Delivery&nbsp;<b>{catalog.delivery}</b>
              </span>
              <span className="chip">50% to start</span>
              <span className="chip">Yours once paid</span>
            </div>
          </div>
        </div>
      </section>

      <article className={`doc rv print:hidden${quote ? " quote" : ""}${still ? " still" : ""}`} aria-label="Work order">
        <div className="doc-head">
          <h2>Work order</h2>
          <dl>
            <dt>For</dt>
            <dd className={isBangla(who) ? "bn" : ""}>{who || "—"}</dd>
            <dt>Scope</dt>
            <dd>{catalog.name}</dd>
            <dt>Delivery</dt>
            <dd>{catalog.delivery}</dd>
            <dt>{result ? "No." : "Date"}</dt>
            <dd suppressHydrationWarning>{result ? result.number : today}</dd>
          </dl>
        </div>

        <div className="d-colh" aria-hidden="true">
          <span />
          <span>Item</span>
          <span>Was</span>
          <span>Price</span>
        </div>

        {catalog.groups.map((group) => (
          <section className="d-grp" key={group.id} aria-labelledby={`g-${group.id}`}>
            <header>
              <h3 id={`g-${group.id}`}>{group.title}</h3>
              <span>{group.note}</span>
            </header>
            {group.features.map((f) => {
              const qty = selection[f.id] ?? 0
              const on = qty > 0
              const fixed = Boolean(f.required || locked)
              return (
                <div
                  key={f.id}
                  role="checkbox"
                  aria-checked={on}
                  aria-disabled={fixed}
                  aria-label={f.name}
                  tabIndex={fixed ? -1 : 0}
                  onClick={() => toggle(f)}
                  onKeyDown={(e) => {
                    if (e.target !== e.currentTarget || (e.key !== " " && e.key !== "Enter")) return
                    e.preventDefault()
                    toggle(f)
                  }}
                  className={`d-row${on ? " on" : ""}`}
                >
                  <span className="box" aria-hidden="true">
                    <svg viewBox="0 0 21 21">
                      <path d="M5.2 11.1c1.1.8 2.1 2 2.9 3.4C10.1 10.4 12.6 7.3 16 5.3" pathLength={1} />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <div className="d-name">
                      <span>{f.name}</span>
                      {f.required && !quote && <span className="incl">Included</span>}
                    </div>
                    {f.detail && <p>{f.detail}</p>}
                    {f.points && f.points.length > 0 && <Scope count={f.points.length}>{<ul>{f.points.map((p) => <li key={p}>{p}</li>)}</ul>}</Scope>}
                    {f.pointGroups && f.pointGroups.length > 0 && <ScopeGroups groups={f.pointGroups} />}
                    {f.perUnit && (
                      <div className="stepper" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                        <button type="button" aria-label={`Fewer ${f.perUnit.label}`} disabled={locked || qty <= f.perUnit.min} onClick={() => setQty(f, qty - 1)}>
                          −
                        </button>
                        <output aria-live="polite">
                          {qty} {f.perUnit.label}
                        </output>
                        <button type="button" aria-label={`More ${f.perUnit.label}`} disabled={locked || qty >= f.perUnit.max} onClick={() => setQty(f, qty + 1)}>
                          +
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="c-was">{taka(f.compareAt)}</span>
                  <span className="c-now">
                    {taka(f.price)}
                    {f.perUnit && <small>each</small>}
                  </span>
                </div>
              )
            })}
          </section>
        ))}

        <div className="d-tot">
          <span className="count">
            {order.lines.length} {order.lines.length === 1 ? "item" : "items"}
          </span>
          <div>
            <div className="totals">
              <div className="row">
                <span>Compare-at</span>
                <TakaFlow value={order.compareAt} strike />
              </div>
              <div className="grand">
                <span className="lbl">Total</span>
                <TakaFlow value={order.total} className="amt" />
              </div>
              {order.savings > 0 && (
                <div className="save">
                  You save <TakaFlow value={order.savings} />
                </div>
              )}
            </div>
            <div className="halves">
              <div>
                <span>Advance 50%</span>
                <TakaFlow value={order.advance} className="amt" />
              </div>
              <div>
                <span>At handover</span>
                <TakaFlow value={order.total - order.advance} className="amt" />
              </div>
            </div>
          </div>
        </div>

        <div ref={termsRef} className="d-terms" data-open={termsOpen || undefined}>
          <button type="button" className="d-terms-h" aria-expanded={termsOpen} aria-controls="wo-terms" onClick={() => setTermsOpen((o) => !o)}>
            <span className="lbl">Terms · {catalog.terms.length}</span>
            <span className="d-terms-sum">{termsSummary}</span>
            <span className="plus" aria-hidden="true" />
          </button>
          <div className="d-terms-b" id="wo-terms" inert={!termsOpen}>
            <div>
              <ol>
                {catalog.terms.map(([k, v]) => (
                  <li key={k}>
                    <b>{k}.</b> {v}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Accept: details → review & sign → pay the advance */}
        <section ref={signRef} className="d-sign" id="sign" aria-labelledby="sign-heading">
          {result ? (
            <Confirmation result={result} business={business} reference={reference} hasSlip={Boolean(slip)} />
          ) : (
            <>
              <div className="sign-lead">
                <h2 id="sign-heading">Sign & start</h2>
                <p>Three short steps. Work starts once the advance is confirmed.</p>
              </div>
              <div className="steps">
                <Step
                  n={1}
                  step={step}
                  title="Your details"
                  summary={`${signer.trim()} · ${phone.trim()}`}
                  onEdit={() => goTo(1)}
                  stepRef={(el) => {
                    stepRefs.current[0] = el
                  }}
                >
                  <Field label="Business name" value={business} onChange={setBusiness} disabled={nameLocked} autoComplete="organization" />
                  <div className="two">
                    <Field label="Your full name" value={signer} onChange={setSigner} autoComplete="name" />
                    <Field label="Phone / WhatsApp" value={phone} onChange={setPhone} type="tel" autoComplete="tel" />
                  </div>
                  {showEmail ? (
                    <Field label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" />
                  ) : (
                    <button type="button" onClick={() => setShowEmail(true)} className="link">
                      + Add email for a copy (optional)
                    </button>
                  )}
                  <button type="button" onClick={() => goTo(2)} disabled={!detailsDone} className="btn">
                    Continue
                  </button>
                </Step>

                <Step
                  n={2}
                  step={step}
                  title="Review & sign"
                  summary={`Signed by ${signer.trim()}`}
                  onEdit={() => goTo(2)}
                  stepRef={(el) => {
                    stepRefs.current[1] = el
                  }}
                >
                  <dl className="kv">
                    <div>
                      <dt>Total</dt>
                      <dd>
                        <TakaFlow value={order.total} />
                      </dd>
                    </div>
                    <div>
                      <dt>Payment</dt>
                      <dd>
                        <TakaFlow value={order.advance} /> now · <TakaFlow value={order.total - order.advance} /> at handover
                      </dd>
                    </div>
                    <div>
                      <dt>Delivery</dt>
                      <dd>{catalog.delivery} after the advance</dd>
                    </div>
                  </dl>
                  <button type="button" className="link" onClick={openTerms}>
                    Read all {catalog.terms.length} terms
                  </button>
                  <SignatureField ref={padRef} name={signer} onChange={setSigned} active={step === 2} />
                  <button type="button" onClick={sign} disabled={!signed} className="btn">
                    Sign & continue
                  </button>
                  <p className="note">Signing means you accept this work order and its terms.</p>
                </Step>

                <Step
                  n={3}
                  step={step}
                  title={
                    <>
                      Pay the <TakaFlow value={order.advance} /> advance
                    </>
                  }
                  stepRef={(el) => {
                    stepRefs.current[2] = el
                  }}
                >
                  <div className="send">
                    <div>
                      <span>Send exactly</span>
                      <TakaFlow value={order.advance} className="amt" />
                    </div>
                    <CopyButton value={String(order.advance)} label="advance amount" />
                  </div>
                  <dl className="kv bank">
                    {BANK.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>
                          {v}
                          <CopyButton value={v} label={k.toLowerCase()} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <SlipUpload slip={slip} onChange={setSlip} error={slipError} onError={setSlipError} />
                  {showRef ? (
                    <Field label="Transaction ID" value={reference} onChange={setReference} />
                  ) : (
                    <button type="button" onClick={() => setShowRef(true)} className="link">
                      No screenshot? Enter the transaction ID
                    </button>
                  )}
                  <button type="button" onClick={accept} disabled={!ready || status === "saving"} className="btn">
                    {status === "saving" ? "Submitting…" : "Submit order"}
                  </button>
                  {status === "error" && <p className="err">{error}</p>}
                  <p className="note">We check the payment and confirm on WhatsApp.</p>
                </Step>
              </div>
            </>
          )}
        </section>
      </article>

      {/* Dock: total, Chat (WhatsApp) and Sign */}
      {!result && (
        <div className="wo-dock print:hidden" data-show={dock || undefined} inert={!dock}>
          <div className="tot">
            <span>Total</span>
            <TakaFlow value={order.total} className="amt" />
          </div>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
            <i aria-hidden="true" />
            Chat
          </a>
          <button type="button" onClick={scrollToFlow} aria-label={step === 3 ? "Pay the advance" : "Review and sign"}>
            <span className="lbl" aria-hidden="true">
              <span data-on={step !== 3}>Sign ↓</span>
              <span data-on={step === 3}>Pay ↓</span>
            </span>
          </button>
        </div>
      )}

      {/* Rendered straight into <body> so print can hide everything else */}
      {result &&
        createPortal(
          <PrintOrder
            result={result}
            business={business}
            signer={signer}
            phone={phone}
            order={order}
            catalog={catalog}
            signature={signaturePng}
            reference={reference}
            hasSlip={Boolean(slip)}
          />,
          document.body,
        )}
    </>
  )
}

// The scope under a deliverable is long, so it stays folded until it's asked for. The row it sits in
// toggles the line item, so the fold's button stops the click.
function Scope({ count, children }: { count: number; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div data-open={open || undefined}>
      <button
        type="button"
        className="scope-t"
        aria-expanded={open}
        aria-controls={id}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && e.stopPropagation()}
      >
        <span className="plus" aria-hidden="true" />
        {open ? "Hide features" : `${count} features included`}
      </button>
      <div className="scope-b" id={id} inert={!open}>
        <div>
          <div className="scope-in">{children}</div>
        </div>
      </div>
    </div>
  )
}

function ScopeGroups({ groups }: { groups: FeaturePointGroup[] }) {
  const count = groups.reduce((n, g) => n + g.points.length, 0)
  return (
    <Scope count={count}>
      {groups.map((g) => (
        <div key={g.title}>
          <h4>{g.title}</h4>
          <ul>
            {g.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </Scope>
  )
}

// One step of the accept flow: open shows its body, done folds to a single summary line
function Step({
  n,
  step,
  title,
  summary,
  onEdit,
  stepRef,
  children,
}: {
  n: 1 | 2 | 3
  step: 1 | 2 | 3
  title: ReactNode
  summary?: string
  onEdit?: () => void
  stepRef: (el: HTMLDivElement | null) => void
  children: ReactNode
}) {
  const open = step === n
  const done = step > n
  return (
    <div ref={stepRef} className="stp" data-open={open || undefined} data-done={done || undefined}>
      <div className="stp-h">
        <span className="n" aria-hidden="true">
          {done ? "✓ " : ""}
          {pad(n - 1)}
        </span>
        <h3>
          <span className="sr-only">Step {n}: </span>
          {title}
        </h3>
        {done && onEdit && (
          <button type="button" className="edit" onClick={onEdit}>
            Edit
          </button>
        )}
        {done && summary && <p className={`sum ${isBangla(summary) ? "bn" : ""}`}>{summary}</p>}
      </div>
      <div className="stp-b" inert={!open}>
        <div>
          <div className="stp-in">{children}</div>
        </div>
      </div>
    </div>
  )
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  return (
    <button
      type="button"
      className="copy"
      aria-label={`Copy ${label}`}
      data-done={copied || undefined}
      onClick={() =>
        navigator.clipboard
          ?.writeText(value)
          .then(() => {
            setCopied(true)
            clearTimeout(timer.current)
            timer.current = window.setTimeout(() => setCopied(false), 1400)
          })
          .catch(() => {})
      }
    >
      <span>Copy</span>
      <span aria-hidden="true">Copied</span>
    </button>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  disabled?: boolean
  autoComplete?: string
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        autoComplete={autoComplete}
        inputMode={type === "tel" ? "tel" : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={isBangla(value) ? "bn" : undefined}
      />
    </label>
  )
}

function Confirmation({ result, business, reference, hasSlip }: { result: Result; business: string; reference: string; hasSlip: boolean }) {
  const proof = [hasSlip && "screenshot", reference.trim() && `reference ${reference.trim()}`].filter(Boolean).join(" and ")
  return (
    <div className="done-card">
      <div className="tag">
        <span>Signed · payment in review</span>
        <span>{result.number}</span>
      </div>
      <h2>Let’s build it.</h2>
      <p>
        Thank you{business ? <span className={isBangla(business) ? "bn" : ""}>, {business}</span> : ""}. Work order <b>{result.number}</b> is signed,
        with your payment {proof}. We’ll verify the <b>{taka(result.advance)}</b> advance and confirm on WhatsApp — work starts as soon as it
        clears.
      </p>
      <div className="acts">
        <a
          className="btn"
          href={`https://wa.me/8801733670129?text=${encodeURIComponent(`Hi Arc Labs, I've signed work order ${result.number} and paid the advance.`)}`}
          target="_blank"
          rel="noreferrer"
        >
          Message us on WhatsApp
        </a>
        <button type="button" className="btn ghost" onClick={() => window.print()}>
          Download PDF
        </button>
      </div>
    </div>
  )
}

// Screenshots are downscaled to ≤1600px JPEG in the browser, keeping uploads small on mobile data
async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL("image/jpeg", 0.82)
}

function SlipUpload({
  slip,
  onChange,
  error,
  onError,
}: {
  slip: { url: string; name: string } | null
  onChange: (s: { url: string; name: string } | null) => void
  error: string
  onError: (e: string) => void
}) {
  return (
    <div className="grid gap-2">
      {slip ? (
        <div className="slip has">
          <span className="ic">
            <img src={slip.url} alt="Payment screenshot" />
          </span>
          <span className="tx">
            <span>{slip.name}</span>
            <small>Screenshot added</small>
          </span>
          <button type="button" className="link" onClick={() => onChange(null)}>
            Remove
          </button>
        </div>
      ) : (
        <label className="slip">
          <span className="ic" aria-hidden="true">
            ↑
          </span>
          <span className="tx">
            <span>Add payment screenshot</span>
            <small>From your bank app, after you send it</small>
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              e.target.value = ""
              if (!file) return
              onError("")
              try {
                onChange({ url: await compressImage(file), name: file.name })
              } catch {
                onError("That image couldn't be read. Try a JPG or PNG screenshot.")
              }
            }}
          />
        </label>
      )}
      {error && <p className="err">{error}</p>}
    </div>
  )
}

// Light, print-only copy of the signed order — what "Download PDF" saves
function PrintOrder({
  result,
  business,
  signer,
  phone,
  order,
  catalog,
  signature,
  reference,
  hasSlip,
}: {
  result: Result
  business: string
  signer: string
  phone: string
  order: ReturnType<typeof priceSelection>
  catalog: Catalog
  signature: string | null
  reference: string
  hasSlip: boolean
}) {
  const date = new Date(result.signedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
  const mono = "font-mono text-[8pt] uppercase tracking-[0.2em] text-[#6f6a62]"
  return (
    <div id="print-order" className="hidden min-h-[297mm] bg-white p-[12mm] text-[10pt] leading-[1.5] text-[#141210]" style={{ fontFamily: "Geist, sans-serif" }}>
      <div className="bg-black p-[8mm] text-[#ede8df]" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
        <div className="flex justify-between font-mono text-[8pt] uppercase tracking-[0.22em] text-[#8f887d]">
          <span>Work order</span>
          <span>{result.number}</span>
        </div>
        <div className="mt-[6mm] flex items-end gap-[3mm]">
          <span className="font-display text-[40pt] font-black lowercase leading-[0.85] tracking-[-0.035em]">arc</span>
          <img src="/ampersand-chrome-2.webp" alt="&" className="h-[14mm] w-auto" />
          <span className={`${isBangla(business) ? "bn font-bold" : "font-display font-black lowercase"} text-[34pt] leading-[0.9]`}>{business}</span>
        </div>
        <div className="mt-[6mm] flex gap-[10mm] font-mono text-[8pt] uppercase tracking-[0.2em] text-[#8f887d]">
          <span>Signed {date}</span>
          <span>Delivery {catalog.delivery}</span>
          <span>Total {taka(order.total)}</span>
        </div>
      </div>
      <table className="mt-[6mm] w-full border-collapse">
        <thead>
          <tr className={mono}>
            <th className="border-b border-[#141210] pb-[2mm] text-left font-normal">Deliverable</th>
            <th className="border-b border-[#141210] pb-[2mm] text-right font-normal">Compare-at</th>
            <th className="border-b border-[#141210] pb-[2mm] text-right font-normal">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((l) => (
            <tr key={l.feature.id}>
              <td className="border-b border-[#dcd6cc] py-[1.6mm]">
                {lineLabel(l)}
                {l.feature.points?.map((p) => (
                  <div key={p} className="text-[8pt] leading-[1.35] text-[#6f6a62]">
                    — {p}
                  </div>
                ))}
                {l.feature.pointGroups?.map((g) => (
                  <div key={g.title}>
                    <div className="mt-[1mm] font-mono text-[7pt] uppercase tracking-[0.16em] text-[#141210]">{g.title}</div>
                    {g.points.map((p) => (
                      <div key={p} className="text-[8pt] leading-[1.35] text-[#6f6a62]">
                        — {p}
                      </div>
                    ))}
                  </div>
                ))}
              </td>
              <td className="border-b border-[#dcd6cc] py-[1.6mm] text-right text-[#6f6a62] line-through">{taka(l.compareAt)}</td>
              <td className="border-b border-[#dcd6cc] py-[1.6mm] text-right">{taka(l.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-[4mm] flex justify-end gap-[10mm]">
        <div className="text-right">
          <div className={mono}>Total</div>
          <div className="text-[22pt] font-semibold leading-tight">{taka(order.total)}</div>
          <div className="text-[9pt] text-[#e2432c]">You save {taka(order.savings)}</div>
        </div>
      </div>
      <div className="mt-[5mm] grid grid-cols-2 border border-[#dcd6cc]">
        <div className="p-[4mm]">
          <div className={mono}>Advance 50% — to start</div>
          <div className="text-[14pt] font-semibold">{taka(order.advance)}</div>
        </div>
        <div className="border-l border-[#dcd6cc] p-[4mm]">
          <div className={mono}>Final 50% — before handover</div>
          <div className="text-[14pt] font-semibold">{taka(order.total - order.advance)}</div>
        </div>
      </div>
      <div className="mt-[3mm] flex justify-between gap-[6mm] text-[8.5pt] text-[#6f6a62]">
        <span>
          <b className="font-medium text-[#141210]">Advance paid</b> by bank transfer · {BANK.map(([, v]) => v).slice(0, 3).join(" · ")}
        </span>
        <span className="shrink-0">
          {[reference.trim() && `Ref ${reference.trim()}`, hasSlip && "screenshot attached"].filter(Boolean).join(" · ")} · in review
        </span>
      </div>
      <div className="mt-[5mm] grid grid-cols-2 gap-x-[8mm]">
        {catalog.terms.map(([k, v]) => (
          <div key={k} className="border-t border-[#dcd6cc] py-[1.6mm] text-[8.5pt] leading-[1.4]">
            <b className="font-medium">{k}</b> — <span className="text-[#6f6a62]">{v}</span>
          </div>
        ))}
      </div>
      <div className="mt-[5mm] grid grid-cols-2 gap-[10mm]" style={{ breakInside: "avoid" }}>
        <div>
          <div className="relative h-[16mm] border-b border-[#141210]">
            <img src="/signature-talha.png" alt="" className="absolute bottom-[-2mm] left-[2mm] h-[15mm]" />
          </div>
          <div className="mt-[2mm] font-medium">Talha Chowdhury</div>
          <div className="text-[9pt] text-[#6f6a62]">Founder, Arc Labs Corporation</div>
        </div>
        <div>
          <div className="relative h-[16mm] border-b border-[#141210]">
            {signature && <img src={signature} alt="" className="absolute bottom-0 left-0 h-[16mm]" />}
          </div>
          <div className="mt-[2mm] font-medium">{signer}</div>
          <div className={`text-[9pt] text-[#6f6a62] ${isBangla(business) ? "bn" : ""}`}>
            For {business} · {phone} · {date}
          </div>
        </div>
      </div>
      <div className="mt-[5mm] flex justify-between border-t border-[#dcd6cc] pt-[3mm] font-mono text-[8pt] uppercase tracking-[0.2em] text-[#6f6a62]">
        <span>WhatsApp {WHATSAPP}</span>
        <span>arc-bangladesh.com</span>
      </div>
    </div>
  )
}
