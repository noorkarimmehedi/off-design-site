"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import NumberFlow from "@number-flow/react";
import { LiveRail } from "@/app/pricing-variants/live/rail-stream";
import ClientLogos from "@/components/home/client-logos";
import { Phone } from "@/components/stageshow/phone";
import { Audit, PAGES as AUDIT } from "./audit";
import { Logo, type LogoKey } from "./stack-logos";
import {
  EXTRA_GB_USD,
  INCLUDED_GB,
  USD_TO_BDT,
  runningCost,
} from "@/lib/pitch/running-cost";

// Pitch for Grambangla, shown over Google Meet and sent as a link after. One idea per slide; arrow
// keys, space and Page Up/Down step between slides while screen-sharing.

const IMG = "/pitch/grambangla";
const QUOTE = "/quotation/grambangla";
const tk = (n: number) => "৳" + Math.round(n).toLocaleString("en-IN");

const SHELF = [
  { src: "ghee-500gm", name: "Premium ghee" },
  { src: "5lit", name: "Mustard oil" },
  { src: "semai", name: "Laccha semai" },
  { src: "kacchi-masala", name: "Kacchi masala" },
  { src: "magic-fry-mix-250-gm", name: "Magic fry mix" },
  { src: "jira-gura", name: "Cumin powder" },
];

// Each product page gets its own look; the tint and angle stand in for that here.
const PAGES = [
  {
    src: "ghee-500gm",
    name: "প্রিমিয়াম গাওয়া ঘি",
    tint: "#f6e7b8",
    ink: "#5b4300",
    angle:
      "Jar sizes side by side, what to cook with it, why it smells like home.",
  },
  {
    src: "5lit",
    name: "দেশি সরিষার তেল",
    tint: "#f3efc4",
    ink: "#4d4a05",
    angle:
      "2 L or 5 L with the per-litre price shown, so the bigger bottle sells itself.",
  },
  {
    src: "semai",
    name: "লাচ্ছা সেমাই",
    tint: "#f4dfcb",
    ink: "#5a3311",
    angle:
      "An Eid page: the combo with free gifts up top, a countdown to the last delivery date.",
  },
  {
    src: "kacchi-masala",
    name: "কাচ্চি বিরিয়ানি মসলা",
    tint: "#ecd6cf",
    ink: "#5a1f12",
    angle:
      "The recipe on the page, with ghee and oil one tap away for the full biryani.",
  },
  {
    src: "magic-fry-mix-250-gm",
    name: "Magic Fry Mix",
    tint: "#f8dcc0",
    ink: "#6b2d00",
    angle: "Fry it in 3 steps, with the corn flour bundle as the default pick.",
  },
  {
    src: "holud-gura",
    name: "হলুদের গুঁড়া",
    tint: "#f9e7a6",
    ink: "#5c4500",
    angle:
      "Everyday spices sold as a set, with the masala box as the next step up.",
  },
];

// The combo maker concept, a static page in their design (public/grambangla/build-your-combo.html)
const COMBO_URL = "/grambangla/build-your-combo";

// Phone screenshots of live pages (taken 27 Nov 2026), each linking to the page itself
const WORK = [
  {
    src: "grambangla-product",
    kind: "Product page",
    brand: "Grambangla",
    note: "our concept",
    href: "/grambangla",
  },
  {
    src: "angonaloy-home",
    kind: "Homepage",
    brand: "Angonaloy",
    href: "https://angonaloy.shop/",
  },
  {
    src: "dawah-collection",
    kind: "Collection",
    brand: "Dawah",
    href: "https://dawah-storefront.dawahbd.workers.dev/collection/top-selling-products",
  },
  {
    src: "dawah-product",
    kind: "Product page",
    brand: "Dawah",
    note: "bigger jar shows its saving",
    href: "https://dawah-storefront.dawahbd.workers.dev/product/pure-ghee",
  },
  {
    src: "sera-home",
    kind: "Homepage",
    brand: "Sera Khabar",
    href: "https://www.serakhabar.com/",
  },
  {
    src: "mangolover-product",
    kind: "Product page",
    brand: "Mango Lover",
    note: "ghee, sold by the jar",
    href: "https://www.mangolover.com.bd/product/pure-ghee",
  },
];

const SLIDES = [
  "Cover",
  "What we saw",
  "Your site today",
  "Product pages",
  "Pages we built",
  "Bigger carts",
  "Build your combo",
  "Your team",
  "iMessage",
  "Running cost",
  "The offer",
];

export default function Deck() {
  const [cur, setCur] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  // Which slide is on screen, for the counter and for keyboard steps
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach(
          (e) =>
            e.isIntersecting &&
            setCur(Number((e.target as HTMLElement).dataset.i)),
        ),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable]")) return;
      const next = ["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key);
      const prev = ["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key);
      if (!next && !prev) return;
      e.preventDefault();
      const i = Math.min(Math.max(cur + (next ? 1 : -1), 0), SLIDES.length - 1);
      refs.current[i]?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cur]);

  const slide = (i: number) => ({
    ref: (el: HTMLElement | null) => {
      refs.current[i] = el;
    },
    "data-i": i,
    "aria-label": SLIDES[i],
  });

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600&display=swap"
        precedence="default"
      />

      <header className="pg-bar">
        <span className="pg-marks">
          <img src="/home/arc-gloss.webp" alt="arc" width={720} height={270} />
          <span aria-hidden="true">×</span>
          <img
            src="/clients/grambangla.webp"
            alt="Grambangla"
            width={279}
            height={329}
          />
        </span>
        <span className="pg-count num" aria-live="polite">
          {String(cur + 1).padStart(2, "0")} /{" "}
          {String(SLIDES.length).padStart(2, "0")} · {SLIDES[cur]}
        </span>
      </header>

      {/* 01 · cover */}
      <section className="pg-slide pg-cover" {...slide(0)}>
        <h1>
          <span className="soft">a store that puts</span>
          <span>more in every cart.</span>
        </h1>
        <p className="pg-sub">
          For <span className="bn">গ্রাম বাংলা</span> · Google Meet · 27 Nov 2026
        </p>
        <ul className="pg-shelf">
          {SHELF.map((p, i) => (
            <li
              key={p.src}
              style={{ ["--d" as string]: `${i * 70}ms` } as CSSProperties}
            >
              <img
                src={`${IMG}/${p.src}.webp`}
                alt={p.name}
                width={720}
                height={720}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* 02 · what we saw */}
      <section className="pg-slide" {...slide(1)}>
        <div className="pg-split">
          <h2 className="label">What we saw</h2>
          <div className="pg-copy">
            <p className="pg-lead">Your customers already buy in bundles.</p>
            <p className="soft">
              The masala combo box, fry mix with free corn flour, semai with
              free gifts. You build those offers by hand today. The store should
              make that offer on every order, on its own.
            </p>
          </div>
        </div>
        <ul className="pg-facts">
          <li>
            <b className="num">20</b>
            <span>products on the shop</span>
          </li>
          <li>
            <b className="num">৳130–৳1,999</b>
            <span>from one spice to the combo box</span>
          </li>
          <li>
            <b className="num">6</b>
            <span>are already combos or come with a free gift</span>
          </li>
          <li>
            <b className="num">5</b>
            <span>show out of stock right now: semai and the achar range</span>
          </li>
        </ul>
      </section>

      {/* 03 · site today */}
      <section className="pg-slide" {...slide(2)}>
        <div className="pg-split">
          <h2 className="label">Your site today</h2>
          <div className="pg-copy">
            <p className="pg-lead">It works. It just doesn't sell for you.</p>
            <p className="soft">
              Your home page and your ghee page, on a phone, today. Measured on
              mobile 4G, the way your customers open it.
            </p>
          </div>
        </div>
        <div className="pg-audit">
          {AUDIT.map((p) => (
            <Audit key={p.id} page={p} />
          ))}
        </div>
      </section>

      {/* 04 · product pages */}
      <section className="pg-slide" {...slide(3)}>
        <div className="pg-split">
          <h2 className="label">Product pages</h2>
          <div className="pg-copy">
            <p className="pg-lead">
              Every product gets its own page, designed for it.
            </p>
            <p className="soft">
              Not one template with the photo swapped. Each page sells its
              product the way you'd sell it in person.
            </p>
          </div>
        </div>
        <ul className="pg-pages">
          {PAGES.map((p) => (
            <li
              key={p.src}
              style={
                {
                  ["--tint" as string]: p.tint,
                  ["--tink" as string]: p.ink,
                } as CSSProperties
              }
            >
              <div className="pg-page-shot">
                <img
                  src={`${IMG}/${p.src}.webp`}
                  alt=""
                  width={720}
                  height={720}
                />
              </div>
              <b className="bn">{p.name}</b>
              <span>{p.angle}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 05 · real pages, live: our Grambangla concept and the Dawah and Sera Khabar stores */}
      <section className="pg-slide" {...slide(4)}>
        <div className="pg-split">
          <h2 className="label">Pages we built</h2>
          <div className="pg-copy">
            <p className="pg-lead">
              Homepage, collections and product pages, already live.
            </p>
            <p className="soft">
              Dawah and Mango Lover sell ghee and oil like you do; Sera Khabar
              sells gur. The Grambangla page is our concept of your own ghee
              page. Tap any phone to open the live page.
            </p>
          </div>
        </div>
        <ul className="pg-work">
          {WORK.map((w) => (
            <li key={w.src}>
              <a
                href={w.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pg-phoneshot"
                aria-label={`${w.kind} · ${w.brand} (opens the live page)`}
              >
                <FitPhone>
                  <img
                    src={`${IMG}/work/${w.src}.webp`}
                    alt=""
                    width={600}
                    height={1212}
                    loading="lazy"
                    draggable={false}
                  />
                </FitPhone>
              </a>
              <b>{w.kind}</b>
              <span>
                {w.brand}
                {w.note && <> · {w.note}</>}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 06 · bigger carts */}
      <section className="pg-slide" {...slide(5)}>
        <div className="pg-split">
          <h2 className="label">Bigger carts</h2>
          <div className="pg-copy">
            <p className="pg-lead">The cart suggests what goes with it.</p>
            <p className="soft">
              Built from your own prices. Every suggestion is tracked, so you
              see how much each one adds.
            </p>
          </div>
        </div>
        <Cart />
      </section>

      {/* 07 · build your combo: a live page in their design, any products in one box */}
      <section className="pg-slide" {...slide(6)}>
        <div className="pg-split">
          <h2 className="label">Build your combo</h2>
          <div className="pg-copy">
            <p className="pg-lead">Shoppers make their own combo.</p>
            <p className="soft">
              Six boxes, your whole shop. Tap a box, search in Bangla or
              English, and add ghee, oil, masala or a ready mix. Three items
              take 5% off, four take 8%, a full box 12%. You set the steps.
            </p>
            <a
              className="pg-url"
              href={COMBO_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>arc-bangladesh.com/grambangla/build-your-combo</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <a
          className="pg-combo"
          href={COMBO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open the Build Your Combo page"
        >
          <span className="pg-combo-desk">
            <span className="pg-combo-bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span>arc-bangladesh.com/grambangla/build-your-combo</span>
            </span>
            <img
              src={`${IMG}/combo-desktop.webp`}
              alt="The Build Your Combo page on a laptop: four products in the box, 8% off"
              width={1600}
              height={1000}
              loading="lazy"
              draggable={false}
            />
          </span>
          <span className="pg-combo-phone">
            <FitPhone>
              <img
                src={`${IMG}/combo-phone.webp`}
                alt="The product picker on a phone, with search and categories"
                width={600}
                height={1305}
                loading="lazy"
                draggable={false}
              />
            </FitPhone>
          </span>
        </a>
      </section>

      {/* 06 · team */}
      <section className="pg-slide pg-wide" {...slide(7)}>
        <div className="pg-split">
          <h2 className="label">Your team</h2>
          <div className="pg-copy">
            <p className="pg-lead">
              Every order in one queue, every teammate on one screen.
            </p>
            <p className="soft">
              Fake orders held with the reason, couriers booked in one click,
              and each order shows who has it open so two people never call the
              same customer.
            </p>
          </div>
        </div>
        <LiveRail />
      </section>

      {/* 07 · iMessage */}
      <section className="pg-slide" {...slide(8)}>
        <div className="pg-split pg-imsg-wrap">
          <div>
            <h2 className="label">iMessage</h2>
            <p className="pg-lead pg-gap">Run the whole store by text.</p>
            <p className="soft">
              Ask in Bangla or English. It reads straight away; anything that
              changes an order or a price waits for your YES.
            </p>
          </div>
          <Chat />
        </div>
      </section>

      {/* 08 · running cost */}
      <section className="pg-slide" {...slide(9)}>
        <div className="pg-split">
          <h2 className="label">Running cost</h2>
          <div className="pg-copy">
            <p className="pg-lead">You pay the servers directly, at cost.</p>
            <p className="soft">
              Slide to how many orders you get a day and see what running the
              store costs each month.
            </p>
          </div>
        </div>
        <CostCalc />
      </section>

      {/* 09 · offer */}
      <section className="pg-slide" {...slide(10)}>
        <div className="pg-split">
          <h2 className="label">The offer</h2>
          <div className="pg-offer">
            <p className="pg-price num">৳45,000</p>
            <p className="soft">
              Store ৳23,000 + admin panel ৳22,000, with every module included.
              Landing pages ৳8,000 each, only if you want them.
            </p>
            <div className="pg-chips">
              <span>Delivery 7–15 days</span>
              <span>50% to start</span>
              <span>Yours once paid</span>
            </div>
            <a className="pg-cta" href={QUOTE}>
              Open your quotation <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="split pg-proof">
          <h2 className="label">Stores we build and run</h2>
          <ClientLogos />
        </div>
      </section>
    </>
  );
}

/* An iPhone 18 Pro (stageshow's Phone) as wide as its column; the screenshot fills the screen under the status bar */
function FitPhone({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setW(Math.floor(e.contentRect.width)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="pg-fitphone">
      {w > 0 && (
        <Phone width={w} frame="pro">
          {children}
        </Phone>
      )}
    </div>
  );
}

/* The cart with its three nudges, priced from Grambangla's own shop */
function Cart() {
  const [semai, setSemai] = useState(false);
  const [oil, setOil] = useState<"2" | "5">("2");
  const FREE = 2000;
  const items = 855 + (oil === "2" ? 620 : 1470) + (semai ? 849 : 0);
  const left = Math.max(0, FREE - items);
  return (
    <div className="pg-cart">
      <div className="pg-cart-list">
        <div className="pg-line">
          <img src={`${IMG}/ghee-500gm.webp`} alt="" width={720} height={720} />
          <span>
            <b className="bn">প্রিমিয়াম গাওয়া ঘি · 500 g</b>
            <small>Qty 1</small>
          </span>
          <span className="num">৳855</span>
        </div>
        <div className="pg-line">
          <img
            src={`${IMG}/${oil === "2" ? "2lit" : "5lit"}.webp`}
            alt=""
            width={720}
            height={720}
          />
          <span>
            <b className="bn">দেশি সরিষার তেল · {oil} L</b>
            <small>{oil === "2" ? "৳310 a litre" : "৳294 a litre"}</small>
          </span>
          <span className="num">{oil === "2" ? "৳620" : "৳1,470"}</span>
        </div>
        {oil === "2" && (
          <button
            type="button"
            className="pg-nudge"
            onClick={() => setOil("5")}
          >
            <span className="pg-nudge-t">
              <b>Get the 5 L bottle and save ৳80</b>
              <small>Same oil, ৳294 a litre instead of ৳310</small>
            </span>
            <span className="pg-add">Switch</span>
          </button>
        )}
        {semai ? (
          <div className="pg-line pg-in">
            <img src={`${IMG}/semai.webp`} alt="" width={720} height={720} />
            <span>
              <b className="bn">লাচ্ছা সেমাই · 500 g</b>
              <small>Added from “goes with ghee”</small>
            </span>
            <span className="num">৳849</span>
          </div>
        ) : (
          <div className="pg-goes">
            <small>Goes with ghee</small>
            <button
              type="button"
              className="pg-pick"
              onClick={() => setSemai(true)}
            >
              <img src={`${IMG}/semai.webp`} alt="" width={720} height={720} />
              <span className="bn">লাচ্ছা সেমাই</span>
              <span className="num">৳849</span>
              <span className="pg-add">Add</span>
            </button>
          </div>
        )}
      </div>
      <div className="pg-cart-foot">
        <div className="pg-free">
          <span>
            {left > 0 ? (
              <>৳{left.toLocaleString("en-IN")} more for free delivery</>
            ) : (
              <>Free delivery unlocked</>
            )}
          </span>
          <i
            style={
              { ["--p" as string]: Math.min(1, items / FREE) } as CSSProperties
            }
          />
        </div>
        <div className="pg-total">
          <span>Total</span>
          <b className="num">
            <NumberFlow
              value={items}
              prefix="৳"
              format={{ useGrouping: true }}
              locales="en-IN"
            />
          </b>
        </div>
        <p className="pg-fine">
          Tap the suggestions. Free-delivery threshold shown at ৳2,000 as an
          example.
        </p>
      </div>
    </div>
  );
}

/* An example conversation with the iMessage agent */
function Chat() {
  const MSGS: { me?: boolean; t: string }[] = [
    { me: true, t: "aaj koto order holo?" },
    {
      t: "Today so far: 64 orders, ৳71,230.\n9 waiting for a call, 2 held: same phone, 3 different addresses.",
    },
    { me: true, t: "5 liter tel koto ache?" },
    {
      t: "Mustard oil 5 L: 18 left. At this week's pace that lasts about 3 days.",
    },
    { me: true, t: "confirmed gula Steadfast e pathao" },
    { t: "Send 41 confirmed orders to Steadfast?\nReply YES to book them." },
    { me: true, t: "YES" },
    { t: "Done. 41 parcels booked, labels ready to print." },
  ];
  return (
    <div className="pg-phone" aria-label="Example iMessage conversation">
      <div className="pg-phone-top">
        <span className="pg-ava">GB</span>
        <b>Grambangla Suite</b>
      </div>
      <div className="pg-msgs">
        {MSGS.map((m, i) => (
          <p
            key={i}
            className={m.me ? "me" : undefined}
            style={{ ["--d" as string]: `${i * 90}ms` } as CSSProperties}
          >
            {m.t}
          </p>
        ))}
      </div>
      <small className="pg-fine">Example conversation</small>
    </div>
  );
}

/* Orders a day → what Cloudflare and Supabase charge a month */
const STOPS = [10, 50, 100, 200, 500, 1000, 2000, 3000];
const posOf = (n: number) => {
  for (let i = 0; i < STOPS.length - 1; i++)
    if (n <= STOPS[i + 1])
      return (
        (i + (n - STOPS[i]) / (STOPS[i + 1] - STOPS[i])) / (STOPS.length - 1)
      );
  return 1;
};
const atPos = (p: number) => {
  const x = p * (STOPS.length - 1);
  const i = Math.min(Math.floor(x), STOPS.length - 2);
  const n = STOPS[i] + (x - i) * (STOPS[i + 1] - STOPS[i]);
  return n < 100
    ? Math.round(n / 5) * 5
    : n < 1000
      ? Math.round(n / 10) * 10
      : Math.round(n / 50) * 50;
};

/** How long the included database space lasts, in words a founder reads at a glance */
/* Database room in plain words: what it costs now, how long it lasts, what comes after */
function storageFacts(months: number, mbPerMonth: number) {
  const perGb = Math.round(EXTRA_GB_USD * USD_TO_BDT);
  const gbYear = Math.max(1, Math.round((mbPerMonth * 12) / 1024));
  const lasts =
    months >= 120
      ? "10+ years of orders"
      : months >= 24
        ? `About ${Math.floor(months / 12)} years of orders`
        : months >= 2
          ? `About ${Math.floor(months)} months of orders`
          : "Under 2 months of orders";
  return [
    { k: "Cost now", v: "Already in the monthly price above" },
    { k: "Lasts", v: lasts, note: "at this many orders a day" },
    {
      k: "After that",
      v: `৳${perGb} a month for each extra GB`,
      note: `a year of orders is about ${gbYear} GB, so about ৳${(gbYear * perGb).toLocaleString("en-IN")} a month for each extra year kept`,
    },
  ];
}

/* What the store is built with, each with a line a non-technical founder can follow */
const STACK: {
  part: string;
  tech: string;
  logos: LogoKey[];
  plain: string;
  items?: string[];
}[] = [
  {
    part: "Frontend",
    tech: "React, TypeScript, Tailwind CSS",
    logos: ["react", "typescript", "tailwindcss"],
    plain: "The screens your customers and your team see and tap.",
  },
  {
    part: "Backend",
    tech: "Node.js (Express)",
    logos: ["nodedotjs", "express"],
    plain: "The engine behind them: takes orders, checks stock, books couriers.",
  },
  {
    part: "Database",
    tech: "PostgreSQL, on Supabase",
    logos: ["postgresql", "supabase"],
    plain: "Where every order, product and customer is kept, backed up daily.",
  },
  {
    part: "Hosting",
    tech: "Cloudflare Workers and Images",
    logos: ["cloudflareworkers"],
    plain:
      "Runs the site on Cloudflare's servers and shrinks product photos for each phone, so pages open fast on mobile data.",
  },
  {
    part: "Live updates",
    tech: "Supabase Realtime, Cloudflare Durable Objects",
    logos: ["supabase", "cloudflare"],
    plain: "The admin panel updates itself; nobody has to press refresh.",
    items: [
      "New orders land on the orders screen the moment they're placed.",
      "Shoppers on the site right now: browsing, with a cart, checking out or just bought, on a map of where they are.",
      "Who on your team has which order open, so two people never call the same customer.",
      "An incoming call pops up with the caller's last order, and the call's status updates on the order while you talk.",
      "Each order's history fills in as teammates confirm, edit, print or ship it.",
      "Team chat, orders taken in Facebook, Instagram and WhatsApp messages, and the home screen numbers keep themselves current.",
    ],
  },
  {
    part: "Error alerts",
    tech: "Sentry",
    logos: ["sentry"],
    plain: "Tells us the moment something breaks, usually before you notice.",
  },
  {
    part: "Connected to",
    tech: "Steadfast, Pathao, BulkSMSBD, Meta",
    logos: ["meta"],
    plain:
      "Couriers booked from the order, SMS to customers, and every sale reported back to your Facebook ads.",
  },
];

/* What a founder needs to know about hosting, in plain words */
const HOSTING = [
  "Two small monthly bills, Cloudflare and Supabase, in your company's name and paid by card. We set them up; you own both accounts.",
  "Cloudflare runs your website and admin panel. Supabase keeps your orders, products and customers.",
  "The bill follows your orders, not your visitors or your staff. Your whole team can keep the admin panel open all day.",
  "Eid rush? The site doesn't slow down or go offline. That month simply costs a little more.",
  "No arc fee on top: you pay exactly what Cloudflare and Supabase charge.",
  "Not included: your domain name, SMS and courier charges.",
];

function CostCalc() {
  const [orders, setOrders] = useState(500);
  const [rush, setRush] = useState(false);
  const c = runningCost(orders, rush);
  return (
    <div className="pg-costwrap">
      <div className="pg-costside">
        <ul className="pg-hosting">
          {HOSTING.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <div className="pg-stack">
          <h3>What it's built with</h3>
          <dl>
            {STACK.map((t) => (
              <div key={t.part}>
                <dt>{t.part}</dt>
                <dd>
                  <b>
                    <span className="pg-logos" aria-hidden="true">
                      {t.logos.map((l) => (
                        <Logo key={l} name={l} size={16} />
                      ))}
                    </span>
                    {t.tech}
                  </b>
                  <span>{t.plain}</span>
                  {t.items && (
                    <ul className="pg-stack-items">
                      {t.items.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="pg-cost">
        <div className="ps">
          <label htmlFor="pg-orders" className="ps-label">
            <span>Orders a day</span>
            <b className="num">
              <NumberFlow value={orders} locales="en-IN" />
            </b>
          </label>
          <div
            className="ps-track"
            style={{ ["--p" as string]: posOf(orders) } as CSSProperties}
          >
            <input
              id="pg-orders"
              type="range"
              min={0}
              max={1000}
              value={Math.round(posOf(orders) * 1000)}
              onChange={(e) => setOrders(atPos(Number(e.target.value) / 1000))}
              aria-valuetext={`${orders} orders a day`}
            />
            <div className="ps-ticks" aria-hidden="true">
              {STOPS.map((s, i) => (
                <span
                  key={s}
                  style={{ left: `${(i / (STOPS.length - 1)) * 100}%` }}
                >
                  {s >= 1000 ? `${s / 1000}k` : s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pg-rush">
          <div className="pg-seg" role="radiogroup" aria-label="Database size">
            <button
              type="button"
              role="radio"
              aria-checked={!rush}
              onClick={() => setRush(false)}
            >
              Normal days
              <small>{c.normalSize} database</small>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={rush}
              onClick={() => setRush(true)}
            >
              Rush time
              <small>{c.rushSize} database</small>
            </button>
          </div>
          <p className="soft">
            Before Eid or a big sale we switch your database one size up so it
            keeps up with the rush, then back down when it's over. It's billed
            by the hour, so a rush week adds only about ৳
            {(Math.round(c.rushWeekBdt / 10) * 10).toLocaleString("en-IN")}. The switch takes a couple of
            minutes, so we do it at night.
          </p>
        </div>

        <div className="pg-cost-grid">
          <div className="pg-cost-total">
            <span>
              {rush ? `A whole month at rush size` : "Every month"}
            </span>
            <b className="num">
              <NumberFlow
                value={Math.round(c.bdt / 10) * 10}
                prefix="৳"
                locales="en-IN"
              />
            </b>
            <small className="num">
              ${c.usd.toFixed(2)} · about ৳
              {c.perOrderBdt < 1
                ? c.perOrderBdt.toFixed(2)
                : c.perOrderBdt.toFixed(1)}{" "}
              per order
            </small>
          </div>
          <div className="pg-cost-rows">
            <div>
              <span>
                Website and admin panel
                <small>Cloudflare</small>
              </span>
              <b className="num">${c.cloudflare.toFixed(2)}</b>
            </div>
            <div>
              <span>
                Orders, products and customers
                <small>
                  Supabase · {c.compute} database
                  {rush ? " all month" : ""}
                </small>
              </span>
              <b className="num">${c.supabase.toFixed(2)}</b>
            </div>
            <div className="pg-store">
              <div className="pg-store-head">
                <span>
                  Room for your data
                  <small>Supabase · comes with the plan</small>
                </span>
                <b className="num">{INCLUDED_GB} GB included</b>
              </div>
              <dl className="pg-store-facts">
                {storageFacts(c.storageMonths, c.dbMbPerMonth).map((f) => (
                  <div key={f.k}>
                    <dt>{f.k}</dt>
                    <dd>
                      {f.v}
                      {f.note && <small>{f.note}</small>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        <p className="pg-fine">
          Worked out from a live Merchant Suite store in Nov 2026 at
          Cloudflare's and Supabase's list prices; ৳ at {USD_TO_BDT} to the
          dollar.
        </p>
      </div>
    </div>
  );
}
