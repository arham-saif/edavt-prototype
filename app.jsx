// EDAVT — main app
const { useState } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#C8553D",
  "density": "comfortable",
  "displayFont": "Instrument Serif",
  "showPrivacyStrip": true,
  "fitMode": "width"
}/*EDITMODE-END*/;

function App() {
  const params = new URLSearchParams(window.location.search);
  const validViews = ["overview", "atrisk", "predictions", "segments", "sources", "audit", "compliance"];
  const initialView = validViews.includes(params.get("view")) ? params.get("view") : "overview";
  const initialRole = window.EDAVT.ROLES.find((r) => r.id === params.get("role")) || window.EDAVT.ROLES[0];
  const [view, setView] = useState(initialView);
  const [role, setRole] = useState(initialRole);
  const [tweaks, setTweak] = window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}];

  // Scale stage to fit viewport (or scale-to-width with body scroll)
  const stageRef = React.useRef(null);
  React.useEffect(() => {
    const inner = stageRef.current;
    if (!inner) return;
    if (tweaks.fitMode === "width") {
      // Width-fit — scale via `zoom` so layout flows naturally and body scrolls vertically
      const fitW = () => {
        const s = Math.min(1, window.innerWidth / 1440);
        inner.style.zoom = String(s);
        inner.style.transform = "none";
        inner.style.position = "relative";
        inner.style.top = "0";
        inner.style.left = "0";
        inner.style.height = "auto";
        inner.style.minHeight = "900px";
      };
      fitW();
      document.body.style.overflow = "auto";
      document.body.style.background = "#0E0D0A";
      window.addEventListener("resize", fitW);
      return () => {
        window.removeEventListener("resize", fitW);
        inner.style.zoom = "";
      };
    }
    const fit = () => {
      const sx = window.innerWidth / 1440;
      const sy = window.innerHeight / 900;
      const s = Math.min(sx, sy, 1);
      inner.style.transform = `translate(-${720 * s}px, -${450 * s}px) scale(${s})`;
      inner.style.position = "absolute";
      inner.style.top = "50%";
      inner.style.left = "50%";
      inner.style.height = "900px";
      inner.style.minHeight = "";
      inner.style.zoom = "";
    };
    fit();
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [tweaks.fitMode]);

  // Apply tweaks to CSS variables
  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent", tweaks.accent);
    document.documentElement.style.setProperty("--font-display", `"${tweaks.displayFont}", "Times New Roman", serif`);
    if (tweaks.density === "compact") {
      document.documentElement.style.setProperty("--row-pad", "6px 10px");
    }
    // adjust accent-soft to blend
    const c = tweaks.accent;
    document.documentElement.style.setProperty("--accent-soft", c + "1A");
  }, [tweaks]);

  const viewMap = {
    overview:    OverviewView,
    atrisk:      AtRiskView,
    predictions: PredictionsView,
    segments:    SegmentsView,
    sources:     SourcesView,
    audit:       AuditView,
    compliance:  ComplianceView,
  };
  const ViewComponent = viewMap[view] || OverviewView;

  const crumbMap = {
    overview:    ["Workspace", "Overview"],
    atrisk:      ["Workspace", "At-risk students"],
    predictions: ["Workspace", "Predictions"],
    segments:    ["Workspace", "Student segments"],
    sources:     ["Data & governance", "Data sources"],
    audit:       ["Data & governance", "Audit log"],
    compliance:  ["Data & governance", "Privacy & compliance"],
  };
  const crumbs = crumbMap[view];

  const D = window.EDAVT;
  const alertCount = D.STUDENTS.filter(s => s.status === "new" || s.status === "intervention").length;

  return (
    <div className={"stage" + (tweaks.fitMode === "width" ? " fit-width" : "")}>
    <div className="stage-inner" ref={stageRef}>
    <div className="app">
      <Sidebar
        view={view} setView={setView}
        role={role} setRole={setRole} roles={D.ROLES}
        alertCount={alertCount}
      />
      <main className="main">
        <div className="topbar">
          <div className="crumbs">
            <span>{crumbs[0]}</span>
            <span className="sep">/</span>
            <strong>{crumbs[1]}</strong>
          </div>
          <div className="topbar-actions">
            <div className="search">
              <Icon.search />
              <input placeholder="Search students, schools, models…" />
              <kbd>⌘K</kbd>
            </div>
            <button className="icon-btn" title="Notifications">
              <Icon.bell />
              <span className="dot"></span>
            </button>
            <button className="icon-btn" title="Refresh"><Icon.refresh /></button>
          </div>
        </div>
        <div className="content">
          <ViewComponent role={role} tweaks={tweaks} />
        </div>
      </main>
    </div>
    </div>
    <button
      className="tweaks-fab"
      title="Open tweaks panel"
      onClick={() => window.postMessage({ type: '__activate_edit_mode' }, '*')}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
        <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
        <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/>
        <line x1="17" y1="16" x2="23" y2="16"/>
      </svg>
      Tweaks
    </button>
    {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection title="Look & feel">
            <window.TweakRadio
              label="View mode"
              value={tweaks.fitMode}
              onChange={(v) => setTweak("fitMode", v)}
              options={[
                { value: "fit",   label: "Fit screen" },
                { value: "width", label: "Fit-width" },
              ]}
            />
            <window.TweakColor
              label="Accent color"
              value={tweaks.accent}
              onChange={(v) => setTweak("accent", v)}
              options={["#C8553D", "#1B3A5F", "#4A7C59", "#7C6191", "#DEA84B"]}
            />
            <window.TweakRadio
              label="Density"
              value={tweaks.density}
              onChange={(v) => setTweak("density", v)}
              options={[
                { value: "comfortable", label: "Comfortable" },
                { value: "compact",     label: "Compact" },
              ]}
            />
            <window.TweakSelect
              label="Display typeface"
              value={tweaks.displayFont}
              onChange={(v) => setTweak("displayFont", v)}
              options={[
                { value: "Instrument Serif", label: "Instrument Serif" },
                { value: "Geist",            label: "Geist (all sans)" },
                { value: "Geist Mono",       label: "Geist Mono (technical)" },
              ]}
            />
          </window.TweakSection>
          <window.TweakSection title="Privacy">
            <window.TweakToggle
              label="Show privacy banner"
              value={tweaks.showPrivacyStrip}
              onChange={(v) => setTweak("showPrivacyStrip", v)}
            />
          </window.TweakSection>
          <window.TweakSection title="Demo">
            <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>
              All "PII" is synthetic. Switch roles in the sidebar to see how the
              RBAC scope, FERPA banner, and dashboard composition change.
            </div>
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
