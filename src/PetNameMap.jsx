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

// States where every pet had a unique name (no duplicates)
const UNIQUE_NAME_STATES = new Set([
  'AK','AL','AZ','CO','CT','DC','DE','GA','IA','ID','IL','IN','KS','KY','LA',
  'MA','MD','ME','MN','MS','MT','ND','NE','NH','NJ','NM','NV','OH','OR','PA',
  'SC','SD','UT','VT','WA','WI','WY'
]);

// Small states that need too-small labels suppressed
const SUPPRESS_LABEL = new Set(["DC","RI","DE","CT","NJ","MA","MD","VT","NH"]);


export default function PetNameMap() {
  const [statePaths, setStatePaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

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
    setShareOpen(null);
    setShareMsg("");
  }, []);

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
    setShareOpen(null);
    setTimeout(() => setShareMsg(""), 2500);
  }, [copyText]);

  const handleShareLink = useCallback(() => {
    const url = "https://pet-name-map.vercel.app/";
    const ok = copyText(url);
    setShareMsg(ok ? "✓ Link copied!" : "Link: pet-name-map.vercel.app");
    setShareOpen(null);
    setTimeout(() => setShareMsg(""), 2500);
  }, [copyText]);

  const handleShareEmbed = useCallback((quote) => {
    const embed = `<blockquote>"${quote}"<br>— <a href="https://pet-name-map.vercel.app/">Dwellsy Pet-Friendly Rentals</a></blockquote>`;
    const ok = copyText(embed);
    setShareMsg(ok ? "✓ Embed code copied!" : "Could not copy embed");
    setShareOpen(null);
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
        .pm-sidebar { flex: 0 0 35%; padding-left: 20px; display: flex; flex-direction: column; gap: 14px; isolation: isolate; }
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
        <div style={{ flex: 1 }}>
          <h1 style={{
            margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 800, fontSize: 20, color: "#22204a", letterSpacing: "-0.4px",
          }}>Most Popular Pet Names by State</h1>
          <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#7a7a9a" }}>
            Dwellsy pet-friendly listing data · Snapshot from our growing renter community
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#aaa8c8" }}>
            Last updated May 20, 2026
          </p>
        </div>
        <a
          href="https://dwellsy.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "10px 18px", borderRadius: 99,
            background: "linear-gradient(135deg,#9b6fd6,#4fc3f7)",
            color: "#fff", textDecoration: "none",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 700, fontSize: 13,
            boxShadow: "0 4px 14px rgba(155,111,214,0.35)",
            whiteSpace: "nowrap",
            transition: "opacity 0.18s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          🏠 Find pet-friendly rentals
        </a>
      </header>

      {/* BODY */}
      <div className="pm-body">

        {/* MAP AREA */}
        <div className="pm-map">

          {/* TOGGLE */}
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
                      fill={getStateColor(abbr)}
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
            </>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="pm-sidebar">

          {/* TOP 3 */}
          <div style={card}>
            <div style={cardLabel}>🏆 Top National Names</div>
            {[
              "linear-gradient(120deg,#fff8e1,#fff3cd)",
              "linear-gradient(120deg,#f5f5f5,#e8e8e8)",
              "linear-gradient(120deg,#fbe9e7,#ffe0b2)",
            ].map((bg, i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:11,
                padding:"10px 13px", borderRadius:12,
                marginBottom: i < 2 ? 9 : 0, background: bg,
              }}>
                <span style={{ fontSize:20 }}>{TOP3[i].medal}</span>
                <span style={{
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  fontWeight:700, fontSize:16, color:"#22204a", flex:1,
                }}>{TOP3[i].name}</span>
              </div>
            ))}
          </div>

          {/* STATE DETAIL */}
          <div style={{ ...card, minHeight:130, overflow:"visible", position:"relative", zIndex:100 }}>
            <div style={cardLabel}>📍 State Detail</div>
            {selData ? (() => {
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

                  {UNIQUE_NAME_STATES.has(selected) && (
                    <div style={{
                      display:"flex", alignItems:"flex-start", gap:7,
                      background:"rgba(255,179,71,0.1)",
                      border:"1px solid rgba(255,179,71,0.3)",
                      borderRadius:9, padding:"8px 11px", marginBottom:12,
                    }}>
                      <span style={{ fontSize:14, flexShrink:0 }}>✨</span>
                      <span style={{ fontSize:12, color:"#22204a", lineHeight:1.5 }}>
                        Every pet in this state had a unique name. This one was our favorite.
                      </span>
                    </div>
                  )}

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
                        <div style={{ position:"absolute", top:10, right:10, zIndex:1000 }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareOpen(o => !o);
                            }}
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
                              boxShadow:"0 8px 28px rgba(34,32,74,0.22)",
                              border:"1px solid rgba(155,111,214,0.15)",
                              overflow:"hidden", zIndex:1000, minWidth:160,
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

          {/* ALL STATES DIRECTORY */}
          <div style={{ ...card, padding:"18px 20px", position:"relative", zIndex:1 }}>
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
      {tooltip && STATE_DATA[tooltip.abbr] && (
        <div style={{
          position:"fixed", left:tooltip.x + 14, top:tooltip.y - 40,
          background:"rgba(34,32,74,0.93)", color:"#fff",
          borderRadius:10, padding:"7px 13px", fontSize:13, fontWeight:500,
          pointerEvents:"none", zIndex:9999,
          boxShadow:"0 4px 18px rgba(34,32,74,0.2)", whiteSpace:"nowrap",
        }}>
          <span style={{ opacity:0.65, marginRight:6 }}>{STATE_NAMES[tooltip.abbr] || tooltip.abbr}</span>
          <span style={{ color:getStateColor(tooltip.abbr), fontWeight:700 }}>
            {STATE_DATA[tooltip.abbr]?.name || ""}
          </span>
        </div>
      )}
    </div>
  );
}
