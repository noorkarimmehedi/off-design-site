"use client"

import { useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
  BANK,
  CATALOG,
  defaultSelection,
  lineLabel,
  priceSelection,
  taka,
  TERMS,
  type Feature,
  type Selection,
} from "@/lib/work-order/catalog"
import RevealOnView from "@/components/reveal-on-view"
import { TakaFlow } from "@/components/ui/number-flow"
import SignatureField, { type SignatureFieldHandle } from "./signature-field"

const CORAL = "text-[#ff5941]"
const WHATSAPP = "+880 1733-670129"
const isBangla = (s: string) => /[ঀ-৿]/.test(s)
const pad = (i: number) => String(i + 1).padStart(2, "0")

type Result = { number: string; total: number; advance: number; signedAt: string }

export default function OrderBuilder({ slug, clientName, preset }: { slug: string; clientName?: string; preset?: Selection }) {
  const [selection, setSelection] = useState<Selection>(() => defaultSelection(preset))
  const [business, setBusiness] = useState(clientName ?? "")
  const [signer, setSigner] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [signed, setSigned] = useState(false)
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle")
  const [error, setError] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [signaturePng, setSignaturePng] = useState<string | null>(null)
  const padRef = useRef<SignatureFieldHandle>(null)
  const signRef = useRef<HTMLElement>(null)

  const order = useMemo(() => priceSelection(selection), [selection])
  const locked = Boolean(result)
  const ready = business.trim() && signer.trim() && phone.trim() && agreed && signed

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
    const signature = await padRef.current?.toPng()
    if (!signature) {
      setStatus("idle")
      return
    }
    setError("")
    try {
      const res = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business, slug, signer, phone, email, selection, signature, agreed }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.")
      setSignaturePng(signature)
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

      <div className="relative z-10 mx-auto w-full max-w-[1120px] px-4 pb-40 pt-10 sm:px-10 sm:pt-20 lg:pb-24 print:hidden">
        {/* Hero — staggers in on load, like the home page */}
        <RevealOnView intensity="hero" staggerChildren>
          <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-stone">
            <span>Work order</span>
            <span className="h-px flex-1 bg-line" />
            <span>{result ? result.number : "Draft"}</span>
          </div>
          <h1 className="font-display mt-6 text-center text-[44px] sm:text-left font-black lowercase leading-[0.9] tracking-[-0.035em] sm:text-[84px]">
            build your order.
          </h1>
          <div className="mt-5 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-[32px] sm:justify-start sm:text-[48px]">
            {/* Playfair's low x-height reads small beside Bangla, so "arc" runs larger than the line */}
            <span className="font-display text-[1.3em] font-black lowercase leading-[0.8] tracking-[-0.035em]">arc</span>
            <img src="/ampersand-chrome-2.webp" alt="&" className="h-[1.3em] w-auto self-center light:invert" />
            {clientName ? (
              <span className={`${isBangla(clientName) ? "bn font-bold" : "font-display font-black lowercase tracking-[-0.035em]"} leading-none`}>
                {clientName}
              </span>
            ) : (
              <span className="font-display font-black lowercase leading-none tracking-[-0.035em] text-stone">you</span>
            )}
          </div>
          <p className="mx-auto mt-6 max-w-[560px] text-center text-[15px] leading-relaxed text-stone sm:mx-0 sm:text-left sm:text-[16px]">
            <span className="text-ivory">Pick what your business needs.</span> Your price updates as you go — when it looks right, sign
            below and we start as soon as the advance is confirmed.
          </p>
        </RevealOnView>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
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
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <RevealOnView className="border border-line" delay={0.5}>
              <div className="border-b border-line px-5 py-4">
                <div className="font-display text-[30px] font-black lowercase leading-none tracking-[-0.035em]">work order.</div>
                <div className={`mt-2 text-[13px] text-stone ${isBangla(name) ? "bn" : ""}`}>For {name}</div>
              </div>
              <ul className="max-h-[300px] overflow-y-auto px-5 py-3" data-lenis-prevent>
                {order.lines.map((l) => (
                  <li key={l.feature.id} className="flex items-baseline justify-between gap-3 py-1.5 text-[13.5px]">
                    <span className="text-ivory/85">{lineLabel(l)}</span>
                    <TakaFlow value={l.price} className="shrink-0" />
                  </li>
                ))}
              </ul>
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
                onClick={() => signRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="mt-3 hidden w-full bg-ivory py-3.5 font-mono text-[12px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-90 lg:block"
              >
                Review & sign ↓
              </button>
            )}
          </aside>
        </div>

        {/* Terms + signature */}
        <section ref={signRef} className="mt-20 scroll-mt-8" aria-labelledby="sign-heading">
          {result ? (
            <Confirmation result={result} business={business} />
          ) : (
            <>
              <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-stone">
                <span>Terms & signature</span>
                <span className="h-px flex-1 bg-line" />
                <TakaFlow value={order.total} />
              </div>
              <h2 id="sign-heading" className="font-display mt-6 text-[40px] font-black lowercase leading-[0.95] tracking-[-0.035em] sm:text-[64px]">
                the terms.
              </h2>
              <div className="mt-8 grid gap-x-10 sm:grid-cols-2">
                {TERMS.map(([k, v], i) => (
                  <div key={k} className="grid grid-cols-[32px_1fr] border-t border-line py-4">
                    <span className={`font-mono text-[10px] tracking-[0.15em] ${CORAL} pt-1`}>{pad(i)}</span>
                    <div>
                      <div className="text-[15px] font-medium">{k}</div>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-stone">{v}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
                <div className="flex flex-col gap-4">
                  <Field label="Business name" value={business} onChange={setBusiness} disabled={Boolean(clientName)} autoComplete="organization" />
                  <Field label="Your full name" value={signer} onChange={setSigner} autoComplete="name" />
                  <Field label="Phone / WhatsApp" value={phone} onChange={setPhone} type="tel" autoComplete="tel" />
                  <Field label="Email (optional)" value={email} onChange={setEmail} type="email" autoComplete="email" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <SignatureField ref={padRef} defaultText={signer} onChange={setSigned} />
                  <label className="mt-5 flex cursor-pointer items-start gap-3 text-[13.5px] leading-relaxed text-stone">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#ff5941]"
                    />
                    <span>
                      I accept this work order for <span className="text-ivory">{taka(order.total)}</span> and the terms above, including the{" "}
                      <span className="text-ivory">{taka(order.advance)}</span> advance to start work.
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={accept}
                    disabled={!ready || status === "saving"}
                    className="mt-5 w-full bg-[#ff5941] py-4 font-mono text-[12px] uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {status === "saving" ? "Saving…" : `Accept & sign — ${taka(order.total)}`}
                  </button>
                  {status === "error" && <p className={`mt-3 text-[13px] ${CORAL}`}>{error}</p>}
                  {!ready && status !== "saving" && (
                    <p className="mt-3 text-center text-[12.5px] text-stone sm:text-left">Fill in your details, sign and tick the box to accept.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Mobile dock: floating liquid-glass pill with the total, Chat (WhatsApp) and Sign */}
      {!result && (
        <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[45] lg:hidden print:hidden">
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
              onClick={() => signRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="liquid-glass-button relative h-[46px] shrink-0 rounded-[20px] px-5 font-mono text-[11px] uppercase tracking-[0.2em] transition-transform active:scale-95"
            >
              Sign ↓
            </button>
          </div>
        </div>
      )}

      {/* Rendered straight into <body> so print can hide everything else */}
      {result &&
        createPortal(
          <PrintOrder result={result} business={business} signer={signer} phone={phone} order={order} signature={signaturePng} />,
          document.body,
        )}
    </>
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

function Confirmation({ result, business }: { result: Result; business: string }) {
  return (
    <div>
      <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-stone">
        <span className={CORAL}>Signed</span>
        <span className="h-px flex-1 bg-line" />
        <span>{result.number}</span>
      </div>
      <h2 className="font-display mt-6 text-[44px] font-black lowercase leading-[0.95] tracking-[-0.035em] sm:text-[72px]">let’s build it.</h2>
      <p className="mt-5 max-w-[620px] text-[16px] leading-relaxed text-stone">
        Thank you{business ? <span className={isBangla(business) ? "bn" : ""}>, {business}</span> : ""}. Your work order{" "}
        <span className="text-ivory">{result.number}</span> is signed and saved. Send the{" "}
        <span className="text-ivory">{taka(result.advance)}</span> advance to the account below and we start work as soon as it’s confirmed.
      </p>
      <div className="mt-10 grid border border-line sm:grid-cols-[1.2fr_1fr]">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 p-6">
          {BANK.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-stone">{k}</dt>
              <dd className="font-mono text-[14px] tracking-[0.02em]">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col justify-between gap-6 border-t border-line p-6 sm:border-l sm:border-t-0">
          <p className="text-[14px] leading-relaxed text-stone">
            Use <span className="text-ivory">{result.number}</span> as the payment reference, then send the slip on WhatsApp.
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={`https://wa.me/8801733670129?text=${encodeURIComponent(`Hi Arc Labs, I've signed work order ${result.number} and sent the advance.`)}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#ff5941] py-3.5 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-90"
            >
              Send slip on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="border border-line py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:border-ivory/40"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
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
}: {
  result: Result
  business: string
  signer: string
  phone: string
  order: ReturnType<typeof priceSelection>
  signature: string | null
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
