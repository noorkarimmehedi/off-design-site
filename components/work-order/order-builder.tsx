"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  BANK,
  CATALOG,
  defaultSelection,
  lineLabel,
  priceSelection,
  taka,
  TERMS,
  type Feature,
  type Line,
  type Selection,
} from "@/lib/work-order/catalog"
import AsciiHands from "@/components/ascii-hands"
import RevealOnView from "@/components/reveal-on-view"
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button"
import { TakaFlow } from "@/components/ui/number-flow"
import SignatureField, { type SignatureFieldHandle } from "./signature-field"

const CORAL = "text-[#ff5941]"
const WHATSAPP = "+880 1733-670129"
const isBangla = (s: string) => /[ঀ-৿]/.test(s)
const pad = (i: number) => String(i + 1).padStart(2, "0")

const BTN =
  "w-full py-4 font-mono text-[12px] uppercase tracking-[0.2em] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
const LINK = "self-start text-left text-[13px] text-stone underline decoration-stone/40 underline-offset-4 transition-colors hover:text-ivory"

type Result = { number: string; total: number; advance: number; signedAt: string }

export default function OrderBuilder({
  slug,
  clientName,
  preset,
  nameLocked = false,
  header,
}: {
  slug: string
  clientName?: string
  preset?: Selection
  /** Name came from a saved client entry, so the client can't edit it */
  nameLocked?: boolean
  /** Site header, rendered inside the hero so the ASCII hands sit relative to it */
  header: ReactNode
}) {
  const [selection, setSelection] = useState<Selection>(() => defaultSelection(preset))
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
  const padRef = useRef<SignatureFieldHandle>(null)
  const signRef = useRef<HTMLElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollOnOpen = useRef(false)
  const asideRef = useRef<HTMLElement>(null)

  // Desktop: the sticky work order sits in the vertical middle of the screen, never above 32px
  useEffect(() => {
    const aside = asideRef.current
    if (!aside) return
    const place = () => {
      aside.style.setProperty("--sticky-top", `${Math.max(32, (window.innerHeight - aside.offsetHeight) / 2)}px`)
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(aside)
    window.addEventListener("resize", place)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", place)
    }
  }, [])

  const order = useMemo(() => priceSelection(selection), [selection])
  const locked = Boolean(result)
  const paid = Boolean(reference.trim() || slip)
  const detailsDone = Boolean(business.trim() && signer.trim() && phone.trim())
  const ready = detailsDone && signaturePng && paid

  // Opening a step scrolls its header into view once it has expanded — on phones the next step starts below the fold
  const goTo = (n: 1 | 2 | 3) => {
    scrollOnOpen.current = true
    setStep(n)
  }
  const onStepOpened = (n: number) => {
    if (!scrollOnOpen.current) return
    scrollOnOpen.current = false
    const el = stepRefs.current[n - 1]
    // Only scroll when the step's header has gone off screen
    if (el && (el.getBoundingClientRect().top < 0 || el.getBoundingClientRect().top > window.innerHeight * 0.6)) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }
  const sign = async () => {
    const png = await padRef.current?.toPng()
    if (!png) return
    setSignaturePng(png)
    goTo(3)
  }
  const scrollToFlow = () => (stepRefs.current[step - 1] ?? signRef.current)?.scrollIntoView({ behavior: "smooth", block: "start" })

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
        body: JSON.stringify({ business, slug, signer, phone, email, selection, signature, agreed: true, reference, slip: slip?.url }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.")
      setResult(json)
      setStatus("idle")
      requestAnimationFrame(() => signRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
    } catch (e) {
      setStatus("error")
      setError(e instanceof Error ? e.message : "Something went wrong.")
    }
  }

  const name = business.trim() || "your business"

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" precedence="default" />
      <style>{`
        .bn { font-family: 'Hind Siliguri', var(--font-sans); }
        /* Phones: the glass dock replaces the site's bottom fade and carries the Chat button */
        @media (max-width: 1023px) { [data-edge-blur="bottom"], [data-chat-widget] { display: none !important; } }
        /* Liquid glass: frosted + saturated backdrop, a light rim brighter at the top-left, inner sheen, soft drop shadow */
        .liquid-glass {
          position: relative;
          isolation: isolate;
          background: color-mix(in srgb, var(--color-ivory) 6%, rgb(0 0 0 / 0.42));
          -webkit-backdrop-filter: blur(3px) saturate(220%) brightness(1.15);
          backdrop-filter: blur(3px) saturate(220%) brightness(1.15);
          box-shadow:
            inset 0 1px 0.5px rgb(255 255 255 / 0.28),
            inset 0 -1px 1px rgb(255 255 255 / 0.06),
            0 1px 2px rgb(0 0 0 / 0.25),
            0 18px 44px -14px rgb(0 0 0 / 0.65);
        }
        .liquid-glass::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgb(255 255 255 / 0.55), rgb(255 255 255 / 0.08) 35%, rgb(255 255 255 / 0.04) 65%, rgb(255 255 255 / 0.3));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .liquid-glass::after {
          content: "";
          position: absolute;
          inset: 1px 1px 50% 1px;
          border-radius: inherit;
          border-bottom-left-radius: 40% 30%;
          border-bottom-right-radius: 40% 30%;
          background: linear-gradient(to bottom, rgb(255 255 255 / 0.14), rgb(255 255 255 / 0));
          pointer-events: none;
          z-index: -1;
        }
        .liquid-glass-button {
          color: #141210;
          background: linear-gradient(to bottom, rgb(255 255 255 / 0.96), rgb(237 232 223 / 0.88));
          box-shadow:
            inset 0 1px 0 rgb(255 255 255 / 0.9),
            inset 0 -1px 1px rgb(0 0 0 / 0.08),
            0 6px 16px -6px rgb(0 0 0 / 0.5);
        }
        html.light .liquid-glass {
          background: rgb(255 255 255 / 0.5);
          box-shadow:
            inset 0 1px 0.5px rgb(255 255 255 / 0.9),
            inset 0 -1px 1px rgb(0 0 0 / 0.04),
            0 1px 2px rgb(0 0 0 / 0.08),
            0 18px 40px -16px rgb(0 0 0 / 0.28);
        }
        html.light .liquid-glass::before {
          background: linear-gradient(135deg, rgb(255 255 255 / 1), rgb(0 0 0 / 0.06) 40%, rgb(0 0 0 / 0.04) 70%, rgb(255 255 255 / 0.9));
        }
        html.light .liquid-glass-button {
          color: #fff;
          background: linear-gradient(to bottom, #2a2620, #141210);
          box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.18), 0 6px 16px -6px rgb(0 0 0 / 0.4);
        }
        @media print {
          @page { size: A4; margin: 0; }
          html, body { background: #fff !important; }
          body > *:not(#print-order) { display: none !important; }
          #print-order { display: block !important; }
        }
      `}</style>

      {/* Hero: a shorter take on the home page — header, ASCII hands and a centred headline */}
      <section className="relative flex flex-col sm:min-h-[62svh] print:hidden">
        {header}
        <AsciiHands />
        <RevealOnView
          as="div"
          intensity="hero"
          staggerChildren
          className="relative z-10 mx-2 mt-2 flex flex-col items-center border border-ivory/25 px-3 pt-8 pb-8 text-center sm:mx-auto sm:mt-0 sm:w-full sm:max-w-[964px] sm:flex-1 sm:justify-center sm:border-0 sm:px-10 sm:pt-28 sm:pb-6 lg:pt-10"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone">
            Work order · <span className="text-ivory">{result ? result.number : "Draft"}</span>
          </span>
          <h1 className="font-display mt-5 text-[13vw] font-black lowercase leading-[0.85] tracking-[-0.035em] sm:text-[88px] lg:text-[104px]">
            build your order.
          </h1>
          <div className="mt-5 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-[32px] sm:text-[48px]">
            {/* Playfair's low x-height reads small beside Bangla, so "arc" runs larger than the line */}
            <span className="font-display text-[1.3em] font-black lowercase leading-[0.8] tracking-[-0.035em]">arc</span>
            <img src="/ampersand-chrome-2.webp" alt="&" className="h-[1.3em] w-auto self-center light:invert" />
            {/* Follows the Business name field, so a corrected spelling shows here too */}
            {business.trim() ? (
              <span className={`${isBangla(business) ? "bn font-bold" : "font-display font-black lowercase tracking-[-0.035em]"} leading-none`}>
                {business.trim()}
              </span>
            ) : (
              <span className="font-display font-black lowercase leading-none tracking-[-0.035em] text-stone">you</span>
            )}
          </div>
          <p className="mx-auto mt-6 max-w-[560px] text-[15px] leading-relaxed text-stone sm:text-[16px]">
            <span className="text-ivory">Pick what your business needs.</span> Your price updates as you go — when it looks right, sign
            below and we start as soon as the advance is confirmed.
          </p>
          <span aria-hidden="true" className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-stone">
            Scroll to build ↓
          </span>
        </RevealOnView>
      </section>

      <div className="relative z-10 mx-auto w-full max-w-[1120px] px-2 pb-40 pt-0 sm:px-10 lg:pb-24 print:hidden">

        <div className="mt-4 grid gap-10 sm:mt-4 lg:grid-cols-[1fr_360px] lg:gap-12">
          {/* Feature picker */}
          <div className="flex flex-col gap-10">
            {CATALOG.map((group, gi) => (
              <RevealOnView as="section" key={group.id} delay={gi < 2 ? 0.35 + gi * 0.12 : 0}>
                <div className="flex items-baseline justify-between border-b border-line pb-3">
                  <h2 id={`g-${group.id}`} className="font-mono text-[11px] uppercase tracking-[0.22em] text-ivory">
                    <span className={group.id === "grow" ? CORAL : "text-stone"}>{pad(gi)}</span> / {group.title}
                  </h2>
                  <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${group.id === "grow" ? CORAL : "text-stone"}`}>
                    {group.note}
                  </span>
                </div>
                <ul className="mt-3 flex flex-col gap-2">
                  {group.features.map((f) => {
                    const qty = selection[f.id] ?? 0
                    const on = qty > 0
                    return (
                      <li key={f.id}>
                        <div
                          role="checkbox"
                          aria-checked={on}
                          aria-disabled={f.required || locked}
                          tabIndex={f.required || locked ? -1 : 0}
                          onClick={() => toggle(f)}
                          onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), toggle(f))}
                          className={`group grid grid-cols-[20px_1fr] gap-x-4 gap-y-2 border px-4 py-4 transition-colors sm:grid-cols-[20px_1fr_auto] sm:px-5 ${
                            on ? "border-ivory/30 bg-ivory/[0.04]" : "border-line hover:border-ivory/20"
                          } ${f.required || locked ? "cursor-default" : "cursor-pointer"} outline-none focus-visible:border-ivory/60`}
                        >
                          <span
                            aria-hidden
                            className={`mt-0.5 flex h-5 w-5 items-center justify-center border text-[12px] ${
                              on ? "border-[#ff5941] bg-[#ff5941] text-black" : "border-ivory/25"
                            }`}
                          >
                            {on && "✓"}
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[16px] font-medium tracking-[-0.01em]">{f.name}</span>
                              {f.required && (
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone">Included</span>
                              )}
                            </div>
                            <p className="mt-1 text-[13.5px] leading-relaxed text-stone">{f.detail}</p>
                            {f.perUnit && (
                              <div className="mt-3 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  aria-label={`Fewer ${f.perUnit.label}`}
                                  disabled={locked || qty <= f.perUnit.min}
                                  onClick={() => setQty(f, qty - 1)}
                                  className="h-8 w-8 border border-line font-mono text-[14px] transition-colors hover:border-ivory/40 disabled:opacity-30"
                                >
                                  −
                                </button>
                                <span className="min-w-[72px] text-center font-mono text-[12px] tabular-nums tracking-[0.1em]">
                                  {qty} {f.perUnit.label}
                                </span>
                                <button
                                  type="button"
                                  aria-label={`More ${f.perUnit.label}`}
                                  disabled={locked || qty >= f.perUnit.max}
                                  onClick={() => setQty(f, qty + 1)}
                                  className="h-8 w-8 border border-line font-mono text-[14px] transition-colors hover:border-ivory/40 disabled:opacity-30"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="col-start-2 flex items-baseline gap-2 sm:col-start-3 sm:flex-col sm:items-end sm:gap-0.5">
                            <span className="text-[16px] font-medium tabular-nums">
                              {taka(f.price)}
                              {f.perUnit && <span className="text-[12px] text-stone"> each</span>}
                            </span>
                            <span className="text-[12.5px] tabular-nums text-stone line-through decoration-stone/60">{taka(f.compareAt)}</span>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </RevealOnView>
            ))}
          </div>

          {/* Live work order */}
          <aside ref={asideRef} className="lg:sticky lg:top-[var(--sticky-top,2rem)] lg:self-start">
            <RevealOnView className="border border-line" delay={0.5}>
              <div className="flex items-end justify-between gap-4 border-b border-line px-5 py-4">
                <div className="min-w-0">
                  <div className="font-display text-[30px] font-black lowercase leading-none tracking-[-0.035em]">work order.</div>
                  <div className={`mt-2 truncate text-[13px] text-stone ${isBangla(name) ? "bn" : ""}`}>For {name}</div>
                </div>
                <span className="shrink-0 border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-stone tabular-nums">
                  {order.lines.length} {order.lines.length === 1 ? "item" : "items"}
                </span>
              </div>
              <OrderLines lines={order.lines} locked={locked} onRemove={toggle} />
              <div className="border-t border-line px-5 py-4">
                <div className="flex items-baseline justify-between text-[13px] text-stone">
                  <span>Compare-at</span>
                  <TakaFlow value={order.compareAt} strike />
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">Total</span>
                  <TakaFlow value={order.total} className="text-[34px] font-semibold leading-none tracking-[-0.03em]" />
                </div>
                {order.savings > 0 && (
                  <div className={`mt-2 text-right font-mono text-[11px] uppercase tracking-[0.15em] ${CORAL}`}>
                    You save <TakaFlow value={order.savings} />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 border-t border-line">
                <div className="px-5 py-4">
                  <div className={`font-mono text-[10px] uppercase tracking-[0.18em] ${CORAL}`}>Advance 50%</div>
                  <TakaFlow value={order.advance} className="mt-1 text-[18px] font-semibold" />
                </div>
                {/* Right-aligned on phones so it lines up with the prices above */}
                <div className="border-l border-line px-5 py-4 text-right lg:text-left">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">Final 50%</div>
                  <TakaFlow value={order.total - order.advance} className="mt-1 text-[18px] font-semibold" />
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                <span>Delivery</span>
                <span className="text-ivory">7–15 days</span>
              </div>
            </RevealOnView>
            {!result && (
              <button
                type="button"
                onClick={scrollToFlow}
                className="mt-3 hidden w-full bg-ivory py-3.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-90 lg:block"
              >
                Review & sign ↓
              </button>
            )}
          </aside>
        </div>

        {/* Accept: details → review & sign → pay the advance, in one card */}
        <section ref={signRef} className="mt-20 scroll-mt-8" aria-labelledby="sign-heading">
          {result ? (
            <Confirmation result={result} business={business} reference={reference} hasSlip={Boolean(slip)} />
          ) : (
            <>
              <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-stone">
                <span>Sign & pay</span>
                <span className="h-px flex-1 bg-line" />
                <TakaFlow value={order.total} />
              </div>
              {/* Desktop: heading on the left, centred against the steps on the right — together the full width of the builder above */}
              <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,620px)] lg:gap-12">
                <div className="lg:self-center">
                  <h2 id="sign-heading" className="font-display text-[40px] font-black lowercase leading-[0.95] tracking-[-0.035em] sm:text-[56px] lg:text-[72px]">
                    sign & start.
                  </h2>
                  <p className="mt-3 max-w-[420px] text-[15px] leading-relaxed text-stone lg:mt-5">Three short steps. Work starts once the advance is confirmed.</p>
                </div>

              <div className="border border-line bg-ivory/[0.015]">
                {/* 1 — details */}
                <Step
                  n={1}
                  step={step}
                  onOpened={onStepOpened}
                  title="Your details"
                  summary={`${signer.trim()} · ${phone.trim()}`}
                  onEdit={() => goTo(1)}
                  stepRef={(el) => { stepRefs.current[0] = el }}
                >
                  <Field label="Business name" value={business} onChange={setBusiness} disabled={nameLocked} autoComplete="organization" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Your full name" value={signer} onChange={setSigner} autoComplete="name" />
                    <Field label="Phone / WhatsApp" value={phone} onChange={setPhone} type="tel" autoComplete="tel" />
                  </div>
                  {showEmail ? (
                    <Field label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" />
                  ) : (
                    <button type="button" onClick={() => setShowEmail(true)} className={LINK}>
                      + Add email for a copy (optional)
                    </button>
                  )}
                  <button type="button" onClick={() => goTo(2)} disabled={!detailsDone} className={`${BTN} bg-ivory text-ink`}>
                    Continue
                  </button>
                </Step>

                {/* 2 — review & sign */}
                <Step
                  n={2}
                  step={step}
                  onOpened={onStepOpened}
                  title="Review & sign"
                  summary={`Signed by ${signer.trim()}`}
                  onEdit={() => goTo(2)}
                  stepRef={(el) => { stepRefs.current[1] = el }}
                >
                  <dl className="border border-line text-[13.5px]">
                    {[
                      ["Total", <TakaFlow key="t" value={order.total} />],
                      [
                        "Payment",
                        <span key="p">
                          <TakaFlow value={order.advance} /> now · <TakaFlow value={order.total - order.advance} /> at handover
                        </span>,
                      ],
                      ["Delivery", "7–15 days after the advance"],
                    ].map(([k, v], i) => (
                      <div key={i} className="flex justify-between gap-4 border-b border-line px-4 py-2.5 last:border-b-0">
                        <dt className="text-stone">{k}</dt>
                        <dd className="text-right tabular-nums">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <details className="group text-[13px] text-stone">
                    <summary className={`${LINK} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
                      <span className="group-open:hidden">Read all {TERMS.length} terms</span>
                      <span className="hidden group-open:inline">Hide terms</span>
                    </summary>
                    <ol className="mt-3 flex flex-col gap-2.5">
                      {TERMS.map(([k, v], i) => (
                        <li key={k} className="grid grid-cols-[28px_1fr] leading-relaxed">
                          <span className={`font-mono text-[10px] tracking-[0.15em] ${CORAL} pt-1`}>{pad(i)}</span>
                          <span>
                            <span className="text-ivory">{k}.</span> {v}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </details>
                  <SignatureField ref={padRef} name={signer} onChange={setSigned} />
                  <button type="button" onClick={sign} disabled={!signed} className={`${BTN} bg-ivory text-ink`}>
                    Sign & continue
                  </button>
                  <p className="-mt-1 text-center text-[12.5px] text-stone">Signing means you accept this work order and its terms.</p>
                </Step>

                {/* 3 — pay the advance; required before the order can be accepted */}
                <Step n={3} step={step} onOpened={onStepOpened} title={<>Pay the <TakaFlow value={order.advance} /> advance</>} stepRef={(el) => { stepRefs.current[2] = el }}>
                  <div className="flex items-center justify-between gap-4 border border-[#ff5941] px-4 py-3.5">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">Send exactly</div>
                      <TakaFlow value={order.advance} className="text-[26px] font-semibold tracking-[-0.02em]" />
                    </div>
                    <CopyButton value={String(order.advance)} label="advance amount" />
                  </div>
                  <dl className="border border-line">
                    {BANK.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 border-b border-line py-2 pl-4 pr-2 last:border-b-0 sm:grid-cols-[130px_minmax(0,1fr)_auto]">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone sm:col-auto">{k}</dt>
                        <dd className="col-start-1 font-mono text-[14px] tracking-[0.02em] [overflow-wrap:anywhere] sm:col-start-auto">{v}</dd>
                        <CopyButton value={v} label={k.toLowerCase()} className="col-start-2 row-span-2 row-start-1 sm:col-start-auto sm:row-span-1 sm:row-start-auto" />
                      </div>
                    ))}
                  </dl>
                  <SlipUpload slip={slip} onChange={setSlip} error={slipError} onError={setSlipError} />
                  {showRef ? (
                    <Field label="Transaction ID" value={reference} onChange={setReference} />
                  ) : (
                    <button type="button" onClick={() => setShowRef(true)} className={LINK}>
                      No screenshot? Enter the transaction ID
                    </button>
                  )}
                  <LiquidMetalButton
                    label={status === "saving" ? "Submitting…" : "Submit order"}
                    onClick={accept}
                    disabled={!ready || status === "saving"}
                  />
                  {status === "error" && <p className={`-mt-1 text-center text-[13px] ${CORAL}`}>{error}</p>}
                  <p className="-mt-1 text-center text-[12.5px] text-stone">We check the payment and confirm on WhatsApp.</p>
                </Step>
              </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Mobile dock: floating liquid-glass pill with the total, Chat (WhatsApp) and Sign */}
      {!result && (
        <div className="fixed inset-x-2 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[45] lg:hidden print:hidden">
          <div className="liquid-glass flex items-center gap-2 rounded-[26px] py-2 pl-5 pr-2">
            <div className="relative min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ivory/60">Total</span>
                <TakaFlow value={order.compareAt} strike className="text-[11px] text-ivory/55" />
              </div>
              <TakaFlow value={order.total} className="block text-[22px] font-semibold leading-tight tracking-[-0.02em]" />
            </div>
            <a
              href="https://api.whatsapp.com/send/?phone=8801733670129"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="liquid-glass ml-auto flex h-[46px] shrink-0 items-center gap-2 rounded-[20px] px-3.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-transform active:scale-95"
            >
              <span aria-hidden="true" className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ff5941] opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[#ff5941]" />
              </span>
              Chat
            </a>
            <button
              type="button"
              onClick={scrollToFlow}
              className="liquid-glass-button relative h-[46px] shrink-0 rounded-[20px] px-5 font-mono text-[11px] uppercase tracking-[0.2em] transition-transform active:scale-95"
            >
              {step === 3 ? "Pay ↓" : "Sign ↓"}
            </button>
          </div>
        </div>
      )}

      {/* Rendered straight into <body> so print can hide everything else */}
      {result &&
        createPortal(
          <PrintOrder result={result} business={business} signer={signer} phone={phone} order={order} signature={signaturePng} reference={reference} hasSlip={Boolean(slip)} />,
          document.body,
        )}
    </>
  )
}

// The live work order's line items, grouped by catalogue section. Add-ons can be removed
// right here; lines slide in and out as the selection changes.
function OrderLines({ lines, locked, onRemove }: { lines: Line[]; locked: boolean; onRemove: (f: Feature) => void }) {
  const reduce = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const
  const groups = CATALOG.map((g) => ({ group: g, lines: lines.filter((l) => g.features.includes(l.feature)) })).filter((g) => g.lines.length)
  const fold = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: reduce ? 0 : 0.35, ease },
  }
  return (
    <div className="max-h-[360px] overflow-y-auto px-5 pb-4 pt-1" data-lenis-prevent>
      <AnimatePresence initial={false}>
        {groups.map(({ group, lines }) => (
          <motion.section key={group.id} {...fold} className="overflow-hidden" aria-label={group.title}>
            <h3 className="pb-1 pt-3 font-mono text-[9.5px] uppercase tracking-[0.2em] text-stone">{group.title}</h3>
            <ul>
              <AnimatePresence initial={false}>
                {lines.map((l) => {
                  const f = l.feature
                  const removable = !f.required && !locked
                  return (
                    <motion.li key={f.id} {...fold} className="overflow-hidden">
                      <div className="group/line -mx-2 flex items-center gap-2.5 px-2 py-1.5 transition-colors hover:bg-ivory/[0.035]">
                        <div className="min-w-0 flex-1">
                          <div className="text-[13.5px] leading-snug text-ivory/90">{f.name}</div>
                          {f.perUnit && (
                            <div className="text-[12px] tabular-nums text-stone">
                              {l.qty} {f.perUnit.label} × {taka(f.price)}
                            </div>
                          )}
                        </div>
                        {/* Core items say "Included"; add-ons get a remove button in the same spot, so prices stay flush right */}
                        {f.required && <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone">Included</span>}
                        {removable && (
                          <button
                            type="button"
                            onClick={() => onRemove(f)}
                            aria-label={`Remove ${f.name}`}
                            className="flex size-6 shrink-0 items-center justify-center text-[15px] leading-none text-stone transition-[opacity,color] hover:text-[#ff5941] focus-visible:opacity-100 lg:opacity-0 lg:group-hover/line:opacity-100"
                          >
                            ×
                          </button>
                        )}
                        <TakaFlow value={l.price} className="min-w-[68px] shrink-0 text-right text-[13.5px] tabular-nums" />
                      </div>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ul>
          </motion.section>
        ))}
      </AnimatePresence>
    </div>
  )
}

// One step of the accept flow: open shows its body, done folds to a single summary line
function Step({
  n,
  step,
  title,
  summary,
  onEdit,
  onOpened,
  stepRef,
  children,
}: {
  n: 1 | 2 | 3
  step: 1 | 2 | 3
  title: ReactNode
  summary?: string
  onEdit?: () => void
  onOpened?: (n: number) => void
  stepRef: (el: HTMLDivElement | null) => void
  children: ReactNode
}) {
  const open = step === n
  const done = step > n
  const reduce = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const
  return (
    <div ref={stepRef} className="scroll-mt-6 border-b border-line last:border-b-0">
      <div className="grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6">
        <span
          aria-hidden="true"
          className={`flex h-6 w-6 items-center justify-center border font-mono text-[11px] transition-colors duration-300 ${
            done ? "border-ivory bg-ivory text-ink" : open ? "border-ivory text-ivory" : "border-line text-stone"
          }`}
        >
          {done ? "✓" : n}
        </span>
        <div className="min-w-0">
          <h3 className={`text-[15px] font-medium transition-colors duration-300 ${open || done ? "" : "text-stone"}`}>
            <span className="sr-only">Step {n}: </span>
            {title}
          </h3>
          <AnimatePresence initial={false}>
            {done && summary && (
              <motion.p
                key="summary"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.35, ease }}
                className={`truncate text-[13px] text-stone ${isBangla(summary) ? "bn" : ""}`}
              >
                {summary}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {done && onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="px-1 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-stone transition-colors hover:text-ivory"
          >
            Edit
          </button>
        ) : (
          <span />
        )}
      </div>
      {/* Height animates to the content; the body rises in a beat behind it */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: reduce ? 0 : 0.5, ease }, opacity: { duration: reduce ? 0 : 0.3 } }}
            onAnimationComplete={(def) => (def as { height?: unknown }).height === "auto" && onOpened?.(n)}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: reduce ? 0 : 14 }}
              animate={{ y: 0 }}
              transition={{ duration: reduce ? 0 : 0.5, ease, delay: reduce ? 0 : 0.08 }}
              className="flex flex-col gap-4 px-4 pb-6 sm:pb-7 sm:pl-[64px] sm:pr-6"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CopyButton({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      onClick={() =>
        navigator.clipboard
          ?.writeText(value)
          .then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1400)
          })
          .catch(() => {})
      }
      className={`h-9 min-w-[72px] shrink-0 border px-3 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors ${
        copied ? "border-[#ff5941]/50 text-[#ff5941]" : "border-line text-stone hover:border-ivory/40 hover:text-ivory"
      } ${className}`}
    >
      {copied ? "Copied" : "Copy"}
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
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        // 16px: iOS Safari zooms the page into inputs with smaller text
        className={`border border-line bg-transparent px-4 py-3 text-[16px] outline-none transition-colors placeholder:text-stone/50 focus:border-ivory/50 disabled:text-ivory/70 ${isBangla(value) ? "bn" : ""}`}
      />
    </label>
  )
}

function Confirmation({ result, business, reference, hasSlip }: { result: Result; business: string; reference: string; hasSlip: boolean }) {
  const proof = [hasSlip && "screenshot", reference.trim() && `reference ${reference.trim()}`].filter(Boolean).join(" and ")
  return (
    <div>
      <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-stone">
        <span className={CORAL}>Signed · payment in review</span>
        <span className="h-px flex-1 bg-line" />
        <span>{result.number}</span>
      </div>
      <h2 className="font-display mt-6 text-[44px] font-black lowercase leading-[0.95] tracking-[-0.035em] sm:text-[72px]">let’s build it.</h2>
      <p className="mt-5 max-w-[640px] text-[16px] leading-relaxed text-stone">
        Thank you{business ? <span className={isBangla(business) ? "bn" : ""}>, {business}</span> : ""}. Work order{" "}
        <span className="text-ivory">{result.number}</span> is signed, with your payment {proof}. We’ll verify the{" "}
        <span className="text-ivory">{taka(result.advance)}</span> advance and confirm on WhatsApp — work starts as soon as it clears.
      </p>
      <div className="mt-10 flex max-w-[640px] flex-col gap-2 sm:flex-row">
        <a
          href={`https://wa.me/8801733670129?text=${encodeURIComponent(`Hi Arc Labs, I've signed work order ${result.number} and paid the advance.`)}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-[#ff5941] py-3.5 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-90"
        >
          Message us on WhatsApp
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 border border-line py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:border-ivory/40"
        >
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
    <div className="flex flex-col gap-2">
      {slip ? (
        <div className="flex items-center gap-4 border border-line p-3">
          <img src={slip.url} alt="Payment screenshot" className="h-12 w-12 shrink-0 object-cover" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px]">{slip.name}</span>
            <span className="block text-[12.5px] text-stone">Screenshot added</span>
          </span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone transition-colors hover:text-ivory"
          >
            Remove
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center gap-4 border border-dashed border-ivory/30 p-3 transition-colors hover:border-ivory/60 focus-within:border-ivory/60">
          <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center border border-line text-[22px] font-light text-stone">
            +
          </span>
          <span className="min-w-0">
            <span className="block text-[14px]">Add payment screenshot</span>
            <span className="block text-[12.5px] text-stone">From your bank app, after you send it</span>
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
      {error && <p className={`text-[12.5px] ${CORAL}`}>{error}</p>}
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
  signature,
  reference,
  hasSlip,
}: {
  result: Result
  business: string
  signer: string
  phone: string
  order: ReturnType<typeof priceSelection>
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
          <span>Delivery 7–15 days</span>
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
              <td className="border-b border-[#dcd6cc] py-[1.6mm]">{lineLabel(l)}</td>
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
        {TERMS.map(([k, v]) => (
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
