"use client";

import { useState, type ReactNode } from "react";
import NumberFlow from "@number-flow/react";

// Product-page combo ideas for grambanglashop.com. Today a combo is its own product: a struck-out
// price and a long Bangla description listing what's inside. Each variant below puts the combo on
// the page as something the shopper can see, tap and build. Prices are the shop's own (Nov 2026).

const IMG = "/pitch/grambangla";

const SPICES = [
  {
    id: "holud",
    name: "হলুদের গুঁড়া",
    price: 150,
    img: "holud-gura",
    use: "পাহাড়ি বিন্নি হলুদ, রোদে শুকানো। মাছ, মাংস, ভর্তা, সব রান্নায়।",
  },
  {
    id: "morich",
    name: "মরিচের গুঁড়া",
    price: 180,
    img: "moricher-gura",
    use: "পাকা শুকনো মরিচ বেছে গুঁড়া। ঝাল আর রং দুটোই ঠিক থাকে।",
  },
  {
    id: "dhonia",
    name: "ধনিয়ার গুঁড়া",
    price: 130,
    img: "dhoniar-gura",
    use: "কৃষকের কাছ থেকে আনা ধনিয়া। হালকা ঘ্রাণ, তরকারিতে দারুণ।",
  },
  {
    id: "jira",
    name: "জিরার গুঁড়া",
    price: 390,
    img: "jira-gura",
    use: "শুকনো ভালো জিরা থেকে তৈরি। তেহারি, কাচ্চি, মাংসে।",
  },
] as const;

const FULL = SPICES.reduce((s, x) => s + x.price, 0); // 850
const COMBO = 750;

const tk = (n: number) => `৳${n.toLocaleString("en-IN")}`;

function Price({ value }: { value: number }) {
  return <NumberFlow value={value} prefix="৳" locales="en-IN" />;
}

export default function Combos() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap"
        precedence="default"
      />
      <header className="cb-head">
        <p className="cb-kicker">Grambangla · product page</p>
        <h1>Combos the shopper can see, tap and build.</h1>
        <p className="cb-sub">
          Today a combo on grambanglashop.com is its own product: a crossed-out
          price and a long description of what&apos;s inside. Here are four ways
          the product page itself sells the combo, priced from the shop&apos;s
          real prices. Tap them.
        </p>
      </header>

      <div className="cb-grid">
        <Variant
          tag="A"
          title="Build your box"
          note="Pick any spices; every one you add saves more, and four makes the full combo. One combo page instead of many."
        >
          <BuildBox />
        </Variant>
        <Variant
          tag="B"
          title="What's inside, tap by tap"
          note="The long description becomes the box itself: each jar with its own price and what it's for, and the saving in one line."
        >
          <Inside />
        </Variant>
        <Variant
          tag="C"
          title="Single to combo, in one tap"
          note="On a single spice's page, the combo is offered right under the price. One tap swaps the order up; one tap undoes it."
        >
          <SingleToCombo />
        </Variant>
        <Variant
          tag="D"
          title="The bigger size shows its gift"
          note="Magic Fry's free corn flour only appears in the 500 g title today. Here the gift and the cheaper price per 100 g show up when you pick it."
        >
          <SizeGift />
        </Variant>
      </div>
    </>
  );
}

function Variant({
  tag,
  title,
  note,
  children,
}: {
  tag: string;
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <section className="cb-var">
      <div className="cb-var-label">
        <span className="cb-tag">{tag}</span>
        <div>
          <h2>{title}</h2>
          <p>{note}</p>
        </div>
      </div>
      <div className="cb-phone">
        <div className="cb-shopbar" aria-hidden="true">
          <img src="/clients/grambangla.webp" alt="" width={64} height={64} />
          <span className="bn">গ্রাম বাংলা</span>
        </div>
        {children}
      </div>
    </section>
  );
}

/* A · pick any spices; the saving grows with each one, four is the full combo */
const SAVE_BY_COUNT = [0, 0, 30, 60, FULL - COMBO];

function BuildBox() {
  const [picked, setPicked] = useState<string[]>(["holud", "morich"]);
  const n = picked.length;
  const full = SPICES.filter((s) => picked.includes(s.id)).reduce(
    (t, s) => t + s.price,
    0,
  );
  const save = SAVE_BY_COUNT[n];
  const nextSave = n < 4 ? SAVE_BY_COUNT[n + 1] - save : 0;
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="cb-body bn">
      <p className="cb-eyebrow">গুঁড়া মসলা কম্বো</p>
      <h3 className="cb-title">নিজের মসলা বক্স বানান</h3>
      <p className="cb-muted">যত বেশি নেবেন, তত বেশি বাঁচবে</p>

      <div className="cb-tiles">
        {SPICES.map((s) => {
          const on = picked.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              className="cb-tile"
              aria-pressed={on}
              onClick={() => toggle(s.id)}
            >
              <span className="cb-check" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="12" height="12">
                  <path
                    d="M3.5 8.5 6.5 11.5 12.5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <img src={`${IMG}/${s.img}.webp`} alt="" width={600} height={600} />
              <b>{s.name}</b>
              <small>২০০ গ্রাম · {tk(s.price)}</small>
            </button>
          );
        })}
      </div>

      <div className="cb-steps" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} data-on={i <= n} />
        ))}
      </div>
      <p className="cb-hint" key={n}>
        {n === 4
          ? `পুরো কম্বো! ${tk(save)} বাঁচলো`
          : n === 0
            ? "একটা মসলা বেছে নিন"
            : `আরেকটা নিলে আরও ${tk(nextSave)} বাঁচবে`}
      </p>

      <BuyBar
        label={n === 4 ? "কম্বো অর্ডার করুন" : "অর্ডার করুন"}
        price={full - save}
        was={save ? full : undefined}
        disabled={n === 0}
      />
    </div>
  );
}

/* B · the description turned into the box: each jar, its price, what it's for */
function Inside() {
  const [open, setOpen] = useState<string | null>("jira");
  return (
    <div className="cb-body bn">
      <div className="cb-stack" aria-hidden="true">
        {SPICES.map((s, i) => (
          <img
            key={s.id}
            src={`${IMG}/${s.img}.webp`}
            alt=""
            width={600}
            height={600}
            style={{ zIndex: i === 1 || i === 2 ? 2 : 1 }}
          />
        ))}
      </div>
      <h3 className="cb-title">গুঁড়া মসলা কম্বো</h3>
      <div className="cb-pricerow">
        <span className="cb-big">{tk(COMBO)}</span>
        <s className="cb-muted">{tk(FULL)}</s>
        <span className="cb-pill">{tk(FULL - COMBO)} সাশ্রয়</span>
      </div>

      <p className="cb-section">বক্সে যা থাকছে</p>
      <ul className="cb-rows">
        {SPICES.map((s) => {
          const isOpen = open === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                className="cb-row"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : s.id)}
              >
                <img src={`${IMG}/${s.img}.webp`} alt="" width={600} height={600} />
                <span>
                  <b>{s.name}</b>
                  <small>২০০ গ্রাম</small>
                </span>
                <span className="cb-row-price">{tk(s.price)}</span>
                <svg
                  className="cb-chev"
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  aria-hidden="true"
                >
                  <path
                    d="m4 6 4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="cb-reveal" data-open={isOpen}>
                <div>
                  <p>{s.use}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="cb-sum">
        <span>আলাদা কিনলে</span>
        <s>{tk(FULL)}</s>
        <span>কম্বোতে</span>
        <b>{tk(COMBO)}</b>
      </div>

      <BuyBar label="কম্বো অর্ডার করুন" price={COMBO} />
    </div>
  );
}

/* C · on a single spice's page, the combo sits under the price; one tap swaps up */
function SingleToCombo() {
  const [combo, setCombo] = useState(false);
  const holud = SPICES[0];
  const rest = SPICES.slice(1);
  return (
    <div className="cb-body bn">
      <div className="cb-hero">
        <img
          src={`${IMG}/${holud.img}.webp`}
          alt=""
          width={600}
          height={600}
          data-dim={combo}
        />
        {rest.map((s, i) => (
          <img
            key={s.id}
            src={`${IMG}/${s.img}.webp`}
            alt=""
            width={600}
            height={600}
            className="cb-hero-extra"
            data-on={combo}
            style={{ ["--i" as string]: i }}
          />
        ))}
      </div>
      <h3 className="cb-title">{holud.name} · ২০০ গ্রাম</h3>
      <div className="cb-pricerow">
        <span className="cb-big">{tk(holud.price)}</span>
      </div>

      <div className="cb-offer" data-on={combo}>
        <div className="cb-offer-thumbs" aria-hidden="true">
          {rest.map((s) => (
            <img key={s.id} src={`${IMG}/${s.img}.webp`} alt="" width={600} height={600} />
          ))}
        </div>
        <div className="cb-offer-t">
          {combo ? (
            <>
              <b key="on" className="cb-swap">
                কম্বো নেওয়া হয়েছে · {tk(FULL - COMBO)} বাঁচলো
              </b>
              <small>হলুদ, মরিচ, ধনিয়া, জিরা · ২০০ গ্রাম করে</small>
            </>
          ) : (
            <>
              <b key="off" className="cb-swap">
                বাকি ৩টা নিন, পুরো কম্বো {tk(COMBO)}
              </b>
              <small>
                মরিচ, ধনিয়া, জিরা · আলাদা কিনলে <s>{tk(FULL)}</s>
              </small>
            </>
          )}
        </div>
        <button
          type="button"
          className="cb-chip"
          onClick={() => setCombo((c) => !c)}
        >
          {combo ? "বাদ দিন" : "কম্বো নিন"}
        </button>
      </div>

      <BuyBar
        label={combo ? "কম্বো অর্ডার করুন" : "অর্ডার করুন"}
        price={combo ? COMBO : holud.price}
      />
    </div>
  );
}

/* D · Magic Fry sizes; the 500 g shows its free corn flour and its better price per 100 g */
const SIZES = [
  { g: 250, price: 550, was: 600, img: "magic-fry-mix-250-gm.webp" },
  { g: 500, price: 1050, was: 1100, img: "magic-fry-combo.png", gift: true },
] as const;

function SizeGift() {
  const [g, setG] = useState<250 | 500>(250);
  const size = SIZES.find((s) => s.g === g)!;
  return (
    <div className="cb-body bn">
      <div className="cb-hero cb-hero-fry">
        {SIZES.map((s) => (
          <img
            key={s.g}
            src={`${IMG}/${s.img}`}
            alt=""
            width={600}
            height={600}
            data-on={s.g === g}
          />
        ))}
      </div>
      <h3 className="cb-title">ম্যাজিক ফ্রাই মিক্স</h3>
      <p className="cb-muted">ঘরেই মুচমুচে চিকেন ফ্রাই</p>

      <div className="cb-sizes" role="radiogroup" aria-label="সাইজ">
        {SIZES.map((s) => (
          <button
            key={s.g}
            type="button"
            role="radio"
            aria-checked={s.g === g}
            className="cb-size"
            onClick={() => setG(s.g)}
          >
            <span className="cb-size-top">
              <b>{s.g} গ্রাম</b>
              {"gift" in s && <span className="cb-gifttag">+ ফ্রি গিফট</span>}
            </span>
            <span className="cb-size-price">
              {tk(s.price)} <s>{tk(s.was)}</s>
            </span>
            <small>প্রতি ১০০ গ্রাম {tk(Math.round((s.price / s.g) * 100))}</small>
          </button>
        ))}
      </div>

      <div className="cb-reveal" data-open={g === 500}>
        <div>
          <div className="cb-gift">
            <span className="cb-gift-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.2C7 7 9.5 7 12 7Zm0 0c1.5-3 5-3.5 5-1.2C17 7 14.5 7 12 7Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              <b>কর্নফ্লাওয়ার ১০০ গ্রাম, একদম ফ্রি</b>
              <small>মুচমুচে কোটিং-এর জন্য, ৫০০ গ্রামের সাথে</small>
            </span>
          </div>
        </div>
      </div>
      <div className="cb-reveal" data-open={g === 250}>
        <div>
          <button type="button" className="cb-nudge" onClick={() => setG(500)}>
            ৫০০ গ্রাম নিলে কর্নফ্লাওয়ার ফ্রি, আর প্রতি ১০০ গ্রামে ৳১০ কম
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <BuyBar label="অর্ডার করুন" price={size.price} was={size.was} />
    </div>
  );
}

function BuyBar({
  label,
  price,
  was,
  disabled,
}: {
  label: string;
  price: number;
  was?: number;
  disabled?: boolean;
}) {
  return (
    <div className="cb-buy">
      <span className="cb-buy-price">
        <b>
          <Price value={price} />
        </b>
        {was ? <s>{tk(was)}</s> : null}
      </span>
      <button type="button" className="cb-cta" disabled={disabled}>
        {label}
      </button>
    </div>
  );
}
