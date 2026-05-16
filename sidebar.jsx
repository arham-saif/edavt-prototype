// Sidebar — left nav + role context

function Sidebar({ view, setView, role, setRole, roles, alertCount }) {
  const [roleOpen, setRoleOpen] = React.useState(false);

  const items = [
    { id: "overview",    label: "Overview",            icon: "home"    },
    { id: "atrisk",      label: "At-risk students",    icon: "alert",   badge: alertCount },
    { id: "predictions", label: "Predictions",         icon: "trend"   },
    { id: "segments",    label: "Student segments",    icon: "cluster" },
  ];
  const dataItems = [
    { id: "sources",     label: "Data sources",        icon: "db"      },
    { id: "audit",       label: "Audit log",           icon: "log"     },
    { id: "compliance",  label: "Privacy & compliance", icon: "shield"  },
  ];

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo">e</div>
        <div>
          <div className="sb-name">EDAVT</div>
          <div className="sb-meta">v3.0 · Westbrook USD</div>
        </div>
      </div>

      <div className="sb-role" onClick={() => setRoleOpen(o => !o)}>
        <div className="sb-role-avatar">{role.initials}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="sb-role-name">{role.name}</div>
          <div className="sb-role-title">{role.title}</div>
        </div>
        <span className="sb-role-chev"><Icon.chevDown /></span>
      </div>

      {roleOpen && (
        <div style={{
          margin: "-12px 12px 12px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r)",
          boxShadow: "var(--shadow)",
          padding: 4,
          position: "relative",
          zIndex: 10,
        }}>
          <div style={{ padding: "6px 10px", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Switch role · demo
          </div>
          {roles.map(r => (
            <div key={r.id}
              onClick={() => { setRole(r); setRoleOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "7px 10px", borderRadius: 4, cursor: "pointer",
                background: r.id === role.id ? "var(--hover)" : "transparent",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover)"}
              onMouseLeave={(e) => e.currentTarget.style.background = r.id === role.id ? "var(--hover)" : "transparent"}
            >
              <div className="sb-role-avatar" style={{ width: 24, height: 24, fontSize: 10 }}>{r.initials}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{r.name}</div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>{r.title}</div>
              </div>
              {r.id === role.id && <Icon.check />}
            </div>
          ))}
        </div>
      )}

      <div className="sb-section">Workspace</div>
      <div className="sb-nav">
        {items.map(it => (
          <button key={it.id} className={"sb-item" + (view === it.id ? " active" : "")} onClick={() => setView(it.id)}>
            {Icon[it.icon]({})}
            <span>{it.label}</span>
            {it.badge ? <span className="sb-badge">{it.badge}</span> : null}
          </button>
        ))}
      </div>

      <div className="sb-section">Data & governance</div>
      <div className="sb-nav">
        {dataItems.map(it => (
          <button key={it.id} className={"sb-item" + (view === it.id ? " active" : "")} onClick={() => setView(it.id)}>
            {Icon[it.icon]({})}
            <span>{it.label}</span>
          </button>
        ))}
      </div>

      <div className="sb-footer">
        <div className="sb-compliance">
          <div className="sb-compliance-row">
            <span className="sb-pill"><Icon.check /> FERPA</span>
            <span className="sb-pill cool"><Icon.lock /> AES-256</span>
          </div>
          <div className="sb-compliance-row">
            <span className="sb-pill warn">SOC 2 planned</span>
            <span className="sb-pill">SOPIPA design</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 10.5, color: "var(--muted)", lineHeight: 1.4 }}>
            <span className="live-dot"></span>
            Prototype controls · simulated region <span className="mono">us-west-2</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
