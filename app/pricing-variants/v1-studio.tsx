"use client"

import HomeHeader from "@/components/home/home-header"
import { LiveRail } from "./live/rail-stream"
import { SETUP_FEE, TIERS, tk } from "./pricing"
import { Billing, OrderSlider, PageEnd, Price, usePricing } from "./shared"

/* 1 · Studio — the homepage's own language: bottom-set grey headline, label-left splits, tall cards on a rail */
export default function Studio() {
  const { orders, setOrders, yearly, setYearly, q } = usePricing(1200)
  return (
    <div className="v1">
      <HomeHeader />

      <section className="v1-hero">
        <h1>
          <span className="line">
            <span>Design and operations,</span>
          </span>
          <span className="line">
            <span>under one roof.</span>
          </span>
        </h1>
      </section>

      <section className="split v1-calc">
        <h2 className="label">Your plan</h2>
        <div className="v1-meter">
          <div className="v1-plan">
            <span key={q.tier.name} className="v1-chip pswap">
              {q.tier.name}
              {q.over > 0 ? " + extra" : ""}
            </span>
            <span className="muted">{q.tier.note}</span>
          </div>
          <div className="v1-price">
            <Price value={q.perMonth} />
            <span>/ month</span>
          </div>
          <p className="muted">
            About ৳{q.perOrder.toFixed(2)} per order{yearly ? `, billed ${tk(q.yearTotal)} a year` : ""}. Landing page,
            admin panel and hosting included.
          </p>
          <OrderSlider id="v1-s" orders={orders} setOrders={setOrders} />
          <div className="v1-row">
            <Billing yearly={yearly} setYearly={setYearly} />
            <a className="v1-cta" href="/call">
              Book a call
            </a>
          </div>
        </div>
      </section>

      <div className="svc-head v1-railhead">
        <h2 className="label">What you get</h2>
        <p>Every plan gets the whole suite. This is your team on a normal afternoon.</p>
      </div>
      <LiveRail />

      <div className="svc-head">
        <h2 className="label">Plans</h2>
        <p>Same suite on every plan. The only difference is how many orders a month you send through it.</p>
      </div>
      <ul className="v1-plans">
        {TIERS.map((t, i) => (
          <li key={t.name}>
            <button className="v1-tile" data-on={i === q.tierIndex ? "" : undefined} onClick={() => setOrders(Math.round(t.max * 0.8 / 50) * 50)}>
              <span>{t.name}</span>
              <span className="v1-tile-p num">{tk(yearly ? (t.price * 10) / 12 : t.price)}</span>
              <span className="muted">Up to {t.max.toLocaleString("en-IN")} orders</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="v1-fine">
        Setup once {tk(SETUP_FEE)}: we design your landing page and connect couriers and Facebook. Above 10,000 orders, ৳1 per
        extra order.
      </p>

      <PageEnd />
    </div>
  )
}
