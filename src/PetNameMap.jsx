import { useState, useEffect, useRef, useCallback } from "react";

const STATE_DATA = {
  AK: { name: "Purrrsia" }, AL: { name: "Meia" }, AR: { name: "Molly" },
  AZ: { name: "Blondee" }, CA: { name: "Peanut Butter" }, CO: { name: "Ronnie" },
  CT: { name: "Bella" }, DC: { name: "Beenchaling" }, DE: { name: "River" },
  FL: { name: "Max" }, GA: { name: "Carlitos" }, IA: { name: "Marceline" },
  ID: { name: "Pancho" }, IL: { name: "Athena" }, IN: { name: "Goldi" },
  KS: { name: "Koda" }, KY: { name: "Binx" }, LA: { name: "Teal" },
  MA: { name: "Fizzgig" }, MD: { name: "Lollipop" }, ME: { name: "Leo" },
  MI: { name: "Gidget" }, MN: { name: "Benji" }, MO: { name: "Smoke" },
  MS: { name: "Payton Lee" }, MT: { name: "Norman" }, NC: { name: "Daisy" },
  ND: { name: "Pharoah" }, NE: { name: "Knox" }, NH: { name: "Kitty Purrey" },
  NJ: { name: "Oreo" }, NM: { name: "Blue" }, NV: { name: "Zoey" },
  NY: { name: "Fred" }, OH: { name: "Mia" }, OK: { name: "Egypt" },
  OR: { name: "Cheka" }, PA: { name: "Pepper" }, SC: { name: "Simba" },
  SD: { name: "Peanut" }, TN: { name: "Polly" }, TX: { name: "Coco" },
  UT: { name: "Rob" }, VA: { name: "Maggie" }, VT: { name: "Cash" },
  WA: { name: "Mama" }, WI: { name: "Butterscotch" }, WV: { name: "Daisy" },
  WY: { name: "Grey" }, HI: { name: "Kai" }, RI: { name: "Biscuit" },
};

const PET_TYPE_DATA = {
  AK:{cat_pct:50,dog_pct:50,cats:1,dogs:1,total:2},
  AL:{cat_pct:10,dog_pct:90,cats:1,dogs:9,total:10},
  AR:{cat_pct:12,dog_pct:88,cats:1,dogs:7,total:8},
  AZ:{cat_pct:42,dog_pct:58,cats:5,dogs:7,total:12},
  CA:{cat_pct:38,dog_pct:62,cats:45,dogs:73,total:118},
  CO:{cat_pct:19,dog_pct:81,cats:3,dogs:13,total:16},
  CT:{cat_pct:25,dog_pct:75,cats:1,dogs:3,total:4},
  DC:{cat_pct:33,dog_pct:67,cats:1,dogs:2,total:3},
  DE:{cat_pct:0,dog_pct:100,cats:0,dogs:2,total:2},
  FL:{cat_pct:36,dog_pct:64,cats:12,dogs:21,total:33},
  GA:{cat_pct:35,dog_pct:65,cats:15,dogs:28,total:43},
  IA:{cat_pct:33,dog_pct:67,cats:1,dogs:2,total:3},
  ID:{cat_pct:0,dog_pct:100,cats:0,dogs:3,total:3},
  IL:{cat_pct:45,dog_pct:55,cats:17,dogs:21,total:38},
  IN:{cat_pct:28,dog_pct:72,cats:5,dogs:13,total:18},
  KS:{cat_pct:57,dog_pct:43,cats:4,dogs:3,total:7},
  KY:{cat_pct:24,dog_pct:76,cats:4,dogs:13,total:17},
  LA:{cat_pct:62,dog_pct:38,cats:8,dogs:5,total:13},
  MA:{cat_pct:71,dog_pct:29,cats:5,dogs:2,total:7},
  MD:{cat_pct:36,dog_pct:64,cats:4,dogs:7,total:11},
  ME:{cat_pct:100,dog_pct:0,cats:2,dogs:0,total:2},
  MI:{cat_pct:45,dog_pct:55,cats:10,dogs:12,total:22},
  MN:{cat_pct:55,dog_pct:45,cats:12,dogs:10,total:22},
  MO:{cat_pct:26,dog_pct:74,cats:14,dogs:39,total:53},
  MS:{cat_pct:33,dog_pct:67,cats:2,dogs:4,total:6},
  MT:{cat_pct:0,dog_pct:100,cats:0,dogs:2,total:2},
  NC:{cat_pct:24,dog_pct:76,cats:9,dogs:28,total:37},
  ND:{cat_pct:0,dog_pct:100,cats:0,dogs:1,total:1},
  NE:{cat_pct:29,dog_pct:71,cats:2,dogs:5,total:7},
  NH:{cat_pct:40,dog_pct:60,cats:2,dogs:3,total:5},
  NJ:{cat_pct:30,dog_pct:70,cats:3,dogs:7,total:10},
  NM:{cat_pct:0,dog_pct:100,cats:0,dogs:5,total:5},
  NV:{cat_pct:47,dog_pct:53,cats:7,dogs:8,total:15},
  NY:{cat_pct:23,dog_pct:77,cats:7,dogs:23,total:30},
  OH:{cat_pct:44,dog_pct:56,cats:14,dogs:18,total:32},
  OK:{cat_pct:24,dog_pct:76,cats:7,dogs:22,total:29},
  OR:{cat_pct:60,dog_pct:40,cats:27,dogs:18,total:45},
  PA:{cat_pct:56,dog_pct:44,cats:18,dogs:14,total:32},
  SC:{cat_pct:11,dog_pct:89,cats:1,dogs:8,total:9},
  SD:{cat_pct:0,dog_pct:100,cats:0,dogs:1,total:1},
  TN:{cat_pct:31,dog_pct:69,cats:10,dogs:22,total:32},
  TX:{cat_pct:10,dog_pct:90,cats:3,dogs:26,total:29},
  UT:{cat_pct:12,dog_pct:88,cats:1,dogs:7,total:8},
  VA:{cat_pct:40,dog_pct:60,cats:12,dogs:18,total:30},
  VT:{cat_pct:0,dog_pct:100,cats:0,dogs:3,total:3},
  WA:{cat_pct:23,dog_pct:77,cats:5,dogs:17,total:22},
  WI:{cat_pct:75,dog_pct:25,cats:9,dogs:3,total:12},
  WV:{cat_pct:14,dog_pct:86,cats:1,dogs:6,total:7},
  WY:{cat_pct:83,dog_pct:17,cats:5,dogs:1,total:6},
};

const TOP3 = [
  { name: "Bella", medal: "🥇" },
  { name: "Daisy", medal: "🥈" },
  { name: "Max", medal: "🥉" },
];

const FIPS_TO_ABB = {
  "01":"AL","02":"AK","04":"AZ","05":"AR","06":"CA","08":"CO","09":"CT",
  "10":"DE","11":"DC","12":"FL","13":"GA","15":"HI","16":"ID","17":"IL",
  "18":"IN","19":"IA","20":"KS","21":"KY","22":"LA","23":"ME","24":"MD",
  "25":"MA","26":"MI","27":"MN","28":"MS","29":"MO","30":"MT","31":"NE",
  "32":"NV","33":"NH","34":"NJ","35":"NM","36":"NY","37":"NC","38":"ND",
  "39":"OH","40":"OK","41":"OR","42":"PA","44":"RI","45":"SC","46":"SD",
  "47":"TN","48":"TX","49":"UT","50":"VT","51":"VA","53":"WA","54":"WV",
  "55":"WI","56":"WY",
};

const STATE_NAMES = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",
  CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"Washington D.C.",FL:"Florida",
  GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",
  KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",
  MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",
  MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",
  NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",
  OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",
  SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",
  VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",
};

const PALETTE = [
  "#4fc3f7","#ffb347","#9b6fd6","#f06292","#26c6da",
  "#aed581","#ff8a65","#ba68c8","#4db6ac","#ffd54f",
  "#81c784","#e57373","#64b5f6","#a1887f","#90a4ae",
  "#ce93d8","#80cbc4","#ffcc80","#ef9a9a","#80deea",
];
const uniqueNames = [...new Set(Object.values(STATE_DATA).map(d => d.name))];
const NAME_COLOR = {};
uniqueNames.forEach((name, i) => { NAME_COLOR[name] = PALETTE[i % PALETTE.length]; });

function getStateColor(abbr) {
  const data = STATE_DATA[abbr];
  return data ? (NAME_COLOR[data.name] || "#dce8f0") : "#dce8f0";
}

// Small states that need too-small labels suppressed
const SUPPRESS_LABEL = new Set(["DC","RI","DE","CT","NJ","MA","MD","VT","NH"]);

const PITCH_STATS = [
  { icon:"🏆", tag:"Record",      text:'Maine is the most cat-dominant state in Dwellsy data — 100% of pet listings feature cats, the highest rate in the US.' },
  { icon:"🐱", tag:"Outlier",     text:'Wyoming renters are 83% cat owners — the highest cat rate west of the Mississippi, more than double the national average of 36%.' },
  { icon:"🧇", tag:"Regional",    text:'Wisconsin leads the Midwest for cat ownership at 75% — nearly double the national average of 36%.' },
  { icon:"🌶️", tag:"Regional",   text:'New Mexico leads the Sun Belt for dogs at 100%, with Texas and Alabama close behind at 90% each — all well above the national average of 64%.' },
  { icon:"🌊", tag:"Regional",    text:'Wyoming leads the West for cats at 83%, followed by Oregon at 60% — both well above the national average of 36%.' },
  { icon:"📊", tag:"National",    text:'Nationally, dogs outnumber cats 64% to 36% among Dwellsy renters — but 9 states flip that ratio, with cats in the majority.' },
  { icon:"🔗", tag:"Shared name", text:'Daisy is the top pet name in both North Carolina and West Virginia — the only name shared by two states in the dataset.' },
  { icon:"🗺️", tag:"Outlier",    text:'Seven states — Delaware, Idaho, Montana, North Dakota, New Mexico, South Dakota and Vermont — report zero cat listings. All dogs.' },
  { icon:"🎯", tag:"Contrast",    text:'Louisiana (62% cats) and Texas (10% cats) share a border but sit at opposite extremes of the cat/dog spectrum.' },
  { icon:"🐾", tag:"Fun",         text:'"Peanut Butter" is the #1 pet name in California — and "Kitty Purrey" tops New Hampshire. Dwellsy renters get creative.' },
];

// Cat-dominant gradient: purple tones
function getCatColor(abbr) {
  const pt = PET_TYPE_DATA[abbr];
  if (!pt) return "#dce8f0";
  const pct = pt.cat_pct / 100;
  // interpolate white → deep purple based on cat %
  const r = Math.round(255 - pct * (255 - 107));
  const g = Math.round(255 - pct * (255 - 63));
  const b = Math.round(255 - pct * (255 - 177));
  return `rgb(${r},${g},${b})`;
}

// Dog-dominant gradient: amber/orange tones
function getDogColor(abbr) {
  const pt = PET_TYPE_DATA[abbr];
  if (!pt) return "#dce8f0";
  const pct = pt.dog_pct / 100;
  const r = Math.round(255 - pct * (255 - 230));
  const g = Math.round(255 - pct * (255 - 120));
  const b = Math.round(255 - pct * (255 - 20));
  return `rgb(${r},${g},${b})`;
}

export default function PetNameMap() {
  const [statePaths, setStatePaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [mapMode, setMapMode] = useState("names"); // "names" | "cats" | "dogs"
  const [shareOpen, setShareOpen] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [statCopied, setStatCopied] = useState(false);

  useEffect(() => {
    const loadScript = (src) => new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
      const s = document.createElement("script");
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });

    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js"),
    ])
      .then(() => fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"))
      .then(r => r.json())
      .then(us => {
        const { d3, topojson } = window;
        const projection = d3.geoAlbersUsa().scale(1000).translate([490, 310]);
        const pathGen = d3.geoPath().projection(projection);
        const features = topojson.feature(us, us.objects.states).features;

        const built = features.map(f => {
          const fips = String(f.id).padStart(2, "0");
          const abbr = FIPS_TO_ABB[fips];
          if (!abbr) return null;
          const d = pathGen(f);
          const centroid = pathGen.centroid(f);
          return { abbr, d, centroid };
        }).filter(Boolean).filter(s => s.d);

        setStatePaths(built);
        setLoading(false);
      })
      .catch(() => { setError("Could not load map data."); setLoading(false); });
  }, []);

  const onEnter  = useCallback((abbr, e) => setTooltip({ abbr, x: e.clientX, y: e.clientY }), []);
  const onMove   = useCallback((abbr, e) => setTooltip({ abbr, x: e.clientX, y: e.clientY }), []);
  const onLeave  = useCallback(() => setTooltip(null), []);
  const onClick  = useCallback((abbr) => {
    setSelected(p => p === abbr ? null : abbr);
    setShareOpen(false);
    setShareMsg("");
  }, []);

  const getColor = useCallback((abbr) => {
    if (mapMode === "cats") return getCatColor(abbr);
    if (mapMode === "dogs") return getDogColor(abbr);
    return getStateColor(abbr);
  }, [mapMode]);

  const getTooltipValue = useCallback((abbr) => {
    if (mapMode === "cats") {
      const pt = PET_TYPE_DATA[abbr];
      return pt ? `🐱 ${pt.cat_pct}% cats` : "";
    }
    if (mapMode === "dogs") {
      const pt = PET_TYPE_DATA[abbr];
      return pt ? `🐶 ${pt.dog_pct}% dogs` : "";
    }
    return STATE_DATA[abbr]?.name || "";
  }, [mapMode]);

  const copyText = useCallback((text) => {
    // Reliable cross-environment copy using textarea
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleSharePhrase = useCallback((quote) => {
    const ok = copyText(quote);
    setShareMsg(ok ? "✓ Phrase copied!" : "Select text above and copy manually");
    setShareOpen(false);
    setTimeout(() => setShareMsg(""), 2500);
  }, [copyText]);

  const handleShareLink = useCallback(() => {
    const url = "https://dwellsy.com/purrrmitted-living";
    const ok = copyText(url);
    setShareMsg(ok ? "✓ Link copied!" : "Link: dwellsy.com/purrrmitted-living");
    setShareOpen(false);
    setTimeout(() => setShareMsg(""), 2500);
  }, [copyText]);

  const handleShareEmbed = useCallback((quote) => {
    const embed = `<blockquote>"${quote}"<br>— <a href="https://dwellsy.com/purrrmitted-living">Dwellsy Purrrmitted Living</a></blockquote>`;
    const ok = copyText(embed);
    setShareMsg(ok ? "✓ Embed code copied!" : "Could not copy embed");
    setShareOpen(false);
    setTimeout(() => setShareMsg(""), 2500);
  }, [copyText]);

  const selData = selected ? STATE_DATA[selected] : null;

  const card = {
    background: "rgba(255,255,255,0.80)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderRadius: 16,
    boxShadow: "0 2px 20px rgba(76,195,247,0.11),0 1px 4px rgba(34,32,74,0.06)",
    border: "1px solid rgba(255,255,255,0.88)",
    padding: "18px 20px",
  };
  const cardLabel = {
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontWeight: 700, fontSize: 11.5, color: "#9b6fd6",
    textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 12,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#eef7fc 0%,#fff4e6 45%,#f3eeff 100%)",
      fontFamily: "'Inter','Plus Jakarta Sans',sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .pm-body { display: flex; flex: 1; padding: 16px 26px 22px; gap: 0; align-items: flex-start; }
        .pm-map   { flex: 0 0 65%; position: relative; }
        .pm-sidebar { flex: 0 0 35%; padding-left: 20px; display: flex; flex-direction: column; gap: 14px; }
        .pm-all-states { max-height: 340px; overflow-y: auto; padding-right: 4px; }
        @media (max-width: 900px) {
          .pm-body    { flex-direction: column; padding: 12px 16px 20px; }
          .pm-map     { flex: none; width: 100%; }
          .pm-sidebar { flex: none; width: 100%; padding-left: 0; margin-top: 16px; }
          .pm-all-states { max-height: 220px; }
        }
        @media (max-width: 600px) {
          .pm-body { padding: 10px 12px 18px; }
          .pm-header { padding: 14px 16px 12px !important; }
          .pm-header h1 { font-size: 16px !important; }
          .pm-header p  { font-size: 11px !important; }
          .pm-toggle-bar { gap: 6px !important; }
          .pm-toggle-btn { padding: 6px 12px !important; font-size: 12px !important; }
          .pm-all-states { max-height: 180px; }
        }
      `}</style>

      {/* HEADER */}
      <header className="pm-header" style={{
        padding: "22px 34px 14px", display: "flex", alignItems: "center", gap: 13,
        borderBottom: "1px solid rgba(76,195,247,0.16)",
      }}>
        <span style={{ fontSize: 26 }}>🐾</span>
        <div>
          <h1 style={{
            margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 800, fontSize: 20, color: "#22204a", letterSpacing: "-0.4px",
          }}>Most Popular Pet Names by State</h1>
          <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#7a7a9a" }}>
            Dwellsy pet-friendly listing data · Snapshot from our growing renter community
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#aaa8c8" }}>
            Last updated May 15, 2026
          </p>
        </div>
      </header>

      {/* BODY */}
      <div className="pm-body">

        {/* MAP AREA */}
        <div className="pm-map">

          {/* TOGGLE */}
          <div className="pm-toggle-bar" style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            {[
              { id:"names", label:"🐾 Pet Names" },
              { id:"cats",  label:"🐱 Most Cats" },
              { id:"dogs",  label:"🐶 Most Dogs" },
            ].map(({ id, label }) => {
              const active = mapMode === id;
              const activeColors = {
                names: { bg:"#9b6fd6", shadow:"rgba(155,111,214,0.3)" },
                cats:  { bg:"#9b6fd6", shadow:"rgba(155,111,214,0.3)" },
                dogs:  { bg:"#ffb347", shadow:"rgba(255,179,71,0.35)" },
              };
              return (
                <button
                  key={id}
                  className="pm-toggle-btn"
                  onClick={() => setMapMode(id)}
                  style={{
                    padding:"7px 16px", borderRadius:99, border:"none", cursor:"pointer",
                    fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:13,
                    transition:"all 0.18s",
                    background: active ? activeColors[id].bg : "rgba(255,255,255,0.75)",
                    color: active ? "#fff" : "#22204a",
                    boxShadow: active
                      ? `0 4px 14px ${activeColors[id].shadow}`
                      : "0 1px 4px rgba(34,32,74,0.08)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {label}
                </button>
              );
            })}
            {mapMode !== "names" && (
              <div style={{
                alignSelf:"center", marginLeft:4,
                fontSize:12, color:"#888", fontStyle:"italic",
              }}>
                {mapMode === "cats" ? "Darker = more cats" : "Darker = more dogs"}
              </div>
            )}
          </div>
          {loading && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:420, gap:14 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", border:"3px solid #e0e0f0", borderTopColor:"#9b6fd6", animation:"spin 0.8s linear infinite" }} />
              <span style={{ color:"#9b8fba", fontSize:14 }}>Loading accurate map…</span>
            </div>
          )}
          {error && <div style={{ padding:40, textAlign:"center", color:"#e57373", fontSize:14 }}>{error}</div>}

          {!loading && !error && (
            <>
              <div style={{ position:"relative" }}>
                <svg viewBox="0 0 960 620" style={{ width:"100%", height:"auto", display:"block", overflow:"visible" }}>
              {/* States */}
              {statePaths.map(({ abbr, d, centroid }) => {
                const isSel = selected === abbr;
                const cx = centroid[0], cy = centroid[1];
                const validCentroid = cx > 0 && cy > 0 && !isNaN(cx) && !isNaN(cy);
                return (
                  <g key={abbr}>
                    <path
                      d={d}
                      fill={getColor(abbr)}
                      stroke="#ffffff"
                      strokeWidth={isSel ? 2 : 0.75}
                      style={{
                        cursor: "pointer",
                        transition: "filter 0.12s, opacity 0.12s",
                        filter: isSel ? "brightness(1.12) drop-shadow(0 0 5px rgba(0,0,0,0.22))" : "brightness(1)",
                        opacity: selected && !isSel ? 0.62 : 1,
                      }}
                      onMouseEnter={e => onEnter(abbr, e)}
                      onMouseMove={e => onMove(abbr, e)}
                      onMouseLeave={onLeave}
                      onClick={() => onClick(abbr)}
                    />
                    {validCentroid && !SUPPRESS_LABEL.has(abbr) && (
                      <text
                        x={cx} y={cy + 4}
                        textAnchor="middle"
                        fontSize="9" fontWeight="700"
                        fontFamily="Inter,sans-serif"
                        fill="rgba(255,255,255,0.92)"
                        style={{ pointerEvents:"none", userSelect:"none" }}
                      >
                        {abbr}
                      </text>
                    )}
                  </g>
                );
              })}
                </svg>
              </div>

              {/* TOP 3 — sits below the map, bottom-left aligned */}
              <div style={{
                display:"inline-flex", flexDirection:"column",
                background:"rgba(255,255,255,0.45)",
                backdropFilter:"blur(10px)",
                WebkitBackdropFilter:"blur(10px)",
                borderRadius:12,
                border:"1px solid rgba(255,255,255,0.6)",
                padding:"10px 13px",
                boxShadow:"0 2px 12px rgba(34,32,74,0.08)",
                marginTop:10,
                maxWidth:"100%",
              }}>
                <div style={{
                  fontSize:11, fontWeight:700, color:"#9b6fd6",
                  textTransform:"uppercase", letterSpacing:"0.9px", marginBottom:9,
                }}>🏆 Top national names</div>
                {TOP3.map((item, i) => (
                  <div key={i} style={{
                    display:"flex", alignItems:"center", gap:9,
                    marginBottom: i < 2 ? 7 : 0,
                  }}>
                    <span style={{ fontSize:18 }}>{item.medal}</span>
                    <span style={{
                      fontFamily:"'Plus Jakarta Sans',sans-serif",
                      fontWeight:700, fontSize:15, color:"#22204a",
                    }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="pm-sidebar">

          {/* STATE DETAIL */}
          <div style={{ ...card, minHeight:130 }}>
            <div style={cardLabel}>📍 State Detail</div>
            {selData ? (() => {
              const pt = PET_TYPE_DATA[selected] || {};
              const dogPct = pt.dog_pct ?? 0;
              const catPct = pt.cat_pct ?? 0;
              const total  = pt.total ?? 0;
              return (
                <>
                  <div style={{
                    fontFamily:"'Plus Jakarta Sans',sans-serif",
                    fontWeight:700, fontSize:14, color:"#22204a", marginBottom:4,
                  }}>{STATE_NAMES[selected] || selected}</div>

                  <div style={{
                    fontFamily:"'Plus Jakarta Sans',sans-serif",
                    fontWeight:800, fontSize:28, lineHeight:1.15, marginBottom:10,
                    background:"linear-gradient(90deg,#9b6fd6,#4fc3f7)",
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                    backgroundClip:"text",
                  }}>{selData.name}</div>

                  {/* Journalist quote */}
                  {(() => {
                    const stateName = STATE_NAMES[selected] || selected;
                    const quote = `In ${stateName}, the most popular pet name among Dwellsy renters is ${selData.name}.`;
                    return (
                      <div style={{
                        background:"linear-gradient(135deg,#f3eeff,#eef7fc)",
                        border:"1px dashed rgba(155,111,214,0.35)",
                        borderRadius:10, padding:"10px 12px", marginBottom:14,
                        position:"relative",
                      }}>
                        <div style={{ fontSize:10, fontWeight:700, color:"#9b6fd6", textTransform:"uppercase", letterSpacing:"0.9px", marginBottom:5 }}>
                          ✍️ Ready to quote
                        </div>
                        <div style={{ fontSize:12.5, color:"#22204a", lineHeight:1.5, fontStyle:"italic", paddingRight:70 }}>
                          "{quote}"
                        </div>

                        {/* Share button + dropdown */}
                        <div style={{ position:"absolute", top:10, right:10 }}>
                          <button
                            onClick={() => setShareOpen(o => !o)}
                            style={{
                              background:"#9b6fd6", border:"none", borderRadius:8,
                              cursor:"pointer", padding:"5px 11px",
                              fontSize:11.5, fontWeight:700, color:"#fff",
                              boxShadow:"0 2px 8px rgba(155,111,214,0.35)",
                            }}
                          >
                            ↗ Share
                          </button>

                          {shareOpen && (
                            <div style={{
                              position:"absolute", right:0, top:"calc(100% + 6px)",
                              background:"#fff", borderRadius:12,
                              boxShadow:"0 8px 28px rgba(34,32,74,0.18)",
                              border:"1px solid rgba(155,111,214,0.15)",
                              overflow:"hidden", zIndex:999, minWidth:160,
                            }}>
                              {[
                                { label:"📋 Copy phrase",  action: () => handleSharePhrase(quote) },
                                { label:"🔗 Copy link",    action: handleShareLink },
                                { label:"</> Embed",       action: () => handleShareEmbed(quote) },
                              ].map(({ label, action }, idx) => (
                                <button
                                  key={idx}
                                  onClick={action}
                                  style={{
                                    display:"block", width:"100%",
                                    padding:"10px 14px", border:"none",
                                    borderBottom: idx < 2 ? "1px solid rgba(155,111,214,0.1)" : "none",
                                    background:"transparent", cursor:"pointer",
                                    textAlign:"left", fontSize:12.5, fontWeight:600,
                                    color:"#22204a", fontFamily:"'Plus Jakarta Sans',sans-serif",
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = "rgba(155,111,214,0.08)"}
                                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {shareMsg && (
                          <div style={{ marginTop:7, fontSize:11.5, color:"#9b6fd6", fontWeight:600 }}>
                            {shareMsg}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Cat / Dog bars — state vs national */}
                  {(() => {
                    const NAT_CAT = 36, NAT_DOG = 64;
                    const catDiff = catPct - NAT_CAT;
                    const dogDiff = dogPct - NAT_DOG;
                    const stateName2 = STATE_NAMES[selected] || selected;

                    // Generate the "bucks the trend" insight
                    let insight = null;
                    const absDiff = Math.abs(catDiff);
                    if (absDiff >= 25) {
                      const leader = catDiff > 0 ? "cats" : "dogs";
                      const leaderEmoji = catDiff > 0 ? "🐱" : "🐶";
                      insight = `${leaderEmoji} ${stateName2} strongly bucks the national trend — far more ${leader} than average.`;
                    } else if (absDiff >= 10) {
                      const leader = catDiff > 0 ? "cat-heavy" : "dog-heavy";
                      const leaderEmoji = catDiff > 0 ? "🐱" : "🐶";
                      insight = `${leaderEmoji} ${stateName2} leans ${leader} compared to the US average.`;
                    } else {
                      insight = `📊 ${stateName2} closely mirrors the national cat/dog split.`;
                    }

                    const Row = ({ label, catP, dogP, muted }) => (
                      <div style={{ marginBottom: muted ? 0 : 8 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:11, fontWeight: muted ? 500 : 700, color: muted ? "#aaa8c8" : "#22204a" }}>
                            {label}
                          </span>
                          <span style={{ fontSize:11, color:"#aaa8c8" }}>
                            <span style={{ color:"#9b6fd6", fontWeight:600 }}>🐱 {catP}%</span>
                            <span style={{ margin:"0 4px", color:"#ddd" }}>·</span>
                            <span style={{ color:"#ffb347", fontWeight:600 }}>🐶 {dogP}%</span>
                          </span>
                        </div>
                        <div style={{
                          display:"flex", height:8, borderRadius:99, overflow:"hidden",
                          background:"#f0eeff", opacity: muted ? 0.55 : 1,
                        }}>
                          <div style={{
                            width:`${catP}%`,
                            background: muted
                              ? "linear-gradient(90deg,#c9b8e8,#d8bfea)"
                              : "linear-gradient(90deg,#9b6fd6,#ba68c8)",
                            transition:"width 0.4s ease",
                          }} />
                          <div style={{
                            flex:1,
                            background: muted
                              ? "linear-gradient(90deg,#f5d9a8,#f5e0b8)"
                              : "linear-gradient(90deg,#ffb347,#ffd54f)",
                            transition:"width 0.4s ease",
                          }} />
                        </div>
                      </div>
                    );

                    return (
                      <div style={{ marginBottom:10 }}>
                        <Row label={stateName2} catP={catPct} dogP={dogPct} muted={false} />
                        <Row label="US average" catP={NAT_CAT} dogP={NAT_DOG} muted={true} />

                        {/* Diff badges */}
                        <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
                          {[
                            { label: `Cats ${catDiff >= 0 ? "+" : ""}${catDiff}pp vs US`, pos: catDiff >= 0, color:"#9b6fd6" },
                            { label: `Dogs ${dogDiff >= 0 ? "+" : ""}${dogDiff}pp vs US`, pos: dogDiff >= 0, color:"#ffb347" },
                          ].map(({ label, pos, color }) => (
                            <span key={label} style={{
                              fontSize:10.5, fontWeight:700, borderRadius:99,
                              padding:"3px 9px",
                              background: pos ? `${color}18` : "rgba(0,0,0,0.04)",
                              color: pos ? color : "#aaa",
                              border: `1px solid ${pos ? color + "40" : "#e0e0e0"}`,
                            }}>{label}</span>
                          ))}
                        </div>

                        {/* Insight sentence */}
                        <div style={{
                          marginTop:9, fontSize:11.5, color:"#22204a",
                          lineHeight:1.5, fontWeight:500,
                          padding:"7px 10px", borderRadius:8,
                          background:"rgba(34,32,74,0.04)",
                        }}>
                          {insight}
                        </div>

                        <div style={{ marginTop:7, fontSize:11, color:"#aaa8c8", textAlign:"center" }}>
                          Snapshot from our growing renter community
                        </div>
                      </div>
                    );
                  })()}
                </>
              );
            })() : (
              <div style={{
                textAlign:"center", padding:"18px 10px",
                color:"#aaa8c8", fontSize:13.5, fontWeight:500, lineHeight:1.7,
              }}>
                <div style={{ fontSize:26, marginBottom:7 }}>🗺️</div>
                <div>Click a state to explore</div>
                <div style={{ fontSize:11.5, marginTop:3, opacity:0.7 }}>See the #1 pet name for any state</div>
              </div>
            )}
          </div>

          {/* PITCH-READY STATS */}
          {(() => {
            const tagColors = {
              Record:        { bg:"#fff3cd", color:"#b8860b" },
              Regional:      { bg:"#e8f4fd", color:"#1a6fa3" },
              Outlier:       { bg:"#fde8f0", color:"#c0375e" },
              National:      { bg:"#eef7f0", color:"#2a7a47" },
              "Shared name": { bg:"#f3eeff", color:"#7c45c9" },
              Contrast:      { bg:"#fff0e8", color:"#c05f1a" },
              Fun:           { bg:"#f0fce8", color:"#4a8c1a" },
            };
            const stat = PITCH_STATS[activeIdx];
            const tc = tagColors[stat.tag] || { bg:"#f0f0f0", color:"#555" };

            const doCopyStat = () => {
              const ta = document.createElement("textarea");
              ta.value = stat.text;
              ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
              document.body.appendChild(ta); ta.focus(); ta.select();
              document.execCommand("copy"); document.body.removeChild(ta);
              setStatCopied(true);
              setTimeout(() => setStatCopied(false), 2000);
            };

            return (
              <div style={{ ...card, padding:"18px 20px" }}>
                <div style={cardLabel}>📣 What We're Seeing</div>
                <p style={{ margin:"0 0 12px", fontSize:11.5, color:"#aaa8c8", lineHeight:1.5 }}>
                  Observations drawn from recent renter and market data.
                </p>

                {/* Active stat card */}
                <div style={{
                  background:"linear-gradient(135deg,#f3eeff 0%,#eef7fc 100%)",
                  borderRadius:12, padding:"14px 15px", marginBottom:12,
                  minHeight:96, display:"flex", flexDirection:"column", gap:8,
                  border:"1px solid rgba(155,111,214,0.18)",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:17 }}>{stat.icon}</span>
                    <span style={{
                      fontSize:10, fontWeight:700, borderRadius:99, padding:"2px 9px",
                      background: tc.bg, color: tc.color,
                      textTransform:"uppercase", letterSpacing:"0.7px",
                    }}>{stat.tag}</span>
                  </div>
                  <p style={{ margin:0, fontSize:12.5, color:"#22204a", lineHeight:1.6, fontWeight:500 }}>
                    {stat.text}
                  </p>
                  <button onClick={doCopyStat} style={{
                    alignSelf:"flex-start", padding:"4px 11px", borderRadius:7,
                    border:"none", cursor:"pointer", fontSize:11, fontWeight:700,
                    background: statCopied ? "#9b6fd6" : "rgba(155,111,214,0.12)",
                    color: statCopied ? "#fff" : "#9b6fd6", transition:"all 0.2s",
                  }}>
                    {statCopied ? "✓ Copied" : "📋 Copy"}
                  </button>
                </div>

                {/* Dot nav */}
                <div style={{ display:"flex", gap:5, justifyContent:"center", marginBottom:10, flexWrap:"wrap" }}>
                  {PITCH_STATS.map((_, i) => (
                    <button key={i} onClick={() => { setActiveIdx(i); setStatCopied(false); }} style={{
                      width: i === activeIdx ? 20 : 8, height:8, borderRadius:99,
                      border:"none", cursor:"pointer", padding:0,
                      background: i === activeIdx ? "#9b6fd6" : "rgba(155,111,214,0.25)",
                      transition:"all 0.25s",
                    }} />
                  ))}
                </div>

                {/* Prev / Next */}
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <button onClick={() => { setActiveIdx(i => (i - 1 + PITCH_STATS.length) % PITCH_STATS.length); setStatCopied(false); }} style={{
                    padding:"5px 13px", borderRadius:8,
                    border:"1px solid rgba(155,111,214,0.25)",
                    background:"transparent", cursor:"pointer",
                    fontSize:12, color:"#9b6fd6", fontWeight:600,
                  }}>← Prev</button>
                  <span style={{ fontSize:11, color:"#aaa8c8", alignSelf:"center" }}>
                    {activeIdx + 1} / {PITCH_STATS.length}
                  </span>
                  <button onClick={() => { setActiveIdx(i => (i + 1) % PITCH_STATS.length); setStatCopied(false); }} style={{
                    padding:"5px 13px", borderRadius:8,
                    border:"1px solid rgba(155,111,214,0.25)",
                    background:"transparent", cursor:"pointer",
                    fontSize:12, color:"#9b6fd6", fontWeight:600,
                  }}>Next →</button>
                </div>
              </div>
            );
          })()}

          {/* ALL STATES DIRECTORY */}
          <div style={{ ...card, padding:"18px 20px" }}>
            <div style={cardLabel}>🗂️ All States</div>
            <div className="pm-all-states">
              {Object.keys(STATE_DATA)
                .filter(abbr => STATE_NAMES[abbr])
                .sort((a, b) => STATE_NAMES[a].localeCompare(STATE_NAMES[b]))
                .map((abbr, i, arr) => {
                  const isSel = selected === abbr;
                  const color = getStateColor(abbr);
                  return (
                    <div
                      key={abbr}
                      onClick={() => onClick(abbr)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "7px 8px",
                        borderRadius: 9,
                        marginBottom: i < arr.length - 1 ? 2 : 0,
                        cursor: "pointer",
                        background: isSel ? "rgba(155,111,214,0.10)" : "transparent",
                        transition: "background 0.13s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = isSel ? "rgba(155,111,214,0.13)" : "rgba(0,0,0,0.04)"}
                      onMouseLeave={e => e.currentTarget.style.background = isSel ? "rgba(155,111,214,0.10)" : "transparent"}
                    >
                      <div style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: color, flexShrink: 0,
                        boxShadow: `0 0 0 2px ${color}33`,
                      }} />
                      <span style={{
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontWeight: isSel ? 700 : 500,
                        fontSize: 12.5, color: "#22204a",
                        flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {STATE_NAMES[abbr]}
                      </span>
                      <span style={{
                        fontSize: 12, color: isSel ? "#9b6fd6" : "#888",
                        fontWeight: isSel ? 600 : 400,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        maxWidth: 90, textAlign: "right",
                      }}>
                        {STATE_DATA[abbr].name}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>
      </div>

      {/* TOOLTIP */}
      {tooltip && (STATE_DATA[tooltip.abbr] || PET_TYPE_DATA[tooltip.abbr]) && (
        <div style={{
          position:"fixed", left:tooltip.x + 14, top:tooltip.y - 40,
          background:"rgba(34,32,74,0.93)", color:"#fff",
          borderRadius:10, padding:"7px 13px", fontSize:13, fontWeight:500,
          pointerEvents:"none", zIndex:9999,
          boxShadow:"0 4px 18px rgba(34,32,74,0.2)", whiteSpace:"nowrap",
        }}>
          <span style={{ opacity:0.65, marginRight:6 }}>{STATE_NAMES[tooltip.abbr] || tooltip.abbr}</span>
          <span style={{ color: mapMode === "names" ? getStateColor(tooltip.abbr) : mapMode === "cats" ? "#ce93d8" : "#ffb347", fontWeight:700 }}>
            {getTooltipValue(tooltip.abbr)}
          </span>
        </div>
      )}
    </div>
  );
}
