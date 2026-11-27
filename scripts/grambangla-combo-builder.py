# Builds public/grambangla/build-your-combo.html from the ghee page (public/grambangla/index.html): same
# header, tokens, buttons, perks, related, Instagram grid and footer. The product section becomes a combo
# maker: a box of six slots; tapping a slot opens a product sheet (search + categories) with the whole shop;
# the box gets cheaper at 3, 4 and 6 items. Re-run after changing the ghee page's shared parts.
#   python3 scripts/grambangla-combo-builder.py
import re
from pathlib import Path

SRC = Path("public/grambangla/index.html")
OUT = Path("public/grambangla/build-your-combo.html")
s = SRC.read_text()


def cut(s, start, end):
    a = s.index(start)
    b = s.index(end, a) + len(end)
    return s[:a], s[a:b], s[b:]


# ── head ──
s = s.replace("<title>Premium Gawa Ghee — Grambangla</title>", "<title>Build Your Combo — Grambangla</title>")
s = re.sub(r'<meta name="description" content="[^"]*">',
           '<meta name="description" content="Make your own Grambangla combo: put any 3 or more products in one box (ghee, mustard oil, masala, ready mixes) and the whole box gets cheaper. Cash on delivery anywhere in Bangladesh.">', s)

CSS = r"""
/* ───────────── combo maker ───────────── */
/* the stage is the box: six slots in a 3 × 2 grid; the 3rd, 4th and 6th carry the discount steps */
.box-stage{display:grid;place-items:center}
.boxgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;width:min(84%,470px);margin-top:-20px}
.slot{position:relative;aspect-ratio:1;border-radius:16px}
.slot-main{position:absolute;inset:0;width:100%;border-radius:inherit;transition:transform 160ms var(--ease-out)}
.slot-main:active{transform:scale(.96)}
.slot .empty{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:2px;border-radius:inherit;
  border:1.5px dashed color-mix(in srgb,var(--ink) 22%,transparent);color:color-mix(in srgb,var(--ink) 42%,transparent);
  transition:opacity 180ms ease,border-color .2s ease,color .2s ease}
.slot .plus{font:300 30px/1 var(--font);letter-spacing:0}
.slot .tier{font:700 19px/1 "Caveat",cursive;letter-spacing:0;color:var(--orange-dk)}
.slot.filled .empty{opacity:0}
.slot .jar{position:absolute;inset:6% 6% 18%;width:88%;height:76%;object-fit:contain;mix-blend-mode:multiply;
  opacity:0;transform:translateY(-12px) scale(.94);filter:blur(4px);
  transition:opacity 220ms ease,transform 320ms var(--ease-out),filter 220ms ease}
.slot.filled .jar{opacity:1;transform:none;filter:none}
.slot .nm{position:absolute;left:6px;right:6px;bottom:7px;font-size:11.5px;line-height:1.2;text-align:center;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0;transition:opacity 200ms ease}
.slot.filled .nm{opacity:1}
.slot.filled{background:color-mix(in srgb,#fff 55%,transparent);box-shadow:0 0 0 1px rgba(28,17,8,.06)}
.slot-x{position:absolute;z-index:2;top:-7px;right:-7px;width:24px;height:24px;border-radius:50%;background:var(--ink);color:var(--bg);
  display:grid;place-items:center;opacity:0;transform:scale(.6);pointer-events:none;
  transition:opacity 160ms ease,transform 200ms var(--ease-out)}
.slot-x svg{width:10px;height:10px;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}
.slot.filled .slot-x{opacity:1;transform:none;pointer-events:auto}
.slot-x:active{transform:scale(.9)}
.slot-x::before{content:"";position:absolute;inset:-10px}
.slot .pct{position:absolute;left:7px;top:7px;padding:2px 6px;border-radius:4px;background:var(--orange-dk);color:#fff;font-size:10.5px;font-weight:600;letter-spacing:0;
  opacity:0;transition:opacity 200ms ease}
.slot.filled .pct{opacity:1}
@media (hover:hover) and (pointer:fine){.slot:not(.filled) .slot-main:hover .empty{border-color:var(--orange-dk);color:var(--orange-dk)}}
.box-note{position:absolute;left:0;right:0;bottom:32px;display:flex;justify-content:center;pointer-events:none}
.box-note .dt{transform:rotate(-3deg);color:var(--orange-dk);font-size:27px}

/* start-from chips: ready-made boxes the shopper can begin with */
.starters{display:flex;gap:8px;flex-wrap:wrap}
.starter{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 14px 0 6px;border-radius:999px;border:1px solid var(--line);font-size:13px;
  transition:background-color .2s ease,border-color .2s ease,transform 160ms var(--ease-out)}
.starter:active{transform:scale(.97)}
.starter .st-img{display:flex}
.starter .st-img img{width:26px;height:26px;margin-right:-9px;border-radius:50%;background:var(--tile);object-fit:contain;mix-blend-mode:multiply;box-shadow:0 0 0 2px var(--bg)}
.starter .st-img img:last-child{margin-right:0}
@media (hover:hover) and (pointer:fine){.starter:hover{border-color:var(--ink)}}

/* the discount ladder */
.ladder{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:22px}
.rung{position:relative;padding:10px 12px 11px;border-radius:8px;border:1px solid var(--line);transition:background-color .25s ease,border-color .25s ease,color .25s ease}
.rung b{display:block;font-size:17px;font-weight:600;letter-spacing:-.4px}
.rung span{font-size:12px;color:var(--muted)}
.rung.done{background:var(--orange-dk);border-color:var(--orange-dk);color:#fff}
.rung.done span{color:rgba(255,255,255,.75)}
.rung.next{border-color:var(--ink)}
.hint{display:flex;justify-content:space-between;gap:12px;margin-top:10px;font-size:13px}
.hint b{font-weight:600;color:var(--orange-dk)}
.hint .muted{font-variant-numeric:tabular-nums;white-space:nowrap}
.saved{display:inline-flex;align-items:center;height:22px;padding:0 9px;margin-left:6px;border-radius:5px;background:var(--orange-dk);color:#fff;font-size:12px;font-weight:500;letter-spacing:0;
  transform:translateY(-3px);transition:opacity 180ms ease}
.saved.none{opacity:0}
.open-sheet{width:100%;margin-top:22px;height:48px;border:1px dashed color-mix(in srgb,var(--ink) 35%,transparent);background:none;color:var(--ink)}
.open-sheet svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round}
.buynow:disabled,.add:disabled{opacity:.4;cursor:default;transform:none}

/* ───────────── the product sheet: a bottom sheet on phones, a centred panel on desktop ───────────── */
.sh-scrim{position:fixed;inset:0;z-index:70;background:rgba(28,17,8,.32);opacity:0;pointer-events:none;transition:opacity 240ms ease}
.sheet{position:fixed;z-index:71;left:50%;top:50%;width:min(560px,calc(100vw - 32px));max-height:min(720px,calc(100dvh - 64px));
  display:flex;flex-direction:column;border-radius:22px;background:var(--bg);
  box-shadow:0 0 0 1px rgba(28,17,8,.06),0 30px 80px -20px rgba(28,17,8,.45);
  transform:translate(-50%,-50%) scale(.96);opacity:0;visibility:hidden;
  transition:transform 200ms var(--ease-out),opacity 160ms ease,visibility 0s linear 200ms}
.sh-open .sh-scrim{opacity:1;pointer-events:auto}
.sh-open .sheet{transform:translate(-50%,-50%);opacity:1;visibility:visible;transition-delay:0s}
.sh-grab{display:none}
/* only the product list scrolls; everything around it keeps its height when the panel runs short */
.sheet>*:not(.sh-list){flex:none}
.sh-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:20px 20px 12px}
.sh-head h2{font-size:20px;font-weight:500;letter-spacing:-.6px}
.sh-head p{margin-top:3px;font-size:13px;color:var(--muted)}
.sh-x{width:34px;height:34px;flex:none;border-radius:50%;background:var(--tile);display:grid;place-items:center;transition:transform 160ms var(--ease-out)}
.sh-x:active{transform:scale(.92)}
.sh-x svg{width:12px;height:12px;stroke:currentColor;stroke-width:1.6;stroke-linecap:round}
.sh-search{display:flex;align-items:center;gap:10px;margin:0 20px;height:46px;padding:0 14px;border-radius:12px;background:#fff;box-shadow:0 0 0 1px var(--line);transition:box-shadow .2s ease}
.sh-search:focus-within{box-shadow:0 0 0 1.5px var(--ink)}
.sh-search svg{width:17px;height:17px;flex:none;fill:none;stroke:var(--muted);stroke-width:1.7;stroke-linecap:round}
.sh-search input{flex:1;min-width:0;height:100%;border:0;outline:0;background:none;font:inherit;font-size:16px;letter-spacing:var(--track);color:var(--ink)}
.sh-search input::placeholder{color:var(--muted)}
.sh-search input::-webkit-search-cancel-button{display:none}
.sh-clear{width:22px;height:22px;border-radius:50%;background:var(--tile);display:none;place-items:center}
.sh-clear svg{width:9px;height:9px;stroke:var(--ink);stroke-width:1.8}
.sh-search.has .sh-clear{display:grid}
.sh-cats{display:flex;gap:6px;padding:12px 20px 4px;overflow-x:auto;scrollbar-width:none}
.sh-cats::-webkit-scrollbar{display:none}
.sh-cat{flex:none;height:34px;padding:0 14px;border-radius:999px;border:1px solid var(--line);font-size:13px;white-space:nowrap;
  transition:background-color .2s ease,color .2s ease,border-color .2s ease,transform 160ms var(--ease-out)}
.sh-cat:active{transform:scale(.96)}
.sh-cat[aria-selected="true"]{background:var(--ink);border-color:var(--ink);color:var(--bg)}
.sh-list{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:8px 12px 12px}
.sh-item{display:grid;grid-template-columns:58px 1fr auto;align-items:center;gap:12px;width:100%;padding:8px;border-radius:12px;text-align:left;
  transition:background-color .15s ease}
.sh-item img{width:58px;height:58px;border-radius:10px;background:var(--tile);object-fit:contain;mix-blend-mode:multiply}
.sh-item .t{display:grid;gap:2px;min-width:0}
.sh-item .t b{font-weight:500;font-size:14px}
.sh-item .t small{font:400 12.5px/1.3 "Noto Sans Bengali",var(--font);letter-spacing:0;color:var(--muted)}
.sh-item .t .p{font-size:13px;font-variant-numeric:tabular-nums}
.sh-add{position:relative;width:36px;height:36px;border-radius:50%;background:var(--orange-dk);color:#fff;display:grid;place-items:center;transition:transform 160ms var(--ease-out),opacity .2s ease}
.sh-add svg{width:14px;height:14px;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}
.sh-item:active .sh-add{transform:scale(.9)}
.sh-add .n{position:absolute;top:-5px;right:-5px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--ink);color:var(--bg);font-size:11px;font-weight:600;display:grid;place-items:center;font-variant-numeric:tabular-nums}
.sh-item:disabled{cursor:default}
.sh-item:disabled img{opacity:.45}
.sh-item:disabled .sh-add{opacity:.25}
.sh-item .so{font-size:11.5px;color:#b3261e}
@media (hover:hover) and (pointer:fine){.sh-item:not(:disabled):hover{background:var(--tile)}}
.sh-empty{padding:40px 20px;text-align:center;color:var(--muted);font-size:14px;line-height:1.5}
.sh-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 20px calc(14px + env(safe-area-inset-bottom));border-top:1px solid var(--line)}
.sh-sum{display:flex;align-items:center;gap:10px;min-width:0;font-size:13px}
.sh-dots{display:flex;gap:3px}
.sh-dots i{width:8px;height:8px;border-radius:2px;background:var(--line);transition:background-color .2s ease}
.sh-dots i.on{background:var(--orange-dk)}
.sh-sum b{font-variant-numeric:tabular-nums;font-weight:600}
.sh-done{height:44px;padding:0 22px;background:var(--cta);color:var(--cta-ink)}
@media (max-width:820px){
  .boxgrid{gap:10px;width:88%;margin-top:-26px}
  .slot .plus{font-size:24px}.slot .tier{font-size:16px}
  .slot .nm{font-size:10px;bottom:5px}
  .box-note{bottom:16px}.box-note .dt{font-size:21px}
  .ladder{gap:6px}.rung{padding:9px 10px}.rung b{font-size:15px}.rung span{font-size:11px}
  /* phones: a bottom sheet with an iOS-style drawer curve; exit is quicker than entry */
  .sheet{left:0;right:0;top:auto;bottom:0;width:auto;max-height:calc(100dvh - 48px);height:calc(100dvh - 48px);border-radius:22px 22px 0 0;
    transform:translateY(100%);opacity:1;transition:transform 220ms var(--ease-out),visibility 0s linear 220ms}
  .sh-open .sheet{transform:none;transition:transform 420ms cubic-bezier(.32,.72,0,1),visibility 0s}
  .sh-grab{display:block;width:38px;height:5px;margin:8px auto 0;border-radius:3px;background:var(--line)}
  .sh-head{padding:12px 16px 10px}
  .sh-search{margin:0 16px}.sh-cats{padding:10px 16px 2px}.sh-list{padding:6px 8px 10px}.sh-foot{padding-left:16px;padding-right:16px}
}
@media (prefers-reduced-motion:reduce){
  .slot .jar{transform:none!important;filter:none!important}
  .sheet,.sh-open .sheet{transition:opacity 200ms ease,visibility 0s!important}
  .sheet{opacity:0}.sh-open .sheet{opacity:1}
}
"""
s = s.replace("</style>", CSS + "</style>", 1)

# ── product section ──
X = '<svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8"/></svg>'
TIERS = {2: "5% off", 3: "8% off", 5: "12% off"}
slots = "\n".join(
    f'      <div class="slot" data-i="{i}"><button class="slot-main" aria-label="Box slot {i + 1}: add a product">'
    f'<span class="empty"><span class="plus">+</span>{"<span class=tier>" + TIERS[i] + "</span>" if i in TIERS else ""}</span>'
    f'<img class="jar" alt=""><span class="nm"></span>{"<span class=pct>" + TIERS[i].split()[0] + "</span>" if i in TIERS else ""}</button>'
    f'<button class="slot-x" aria-label="Remove from box">{X}</button></div>'
    for i in range(6))

PDP = '''<section class="pdp">
  <div class="stage tile box-stage" id="stage">
    <span class="tag badge" data-t="badge">Up to 12% off</span>
    <div class="boxgrid" id="boxgrid">
SLOTS
    </div>
    <div class="box-note" aria-hidden="true"><span class="dt" id="note">Tap a box to start</span></div>
  </div>

  <div class="info">
    <div class="row">
      <div>
        <div class="cap muted" data-t="cat">Combos · Make your own</div>
        <h1 class="h-xl"><span data-t="title">Build Your Combo</span></h1>
        <div class="sub muted" data-t="subtitle">নিজের কম্বো নিজেই বানান</div>
      </div>
      <button class="heart press" aria-pressed="false" aria-label="Add to favorites"><svg viewBox="0 0 24 24"><path d="M12 20.3s-7.5-4.6-9.2-9.4C1.6 7.4 3.9 4 7.3 4c2 0 3.6 1.1 4.7 2.7C13.1 5.1 14.7 4 16.7 4c3.4 0 5.7 3.4 4.5 6.9-1.7 4.8-9.2 9.4-9.2 9.4z"/></svg></button>
    </div>
    <div class="price"><span class="swap" id="price">৳0</span> <s class="was swap" id="was"></s><span class="saved none" id="saved"></span></div>
    <div class="rule"></div>
    <p class="desc" data-t="desc">x</p>

    <div class="ladder" aria-label="Box discounts">
      <div class="rung" data-n="3"><b>5% off</b><span data-t="r3">3 items</span></div>
      <div class="rung" data-n="4"><b>8% off</b><span data-t="r4">4–5 items</span></div>
      <div class="rung" data-n="6"><b>12% off</b><span data-t="r6">Full box · 6</span></div>
    </div>
    <p class="hint" aria-live="polite"><b id="hint">Add 3 items for 5% off</b><span class="muted" id="sep"></span></p>
    <button class="btn open-sheet" id="openSheet"><svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10"/></svg><span data-t="addp">Add products to your box</span></button>

    <p class="label" data-t="startL">Or start from a ready box</p>
    <div class="starters" id="starters"></div>

    <div class="buy">
      <div class="qty">
        <button id="minus" aria-label="Decrease" disabled><svg width="12" height="12"><path d="M1 6h10" stroke="currentColor"/></svg></button>
        <output id="q">1</output>
        <button id="plus" aria-label="Increase"><svg width="12" height="12"><path d="M1 6h10M6 1v10" stroke="currentColor"/></svg></button>
      </div>
      <button class="add" id="add">
        <span class="a" data-t="add">Add box to bag</span>
        <span class="b"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span data-t="added" style="position:static">Added to bag</span></span>
      </button>
    </div>
{SHARED}
    <div class="acc">
      <details><summary><span data-t="acc1">How it works</span><i class="pm"></i></summary>
        <div class="body"><div><p data-t="acc1b">x</p></div></div></details>
      <details><summary><span data-t="acc2">What's in my box</span><i class="pm"></i></summary>
        <div class="body"><div><p id="acc2b">x</p></div></div></details>
      <details><summary><span data-t="acc3">Delivery</span><i class="pm"></i></summary>
        <div class="body"><div><p data-t="acc3b">x</p></div></div></details>
    </div>
  </div>
</section>

<!-- ───────── product sheet ───────── -->
<div class="sh-scrim" data-sh-close></div>
<div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="shT" aria-hidden="true">
  <div class="sh-grab" aria-hidden="true"></div>
  <div class="sh-head">
    <div><h2 id="shT">Add to your box</h2><p id="shSub">Box 1 of 6</p></div>
    <button class="sh-x" data-sh-close aria-label="Close">XICON</button>
  </div>
  <label class="sh-search" id="shSearch">
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
    <input id="shQ" type="search" placeholder="Search ghee, তেল, masala…" autocomplete="off" aria-label="Search products">
    <button type="button" class="sh-clear" id="shClear" aria-label="Clear search"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8"/></svg></button>
  </label>
  <div class="sh-cats" id="shCats" role="tablist" aria-label="Categories"></div>
  <div class="sh-list" id="shList"></div>
  <div class="sh-foot">
    <div class="sh-sum"><span class="sh-dots" id="shDots" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span><span id="shSum">0 in box</span></div>
    <button class="btn sh-done" data-sh-close data-t="done">Done</button>
  </div>
</div>'''
PDP = PDP.replace("SLOTS", slots).replace("XICON", X)

a, old_pdp, b = cut(s, '<section class="pdp">', "</section>")
i = old_pdp.index('    <button class="btn buynow"')
j = old_pdp.index('<img src="assets/logo.webp" alt="Grambangla"></a>\n', i) + len('<img src="assets/logo.webp" alt="Grambangla"></a>\n')
shared = old_pdp[i:j].replace("Premium%20Gawa%20Ghee%20order", "Combo%20box%20order")
s = a + PDP.replace("{SHARED}", shared) + b

# drop the ghee spec sheet
a, _, b = cut(s, '<section class="spec"', "</section>")
s = a + b

# ── script ──
a, _, b = cut(s, "const T = {", "};\n")
T = r'''const T = {
  en:{nav1:"Ghee",nav2:"Mustard Oil",nav3:"Shemai",nav4:"Masala",acct:"Account",fav:"Favorites",search:"Search",bag:"Bag",
    badge:"Up to 12% off",cat:"Combos · Make your own",title:"Build Your Combo",subtitle:"নিজের কম্বো নিজেই বানান",
    desc:"Put any Grambangla products in one box (ghee, mustard oil, masala, ready mixes) and the whole box gets cheaper. Tap an empty box to add something; tap a filled one to swap it.",
    r3:"3 items",r4:"4–5 items",r6:"Full box · 6",addp:"Add products to your box",startL:"Or start from a ready box",done:"Done",
    add:"Add box to bag",added:"Added to bag",buy:"Buy now",buysub:"· Cash on Delivery",wa:"Order on WhatsApp",call:"Call for order",hot:"Hotline",brandL:"Brand",
    acc1:"How it works",acc2:"What’s in my box",acc3:"Delivery",
    acc1b:"Tap any empty box and pick a product; search in English or Bangla. You can add the same product twice. 3 items take 5% off the whole box, 4 or 5 items 8%, and a full box of 6 takes 12%. The discount is on everything in the box.",
    acc3b:"The whole box ships together in one parcel, cash on delivery anywhere in Bangladesh, usually in 3–5 days.",
    p1:"100% Natural",p2:"Mix Anything",p3:"Cash on Delivery",p4:"Nationwide Delivery",
    ymal:"You may also like",shopall:"Shop all",igFollow:"Follow",igOrder:"Order: 01792-842109",
    tag:"Pure deshi food, from the village to your home.",tag2:"খাঁটি গ্রামবাংলার স্বাদ, আপনার ঘরে।",hotl:"Order hotline",copy:"©2026 Grambangla · BDT ৳",f1:"Shop",f1a:"All Products",f1e:"Combos",f2:"Company",f2a:"About us",f2b:"From Pabna",f2c:"Quality",f2d:"Recipes",
    f3:"Help",f3a:"FAQ’s",f3b:"Track Order",f3c:"Delivery",f3d:"Contact",f4:"Legal",f4a:"Terms of Service",f4b:"Return Policy",f4c:"Privacy Policy"},
  bn:{}
};
'''
s = a + T + b

# product logic: from the SIZES table through the size-chip handler (includes the old applyText and gallery)
a, _, b = cut(s, "/* the two jars, from Grambangla's own prices */", "$$(\".thumb\")[price===1000?1:0].click();\n}));\n")
LOGIC = r'''/* Grambangla's shop at its own prices (Nov 2026). `k` holds search words in English, Bangla and how
   people type it (ghi, tel, mirch). The 5 / 8 / 12% steps are a proposal for the client to set. */
const P = [
  {id:"ghee1",s:"Ghee 1 kg",en:"Premium Gawa Ghee 1 kg",bn:"প্রিমিয়াম গাওয়া ঘি ১ কেজি",c:"ghee",p:1710,img:"assets/jar-1kg.webp",k:"ghee ghi gawa ঘি গাওয়া"},
  {id:"ghee5",s:"Ghee 500 g",en:"Premium Gawa Ghee 500 g",bn:"প্রিমিয়াম গাওয়া ঘি ৫০০ গ্রাম",c:"ghee",p:855,img:"assets/jar-500.webp",k:"ghee ghi gawa ঘি গাওয়া"},
  {id:"oil5",s:"Mustard Oil 5 L",en:"Deshi Mustard Oil 5 L",bn:"দেশি সরিষার তেল ৫ লিটার",c:"oil",p:1470,img:"assets/box/oil-5l.webp",k:"oil tel sorisha shorisha mustard তেল সরিষা"},
  {id:"oil2",s:"Mustard Oil 2 L",en:"Deshi Mustard Oil 2 L",bn:"দেশি সরিষার তেল ২ লিটার",c:"oil",p:620,img:"assets/box/oil-2l.webp",k:"oil tel sorisha shorisha mustard তেল সরিষা"},
  {id:"holud",s:"Turmeric",en:"Turmeric Powder 200 g",bn:"হলুদের গুঁড়া",c:"masala",p:150,img:"assets/box/holud-gura.webp",k:"turmeric holud haldi masala মসলা হলুদ gura"},
  {id:"morich",s:"Chilli",en:"Chilli Powder 200 g",bn:"মরিচের গুঁড়া",c:"masala",p:180,img:"assets/box/moricher-gura.webp",k:"chilli chili morich mirch masala মসলা মরিচ gura"},
  {id:"dhonia",s:"Coriander",en:"Coriander Powder 200 g",bn:"ধনিয়ার গুঁড়া",c:"masala",p:130,img:"assets/box/dhoniar-gura.webp",k:"coriander dhonia dhoniya masala মসলা ধনিয়া gura"},
  {id:"jira",s:"Cumin",en:"Cumin Powder 200 g",bn:"জিরার গুঁড়া",c:"masala",p:390,img:"assets/box/jira-gura.webp",k:"cumin jira zira masala মসলা জিরা gura"},
  {id:"kacchi",s:"Kacchi Masala",en:"Nawabi Kacchi Biryani Masala",bn:"নবাবি কাচ্চি বিরিয়ানি মসলা",c:"masala",p:750,img:"assets/box/kacchi.webp",k:"kacchi kachchi biryani biriyani masala মসলা কাচ্চি বিরিয়ানি"},
  {id:"shahi",s:"Shahi Masala",en:"Special Shahi Masala",bn:"স্পেশাল শাহী মসলা",c:"masala",p:800,img:"assets/box/shahi.webp",k:"shahi sahi special masala মসলা শাহী"},
  {id:"fry",s:"Magic Fry",en:"Magic Fry Mix 250 g",bn:"ম্যাজিক ফ্রাই মিক্স",c:"mix",p:550,img:"assets/box/magic-fry.webp",k:"magic fry chicken fry mix ফ্রাই চিকেন"},
  {id:"rice",s:"Fried Rice Mix",en:"Fried Rice Seasoning Mix 500 g",bn:"ফ্রাইড রাইস সিজনিং মিক্স",c:"mix",p:1050,img:"assets/box/fried-rice.png",k:"fried rice seasoning mix ফ্রাইড রাইস"},
  {id:"semai",s:"Laccha Shemai",en:"Premium Laccha Shemai 500 g",bn:"প্রিমিয়াম লাচ্ছা সেমাই",c:"shemai",p:849,img:"assets/box/semai.webp",k:"semai shemai lachha laccha সেমাই লাচ্ছা",out:true},
];
const CATS=[["all","All"],["ghee","Ghee"],["oil","Mustard Oil"],["masala","Masala"],["mix","Ready Mix"],["shemai","Shemai"]];
const STARTERS=[
  {en:"Masala starter",ids:["holud","morich","dhonia","jira"]},
  {en:"Biryani night",ids:["ghee5","kacchi","oil2"]},
  {en:"Kitchen basics",ids:["oil5","ghee5","holud","morich"]},
  {en:"Weekend fry",ids:["fry","rice","oil2"]},
];
const MAX=6, pctFor=n=>n>=6?12:n>=4?8:n>=3?5:0;
const byId=Object.fromEntries(P.map(x=>[x.id,x]));
const root=document.documentElement, $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let lang="en", box=[], qty=1, bag=0, cat="all", swapAt=null;
const bnNum=s=>String(s).replace(/\d/g,d=>"০১২৩৪৫৬৭৮৯"[d]);
const money=n=>"৳"+n.toLocaleString("en-US");
function swapText(el,txt){ if(el.textContent===txt) return; el.classList.add("out"); setTimeout(()=>{el.textContent=txt;el.classList.remove("out")},140) }
const short=x=>x.s;

/* the box */
function render(){
  const n=box.length, full=box.reduce((t,id)=>t+byId[id].p,0), pct=pctFor(n), off=Math.round(full*pct/100);
  $$(".slot").forEach((el,i)=>{
    const id=box[i], x=id&&byId[id];
    el.classList.toggle("filled",!!x);
    const img=el.querySelector(".jar"); if(x&&img.getAttribute("src")!==x.img) img.src=x.img;
    el.querySelector(".nm").textContent=x?short(x):"";
    el.querySelector(".slot-main").setAttribute("aria-label",x?`Box ${i+1}: ${x.en}. Tap to swap`:`Box ${i+1}: add a product`);
  });
  swapText($("#price"),money(full-off)); $("#price").classList.toggle("muted",!n);
  swapText($("#was"),off?money(full):"");
  const sv=$("#saved"); sv.classList.toggle("none",!off); if(off) sv.textContent=`−${money(off)} · ${pct}%`;
  $$(".rung").forEach(r=>{const k=+r.dataset.n; r.classList.toggle("done",pct>=pctFor(k)); r.classList.toggle("next",pct<pctFor(k)&&pctFor(k)===nextPct(n))});
  const nx=nextStep(n);
  $("#hint").textContent=n===MAX?"Full box: 12% off everything":nx?`Add ${nx.need} more for ${nx.pct}% off`:"";
  $("#sep").textContent=off?`You save ${money(off)}`:n?`Total ${money(full)}`:"";
  $("#note").textContent=n===0?"Tap a box to start":n===MAX?"Full box · 12% off":`${n} in your box${pct?` · ${pct}% off`:""}`;
  $("#acc2b").textContent=n?box.map(id=>byId[id].en).join(" · "):"Nothing yet: tap an empty box to add a product.";
  $("#add").disabled=$("#buynow").disabled=n===0;
  if(root.classList.contains("sh-open")) renderSheet();
}
function nextStep(n){ for(const k of [3,4,6]) if(n<k) return {need:k-n,pct:pctFor(k)}; return null }
function nextPct(n){ const s=nextStep(n); return s?s.pct:-1 }
function remove(i){ box.splice(i,1); render() }

/* the sheet */
const sheet=$("#sheet"), q=$("#shQ");
let lastFocus=null;
$("#shCats").innerHTML=CATS.map(([k,l])=>`<button class="sh-cat" role="tab" data-c="${k}" aria-selected="${k==="all"}">${l}</button>`).join("");
function matches(x,term){
  if(!term) return true;
  const hay=(x.en+" "+x.bn+" "+x.k).toLowerCase();
  return term.toLowerCase().split(/\s+/).every(w=>hay.includes(w));
}
function renderSheet(){
  const term=q.value.trim(), n=box.length, full=n>=MAX&&swapAt===null;
  $("#shSearch").classList.toggle("has",!!term);
  $("#shT").textContent=swapAt!==null?`Swap ${short(byId[box[swapAt]])} for…`:"Add to your box";
  $("#shSub").textContent=swapAt!==null?`Box ${swapAt+1} of ${MAX}`:full?"Your box is full":`Box ${n+1} of ${MAX}`;
  const list=P.filter(x=>(cat==="all"||x.c===cat)&&matches(x,term));
  $("#shList").innerHTML=list.length?list.map(x=>{
    const c=box.filter(id=>id===x.id).length, off=x.out||full;
    return `<button class="sh-item" data-id="${x.id}" ${off?"disabled":""}><img src="${x.img}" alt="">
      <span class="t"><b>${x.en}</b><small>${x.bn}</small><span class="p">${money(x.p)}${x.out?' · <span class="so">Out of stock</span>':""}</span></span>
      <span class="sh-add" aria-hidden="true"><svg viewBox="0 0 14 14"><path d="M7 2v10M2 7h10"/></svg>${c?`<span class="n">${c}</span>`:""}</span></button>`}).join("")
    :`<p class="sh-empty">Nothing matches “${term.replace(/[<>&"]/g,"")}”.<br>Try ghee, oil, masala or ঘি.</p>`;
  $$("#shDots i").forEach((d,i)=>d.classList.toggle("on",i<n));
  const tot=box.reduce((t,id)=>t+byId[id].p,0), pct=pctFor(n);
  $("#shSum").innerHTML=n?`<b>${n}</b> in box · <b>${money(tot-Math.round(tot*pct/100))}</b>${pct?` · ${pct}% off`:""}`:"Your box is empty";
}
function openSheet(at=null){
  swapAt=at; lastFocus=document.activeElement;
  root.classList.add("sh-open","lock"); sheet.setAttribute("aria-hidden","false");
  renderSheet();
  if(matchMedia("(pointer:fine)").matches) setTimeout(()=>q.focus(),60);
}
function closeSheet(){
  root.classList.remove("sh-open","lock"); sheet.setAttribute("aria-hidden","true"); swapAt=null;
  lastFocus&&lastFocus.focus&&lastFocus.focus({preventScroll:true});
}
function pick(id){
  if(swapAt!==null){ box[swapAt]=id; render(); closeSheet(); return }
  if(box.length>=MAX) return;
  box.push(id); render();
}
q.addEventListener("input",renderSheet);
$("#shClear").addEventListener("click",()=>{q.value="";renderSheet();q.focus()});
document.addEventListener("click",e=>{
  const t=e.target;
  if(t.closest(".slot-x")){ remove(+t.closest(".slot").dataset.i); return }
  const sm=t.closest(".slot-main"); if(sm){ const i=+sm.closest(".slot").dataset.i; openSheet(i<box.length?i:null); return }
  if(t.closest("#openSheet")){ openSheet(); return }
  const c=t.closest(".sh-cat"); if(c){ cat=c.dataset.c; $$(".sh-cat").forEach(b=>b.setAttribute("aria-selected",b===c)); renderSheet(); return }
  const it=t.closest(".sh-item"); if(it&&!it.disabled){ pick(it.dataset.id); return }
  if(t.closest("[data-sh-close]")){ closeSheet(); return }
  const st=t.closest(".starter"); if(st){ box=STARTERS[+st.dataset.s].ids.slice(); render() }
});
addEventListener("keydown",e=>{ if(e.key==="Escape"&&root.classList.contains("sh-open")) closeSheet() });
$("#starters").innerHTML=STARTERS.map((s,i)=>`<button class="starter" data-s="${i}"><span class="st-img">${s.ids.slice(0,3).map(id=>`<img src="${byId[id].img}" alt="">`).join("")}</span>${s.en}</button>`).join("");

/* favourite */
document.addEventListener("click",e=>{const h=e.target.closest(".heart"); if(h) h.setAttribute("aria-pressed",h.getAttribute("aria-pressed")!=="true")});

/* text */
function applyText(){
  const d=T[lang];
  $$("[data-t]").forEach(el=>{const t=d[el.dataset.t]; if(t!=null) el.textContent=t});
  $("#q").textContent=qty;
  $("#bagN").textContent=bag;
  renderGrid(); render();
}
'''
s = a + LOGIC + b

a, _, b = cut(s, "/* spec sheet:", 'spImg.complete&&spImg.naturalWidth?specReady():spImg.addEventListener("load",specReady,{once:true});\n')
s = a + b

OUT.write_text(s)
print("wrote", OUT, len(s))
