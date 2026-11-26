"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  Avatar,
  Cursor,
  PEOPLE,
  Stage,
  useInView,
  useLoop,
  useReduced,
  type Aim,
  type Who,
} from "@/app/pricing-variants/live/engine";
import { Phone } from "@/components/stageshow/phone";

// "Your site today": Grambangla's own pages, captured on a phone (27 Nov 2026), with the team going
// over them live. Each cursor marks one problem and writes the note beside the phone. Every note is
// either visible in the screenshot or measured (mobile 4G: 1.6 Mbps, 150 ms, CPU slowed 4×).

type Spot = { t: string; box: [number, number, number, number] };
type Note = {
  who: Who;
  t: string;
  aim?: { x: number; y: number };
  text: string;
};
type Page = {
  id: string;
  title: string;
  url: string;
  src: string;
  spots: Spot[];
  notes: Note[];
};

// Boxes are [left, top, width, height] in the page's own CSS pixels (402 wide, 812 tall)
export const PAGES: Page[] = [
  {
    id: "home",
    title: "Home page",
    url: "grambanglashop.com",
    src: "/pitch/grambangla/today/home.webp",
    spots: [
      { t: "home-top", box: [0, 0, 402, 84] },
      { t: "home-hero", box: [0, 146, 402, 222] },
      { t: "home-stock", box: [30, 424, 362, 200] },
      { t: "home-cart", box: [10, 692, 52, 52] },
    ],
    notes: [
      {
        who: "sadia",
        t: "home-top",
        text: "Three lines of phone numbers before your logo. The same number twice, written “++880”.",
      },
      {
        who: "edith",
        t: "home-hero",
        aim: { x: 0.5, y: 0.5 },
        text: "Your hero banner is empty. Still blank 8 seconds after the page loads.",
      },
      {
        who: "imran",
        t: "home-stock",
        aim: { x: 0.72, y: 0.86 },
        text: "The first two products anyone sees are out of stock, and the button says “Read more”.",
      },
      {
        who: "joya",
        t: "home-cart",
        aim: { x: 0.8, y: 0.3 },
        text: "The floating cart sits on top of product names.",
      },
      {
        who: "edith",
        t: "home-hero",
        aim: { x: 0.3, y: 0.3 },
        text: "41 stylesheets and 1.6 MB: 8.4 s to finish loading on mobile 4G.",
      },
    ],
  },
  {
    id: "product",
    title: "Ghee product page",
    url: "grambanglashop.com/product/premium-gawa-ghee-500g",
    src: "/pitch/grambangla/today/product.webp",
    spots: [
      { t: "prod-sale", box: [36, 160, 42, 26] },
      { t: "prod-photo", box: [38, 184, 326, 326] },
      { t: "prod-price", box: [26, 594, 110, 34] },
      { t: "prod-tags", box: [26, 662, 352, 96] },
      { t: "prod-cta", box: [26, 772, 350, 40] },
    ],
    notes: [
      {
        who: "edith",
        t: "prod-photo",
        aim: { x: 0.5, y: 0.45 },
        text: "2.1 s of blank screen before anything shows on 4G. 44 stylesheets for one product.",
      },
      {
        who: "sadia",
        t: "prod-sale",
        aim: { x: 0.9, y: 0.7 },
        text: "The theme's default “Sale!” sticker. Your best seller gets the same page as a ৳130 spice.",
      },
      {
        who: "imran",
        t: "prod-price",
        aim: { x: 0.9, y: 0.7 },
        text: "৳45 off, and it never says so. No 1 kg jar beside it, nothing to add.",
      },
      {
        who: "joya",
        t: "prod-tags",
        aim: { x: 0.7, y: 0.7 },
        text: "Search keywords printed on the page for shoppers to read.",
      },
      {
        who: "imran",
        t: "prod-cta",
        aim: { x: 0.6, y: 0.6 },
        text: "Add to Cart sits under all of it, at the bottom of the screen.",
      },
    ],
  },
];

// The page sits in the phone's screen under the 62pt status bar; the phone is drawn at PHONE_W
const PHONE_W = 330;
const S = PHONE_W / 428;

/* Types a note out once it's shown; reduced motion gets it whole */
function Typed({
  text,
  on,
  reduce,
}: {
  text: string;
  on: boolean;
  reduce: boolean;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return setN(0);
    if (reduce) return setN(text.length);
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setN(Math.min(i, text.length));
      if (i >= text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [on, text, reduce]);
  return (
    <>
      <span>{text.slice(0, n)}</span>
      <span className="au-ghost" aria-hidden="true">
        {text.slice(n)}
      </span>
    </>
  );
}

/* Phones get their own layout: the page on top, the notes under it at a readable size */
function useCompact() {
  const [c, setC] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(max-width: 809px)");
    const on = () => setC(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return c;
}

export function Audit({ page }: { page: Page }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  const reduce = useReduced();
  const compact = useCompact();
  const people = [...new Set(page.notes.map((n) => n.who))];
  // Before its first note a cursor waits, hidden, just right of the spot it will mark, so it
  // glides in a short way instead of crossing the stage; it never parks in a pile
  const first = (w: Who): Aim => {
    const n = page.notes.find((x) => x.who === w)!;
    return { t: n.t, x: 1.15, y: (n.aim?.y ?? 0.5) + 0.15 };
  };
  const start = () => Object.fromEntries(people.map((w) => [w, first(w)]));
  const [aims, setAims] = useState<Record<string, Aim>>(start);
  const [seen, setSeen] = useState<Set<Who>>(() => new Set());
  const [press, setPress] = useState<Record<string, number>>({});
  // Reduced motion, and the first frame anyone sees, show every note
  const [shown, setShown] = useState(page.notes.length);

  useLoop(inView && !reduce, async (wait) => {
    setSeen(new Set());
    await wait(400);
    setShown(0);
    setAims(start());
    await wait(700);
    for (let i = 0; i < page.notes.length; i++) {
      const n = page.notes[i];
      setSeen((v) => new Set(v).add(n.who));
      await wait(60);
      setAims((a) => ({
        ...a,
        [n.who]: { t: n.t, ...(n.aim ?? { x: 0.5, y: 0.5 }) },
      }));
      await wait(1050);
      setPress((p) => ({ ...p, [n.who]: (p[n.who] ?? 0) + 1 }));
      setShown(i + 1);
      await wait(2300);
    }
    await wait(5200);
    // the round ends: everyone steps away, then the notes clear
    setSeen(new Set());
    await wait(500);
  });

  // A spot can carry more than one note; each keeps its own numbered pin
  const lit = new Map<string, { who: Who; n: number }[]>();
  page.notes
    .slice(0, shown)
    .forEach((n, i) =>
      lit.set(n.t, [...(lit.get(n.t) ?? []), { who: n.who, n: i + 1 }]),
    );

  return (
    <figure
      ref={ref}
      className="au"
      data-compact={compact || undefined}
      aria-label={`${page.title}: what the team found`}
    >
      <Stage
        key={compact ? "c" : "w"}
        width={compact ? 400 : 860}
        height={compact ? 1290 : 712}
        max={1}
      >
        <div
          className="au-phone"
          style={{ ["--s" as string]: S } as CSSProperties}
        >
          <Phone width={PHONE_W} frame="pro">
            <div className="au-page">
              <img
                src={page.src}
                alt={`${page.title} on a phone, as it looks today`}
                width={600}
                height={1212}
                draggable={false}
              />
              {page.spots.map((s) => {
                const l = lit.get(s.t)?.at(-1);
                const pins = lit.get(s.t) ?? [];
                return (
                  <span
                    key={s.t}
                    data-t={s.t}
                    className="au-spot"
                    data-on={l ? "" : undefined}
                    style={
                      {
                        left: s.box[0],
                        top: s.box[1],
                        width: s.box[2],
                        height: s.box[3],
                        ["--who" as string]: l
                          ? PEOPLE[l.who].color
                          : "transparent",
                      } as CSSProperties
                    }
                  >
                    {pins.length > 0 && (
                      <span className="au-pins">
                        {pins.map((p) => (
                          <i
                            key={p.n}
                            className="au-pin"
                            style={
                              {
                                ["--who" as string]: PEOPLE[p.who].color,
                              } as CSSProperties
                            }
                          >
                            {p.n}
                          </i>
                        ))}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </Phone>
        </div>
        <div className="au-side">
          <div className="au-head">
            <b>{page.title}</b>
            <span>{page.url}</span>
          </div>
          <ol className="au-notes">
            {page.notes.map((n, i) => (
              <li
                key={i}
                data-on={i < shown ? "" : undefined}
                style={
                  { ["--who" as string]: PEOPLE[n.who].color } as CSSProperties
                }
              >
                <span className="au-who">
                  <i className="au-n">{i + 1}</i>
                  <Avatar who={n.who} size={18} />
                  {PEOPLE[n.who].name}
                </span>
                <p>
                  <Typed
                    text={n.text}
                    on={i < shown}
                    reduce={reduce || !inView}
                  />
                </p>
              </li>
            ))}
          </ol>
        </div>
        {!reduce &&
          people.map((w) => (
            <Cursor
              key={w}
              who={w}
              at={aims[w]}
              press={press[w] ?? 0}
              hidden={!seen.has(w)}
            />
          ))}
      </Stage>
    </figure>
  );
}
