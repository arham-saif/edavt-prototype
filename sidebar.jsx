// Sidebar — left nav + role context

function Sidebar({ view, setView, role, setRole, roles, alertCount }) {
  const [roleOpen, setRoleOpen] = React.useState(false);
  const roleBtnRef = React.useRef(null);

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

  // close on Escape
  React.useEffect(() => {
    if (!roleOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setRoleOpen(false);
        roleBtnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [roleOpen]);

  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="sb-brand">
        <div className="sb-logo" aria-hidden="true">e</div>
        <div>
          <div className="sb-name">EDAVT</div>
          <div className="sb-meta">v3.0 · Westbrook USD</div>
        </div>
      </div>

      <button
        ref={roleBtnRef}
        className="sb-role"
        onClick={() => setRoleOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={roleOpen}
        aria-label={`Active role: ${role.name}, ${role.title}. Click to switch role.`}
      >
        <div className="sb-role-avatar" aria-hidden="true">{role.initials}</div>
        <div style={{ minWidth: 0, flex: 1, textAlign: "left" }}>
          <div className="sb-role-name">{role.name}</div>
          <div className="sb-role-title">{role.title}</div>
        </div>
        <span className="sb-role-chev" aria-hidden="true"><Icon.chevDown /></span>
      </button>

      {roleOpen && (
        <ul role="listbox" aria-label="Switch role" style={{
          margin: "-12px 12px 12px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r)",
          boxShadow: "var(--shadow)",
          padding: 4,
          position: "relative",
          zIndex: 10,
          listStyle: "none",
        }}>
          <li style={{ padding: "6px 10px", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }} aria-hidden="true">
            Switch role · demo
          </li>
          {roles.map(r => (
            <li key={r.id} role="option" aria-selected={r.id === role.id}>
              <button
                onClick={() => { setRole(r); setRoleOpen(false); roleBtnRef.current?.focus(); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "7px 10px", borderRadius: 4, cursor: "pointer",
                  background: r.id === role.id ? "var(--hover)" : "transparent",
                  border: "none", width: "100%", textAlign: "left",
                  font: "inherit", color: "inherit",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover)"}
                onMouseLeave={(e) => e.currentTarget.style.background = r.id === role.id ? "var(--hover)" : "transparent"}
              >
                <div className="sb-role-avatar" style={{ width: 24, height: 24, fontSize: 10 }} aria-hidden="true">{r.initials}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>{r.title}</div>
                </div>
                {r.id === role.id && <Icon.check aria-hidden="true" focusable="false" />}
              </button>
            </li>
          ))}
        </ul>
      )}

      <nav aria-label="Workspace">
        <div className="sb-section" id="sb-workspace-label">Workspace</div>
        <div className="sb-nav" role="list">
          {items.map(it => (
            <button
              key={it.id}
              className={"sb-item" + (view === it.id ? " active" : "")}
              onClick={() => setView(it.id)}
              aria-current={view === it.id ? "page" : undefined}
            >
              {Icon[it.icon]({ "aria-hidden": "true", focusable: "false" })}
              <span>{it.label}</span>
              {it.badge ? (
                <span className="sb-badge" aria-label={`${it.badge} alerts`}>{it.badge}</span>
              ) : null}
            </button>
          ))}
        </div>
      </nav>

      <nav aria-label="Data and governance">
        <div className="sb-section">Data & governance</div>
        <div className="sb-nav" role="list">
          {dataItems.map(it => (
            <button
              key={it.id}
              className={"sb-item" + (view === it.id ? " active" : "")}
              onClick={() => setView(it.id)}
              aria-current={view === it.id ? "page" : undefined}
            >
              {Icon[it.icon]({ "aria-hidden": "true", focusable: "false" })}
              <span>{it.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="sb-footer">
        <div className="sb-compliance" role="group" aria-label="Compliance and system status">
          <div className="sb-compliance-row">
            <span className="sb-pill"><Icon.check aria-hidden="true" focusable="false" /> FERPA</span>
            <span className="sb-pill cool"><Icon.lock aria-hidden="true" focusable="false" /> AES-256</span>
          </div>
          <div className="sb-compliance-row">
            <span className="sb-pill warn">SOC 2 planned</span>
            <span className="sb-pill">SOPIPA design</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 10.5, color: "var(--muted)", lineHeight: 1.4 }} role="status">
            <span className="live-dot" aria-hidden="true"></span>
            Prototype controls · simulated region <span className="mono">us-west-2</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
