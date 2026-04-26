"use client";

import { useState } from "react";

const EXPERIENCES = [
  { id: 1, title: "Dinner at a Michelin-Starred Restaurant", description: "A long, candlelit evening at one of Prague's celebrated restaurants — Czech cuisine reimagined with artistry and care.", goal: 350, tag: "Dining" },
  { id: 3, title: "Sunset Cruise on the Vltava", description: "Drifting beneath Charles Bridge as the castle and city skyline turn golden in the evening light.", goal: 200, tag: "Experience" },
  { id: 4, title: "Spa Day at a Historic Bathhouse", description: "Soaking in thermal waters in a centuries-old building — the kind of afternoon that makes you forget what day it is.", goal: 250, tag: "Wellness" },
  { id: 5, title: "Czech Wine & Beer Tasting", description: "From Moravian whites in hidden cellars to craft breweries in converted factories — tasting our way through the city.", goal: 175, tag: "Dining" },
  { id: 6, title: "Day Trip to Český Krumlov", description: "A fairy-tale medieval town in the Bohemian countryside, with a Renaissance castle perched above a winding river.", goal: 200, tag: "Adventure" },
  { id: 7, title: "A Night at a Boutique Hotel", description: "Waking up in a beautifully restored building in Malá Strana, with rooftop views of the castle and red-tiled roofs.", goal: 350, tag: "Stay" },
  { id: 8, title: "Flights & Travel Fund", description: "Help get us from New York to Prague and back — every mile matters.", goal: 2000, tag: "Travel" },
];

const PRESETS = [50, 100, 150, 250];

function Ornament() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", margin: "4px 0" }}>
      <div style={{ width: 36, height: 1, background: "rgba(91,123,94,0.2)" }} />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0.5C7 0.5 8.5 4.5 7 7C5.5 4.5 7 0.5 7 0.5Z" fill="#C4908B" opacity="0.5"/><path d="M7 13.5C7 13.5 8.5 9.5 7 7C5.5 9.5 7 13.5 7 13.5Z" fill="#5B7B5E" opacity="0.4"/><path d="M0.5 7C0.5 7 4.5 5.5 7 7C4.5 8.5 0.5 7 0.5 7Z" fill="#5B7B5E" opacity="0.4"/><path d="M13.5 7C13.5 7 9.5 5.5 7 7C9.5 8.5 13.5 7 13.5 7Z" fill="#C4908B" opacity="0.5"/></svg>
      <div style={{ width: 36, height: 1, background: "rgba(91,123,94,0.2)" }} />
    </div>
  );
}

function Modal({ experience, onClose }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(100);
  const [custom, setCustom] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const final = isCustom ? (Number(custom) || 0) : amount;

  const submit = async () => {
    if (!name.trim() || final < 1) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: final * 100, // Stripe uses cents
          guestName: name,
          message,
          experience: experience?.title || "General Honeymoon Fund",
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError("Could not connect. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" style={S.x}>&#x2715;</button>
        <div style={S.mHead}>
          <h3 style={S.mTitle}>{experience ? experience.title : "Contribute to Our Honeymoon"}</h3>
          <p style={S.mDesc}>{experience ? experience.description : "Any amount is deeply appreciated."}</p>
        </div>
        <div style={S.mBody}>
          <label style={S.lbl}>Your Name</label>
          <input style={S.inp} placeholder="e.g. The Johnsons" value={name} onChange={e => setName(e.target.value)} />

          <label style={{ ...S.lbl, marginTop: 16 }}>A Note for Us <span style={{ opacity: 0.4, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
          <textarea style={{ ...S.inp, minHeight: 64, resize: "vertical", fontFamily: "inherit" }} placeholder="A message, a memory, or some well wishes…" value={message} onChange={e => setMessage(e.target.value)} />

          <label style={{ ...S.lbl, marginTop: 16 }}>Amount</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PRESETS.map(a => (
              <button key={a} onClick={() => { setAmount(a); setIsCustom(false); }}
                style={{ ...S.aBtn, ...(amount === a && !isCustom ? S.aBtnOn : {}) }}>
                ${a}
              </button>
            ))}
            <button onClick={() => setIsCustom(true)} style={{ ...S.aBtn, ...(isCustom ? S.aBtnOn : {}) }}>Other</button>
          </div>

          {isCustom && (
            <div style={{ position: "relative", marginTop: 10 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#5B7B5E", fontSize: 15, fontWeight: 500, pointerEvents: "none" }}>$</span>
              <input style={{ ...S.inp, paddingLeft: 28 }} type="number" min="1" placeholder="Enter amount" value={custom} onChange={e => setCustom(e.target.value)} autoFocus />
            </div>
          )}

          {error && (
            <p style={{ color: "#B07A75", fontSize: 13, marginTop: 12, textAlign: "center" }}>{error}</p>
          )}

          <button disabled={!name.trim() || final < 1 || loading} onClick={submit}
            style={{ ...S.pay, opacity: !name.trim() || final < 1 || loading ? 0.45 : 1, cursor: !name.trim() || final < 1 || loading ? "default" : "pointer" }}>
            {loading ? "Redirecting to checkout…" : `Contribute $${final}`}
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "#9DAF9F", marginTop: 10 }}>Payments processed securely via Stripe</p>
        </div>
      </div>
    </div>
  );
}

function Card({ exp, i, onPick }) {
  const [h, setH] = useState(false);
  const tagColors = {
    Experience: { bg: "rgba(196,144,139,0.12)", color: "#B07A75" },
    Dining: { bg: "rgba(196,144,139,0.12)", color: "#B07A75" },
    Adventure: { bg: "rgba(91,123,94,0.1)", color: "#5B7B5E" },
    Wellness: { bg: "rgba(196,144,139,0.12)", color: "#B07A75" },
    Nature: { bg: "rgba(91,123,94,0.1)", color: "#5B7B5E" },
    Stay: { bg: "rgba(91,123,94,0.1)", color: "#5B7B5E" },
    Travel: { bg: "rgba(91,123,94,0.1)", color: "#5B7B5E" },
  };
  const tc = tagColors[exp.tag] || tagColors.Experience;

  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ ...S.card, transform: h ? "translateY(-3px)" : "none", boxShadow: h ? "0 14px 44px rgba(60,80,60,0.1)" : "0 1px 8px rgba(60,80,60,0.04)", borderColor: h ? "rgba(91,123,94,0.15)" : "rgba(91,123,94,0.07)", animationDelay: `${100 + i * 80}ms` }}>
      <div style={{ marginBottom: 12 }}>
        <span style={{ ...S.tag, background: tc.bg, color: tc.color }}>{exp.tag}</span>
      </div>
      <h3 style={S.cTitle}>{exp.title}</h3>
      <p style={S.cDesc}>{exp.description}</p>
      <div style={S.cFoot}>
        <span style={{ fontSize: 12, color: "#9DAF9F", fontWeight: 500 }}>Goal: ${exp.goal.toLocaleString()}</span>
        <button onClick={() => onPick(exp)} style={{ ...S.cBtn, background: h ? "#3D5A40" : "#5B7B5E" }}>Contribute</button>
      </div>
    </div>
  );
}

export default function HoneymoonFund() {
  const [modal, setModal] = useState(null);

  return (
    <div style={S.page}>
      <div style={S.tex} />

      <header style={S.hero}>
        <p style={S.over}>The Honeymoon Fund of</p>
        <h1 style={S.names}>Daia &amp; Bertie</h1>
        <Ornament />
        <p style={S.dest}>Prague, Czech Republic</p>
        <p style={S.body}>
          Your presence at our wedding is the greatest gift we could ask for.
          But if you'd like to contribute to the next chapter of our adventure
          together, we're heading to Prague — a city of spires, cobblestones,
          and golden light — for a week of exploring one of the most beautiful
          cities in the world.
        </p>
        <p style={S.sub}>Every contribution, no matter the size, goes directly toward making these memories real.</p>
      </header>

      <section style={S.gen}>
        <button onClick={() => setModal("general")} style={S.genBtn}>Contribute to Our Honeymoon</button>
      </section>

      <section style={S.orSection}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
          <div style={{ width: 60, height: 1, background: "rgba(91,123,94,0.15)" }} />
          <p style={{ fontSize: 12, color: "#9DAF9F", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, margin: 0 }}>or choose an experience</p>
          <div style={{ width: 60, height: 1, background: "rgba(91,123,94,0.15)" }} />
        </div>
      </section>

      <section style={S.grid}>
        {EXPERIENCES.map((e, i) => <Card key={e.id} exp={e} i={i} onPick={setModal} />)}
      </section>

      <section style={S.bloomSection}>
        <div style={S.bloomDivider} />
        <p style={S.bloomHeading}>Prefer to give a physical gift?</p>
        <p style={S.bloomBody}>
          We've also put together a small registry at Bloomingdale's for those
          who'd rather give something we can unwrap.
        </p>
        <a href="https://www.bloomingdales.com/registry/Daia-Ernst-Bertie-Woodward-Fisher/1435121" target="_blank" rel="noopener noreferrer" style={S.bloomLink}>
          View our Bloomingdale's Registry
        </a>
      </section>

      <footer style={S.foot}>
        <p style={{ fontSize: 15, color: "#6B8A6E", lineHeight: 1.7, margin: 0 }}>
          With love and gratitude,<br />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontStyle: "italic", color: "#3D5A40" }}>D &amp; B</span>
        </p>
        <p style={{ fontSize: 11, color: "#9DAF9F", marginTop: 14, lineHeight: 1.6 }}>
          Honeymoon fund payments are processed securely via Stripe.<br />Your card details are never stored on this site.
        </p>
      </footer>

      {modal && <Modal experience={modal === "general" ? null : modal} onClose={() => setModal(null)} />}
    </div>
  );
}

const S = {
  page: { position: "relative", minHeight: "100vh", background: "linear-gradient(180deg, #F7FAF5 0%, #F2F6EF 30%, #FBF5F4 60%, #F7FAF5 100%)", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", color: "#2C3E2D" },
  tex: { position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(91,123,94,0.02) 1px, transparent 0)", backgroundSize: "24px 24px", pointerEvents: "none" },

  hero: { position: "relative", zIndex: 1, textAlign: "center", padding: "56px 24px 28px", maxWidth: 580, margin: "0 auto" },
  over: { fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#C4908B", marginBottom: 4, fontWeight: 500 },
  names: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(36px, 8vw, 56px)", fontWeight: 300, fontStyle: "italic", color: "#2C3E2D", margin: "6px 0 14px", letterSpacing: "0.01em", lineHeight: 1.1 },
  dest: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 500, color: "#5B7B5E", letterSpacing: "0.06em", textTransform: "uppercase", margin: "14px 0 0" },
  body: { fontSize: 15, lineHeight: 1.75, color: "#4A6B4D", maxWidth: 500, margin: "16px auto 0" },
  sub: { fontSize: 13, color: "#C4908B", marginTop: 10, fontStyle: "italic" },

  grid: { position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(268px, 1fr))", gap: 16, padding: "12px 24px 32px", maxWidth: 920, margin: "0 auto" },

  card: { background: "rgba(255,255,255,0.72)", backdropFilter: "blur(10px)", borderRadius: 14, padding: "24px 24px 20px", border: "1px solid rgba(91,123,94,0.07)", transition: "all 0.3s ease", display: "flex", flexDirection: "column", minHeight: 210 },
  tag: { fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100, fontWeight: 600 },
  cTitle: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 500, color: "#2C3E2D", margin: "0 0 8px", lineHeight: 1.25 },
  cDesc: { fontSize: 13, lineHeight: 1.65, color: "#6B8A6E", flex: 1, margin: 0 },
  cFoot: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(91,123,94,0.08)" },
  cBtn: { color: "#F7FAF5", border: "none", padding: "7px 18px", borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "background 0.25s", fontFamily: "inherit", letterSpacing: "0.02em" },

  gen: { position: "relative", zIndex: 1, textAlign: "center", padding: "4px 24px 8px", maxWidth: 460, margin: "0 auto" },
  orSection: { position: "relative", zIndex: 1, textAlign: "center", padding: "8px 24px 4px", maxWidth: 500, margin: "0 auto" },
  genBtn: { background: "transparent", color: "#5B7B5E", border: "1.5px solid #C4908B", padding: "11px 28px", borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.3s", fontFamily: "inherit", letterSpacing: "0.04em" },

  bloomSection: { position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px 44px", maxWidth: 460, margin: "0 auto" },
  bloomDivider: { width: 1, height: 32, background: "rgba(91,123,94,0.15)", margin: "0 auto 20px" },
  bloomHeading: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 19, fontWeight: 500, color: "#2C3E2D", margin: "0 0 8px" },
  bloomBody: { fontSize: 14, color: "#6B8A6E", lineHeight: 1.65, margin: "0 0 16px", maxWidth: 380, marginLeft: "auto", marginRight: "auto" },
  bloomLink: { display: "inline-block", fontSize: 13, fontWeight: 500, color: "#C4908B", borderBottom: "1px solid rgba(196,144,139,0.4)", textDecoration: "none", letterSpacing: "0.02em", paddingBottom: 2, transition: "border-color 0.3s" },

  foot: { position: "relative", zIndex: 1, textAlign: "center", padding: "24px 24px 40px", borderTop: "1px solid rgba(91,123,94,0.08)" },

  overlay: { position: "fixed", inset: 0, background: "rgba(30,48,32,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 },
  modal: { background: "#F9FCF8", borderRadius: 16, maxWidth: 400, width: "100%", maxHeight: "90vh", overflow: "auto", position: "relative", boxShadow: "0 24px 80px rgba(30,48,32,0.2)" },
  x: { position: "absolute", top: 12, right: 12, background: "none", border: "none", fontSize: 16, color: "#9DAF9F", cursor: "pointer", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" },
  mHead: { textAlign: "center", padding: "32px 26px 18px", borderBottom: "1px solid rgba(91,123,94,0.08)" },
  mTitle: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 21, fontWeight: 500, color: "#2C3E2D", margin: "0 0 6px" },
  mDesc: { fontSize: 13, color: "#6B8A6E", lineHeight: 1.6, margin: 0 },
  mBody: { padding: "20px 26px 26px" },
  lbl: { display: "block", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5B7B5E", marginBottom: 5 },
  inp: { width: "100%", padding: "10px 14px", border: "1px solid rgba(91,123,94,0.16)", borderRadius: 8, fontSize: 14, color: "#2C3E2D", background: "rgba(255,255,255,0.6)", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", transition: "border-color 0.2s" },
  aBtn: { flex: "1 1 auto", minWidth: 54, padding: "9px 10px", border: "1px solid rgba(91,123,94,0.16)", borderRadius: 8, background: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500, color: "#3D5A40", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" },
  aBtnOn: { background: "#5B7B5E", color: "#F7FAF5", borderColor: "#5B7B5E" },
  pay: { width: "100%", padding: "12px 24px", background: "#5B7B5E", color: "#F7FAF5", border: "none", borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 20, fontFamily: "inherit", letterSpacing: "0.02em", transition: "opacity 0.2s, background 0.25s" },
};
