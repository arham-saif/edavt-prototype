// Audit log view

function AuditView() {
  const D = window.EDAVT;

  const actionLabel = {
    view_student:   { color: "var(--info)", icon: "eye", label: "Viewed" },
    export_report:  { color: "var(--accent)", icon: "download", label: "Exported" },
    view_dashboard: { color: "var(--info)", icon: "eye", label: "Viewed" },
    case_create:    { color: "var(--success)", icon: "plus", label: "Created case" },
    model_retrain:  { color: "var(--c5)", icon: "refresh", label: "Model" },
    anomaly_detect: { color: "var(--critical)", icon: "warning", label: "Anomaly" },
    consent_update: { color: "var(--warning)", icon: "shield", label: "Consent" },
    query_cohort:   { color: "var(--info)", icon: "search", label: "Queried" },
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Audit <span className="accent">log</span></h1>
          <p className="page-sub">
            Tamper-evident record of every data access, export, model run, and consent change ·
            retained per institutional policy (7 yr · cold-archive after 2 yr).
          </p>
        </div>
        <div className="page-actions">
          <button className="btn ghost"><Icon.filter /> Filters</button>
          <button className="btn"><Icon.download /> Export log</button>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 16 }}>
        <Stat label="Events today" value="14,288" delta="+6.2%" deltaDir="up" spark={[1,2,1,3,2,4,3,5]} />
        <Stat label="Anomalous events" value="1" delta="under review" />
        <Stat label="Active users · 24h" value="412" delta="+18" deltaDir="up" />
        <Stat label="Log integrity" value="100" unit="%" delta="hash chain intact" />
      </div>

      <div className="grid cols-12">
        <div className="col-span-8 card">
          <div className="card-head">
            <h3>Recent events</h3>
            <div className="row">
              <span className="caption"><span className="live-dot"></span>Streaming</span>
              <button className="btn ghost" style={{ height: 26 }}><Icon.refresh /></button>
            </div>
          </div>
          <div className="card-body tight" style={{ maxHeight: 480, overflowY: "auto" }}>
            {D.AUDIT.map((a, i) => {
              const meta = actionLabel[a.action] || { color: "var(--muted)", label: a.action };
              return (
                <div key={i} className="log-row">
                  <span className="ts">{a.ts}</span>
                  <div className="avatar" style={{ width: 24, height: 24, fontSize: 10, background: a.user === "—" ? "var(--bg-2)" : "var(--ink)", color: a.user === "—" ? "var(--muted)" : "var(--bg)" }}>{a.user}</div>
                  <div className="desc">
                    <strong>{meta.label}</strong> · {a.subject} <span style={{ color: "var(--muted)" }}>· {a.scope}</span>
                  </div>
                  <span className="ip">{a.ip}</span>
                  {a.result === "ok"
                    ? <span className="badge ok"><Icon.check /></span>
                    : <span className="badge warn">review</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-4">
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-head">
              <h3>Event types · today</h3>
            </div>
            <div className="card-body">
              <HBarList
                items={[
                  { label: "view_student",   value: 9214, display: "9,214", color: "var(--info)" },
                  { label: "view_dashboard", value: 2841, display: "2,841", color: "var(--primary)" },
                  { label: "export_report",  value:  892, display: "892",   color: "var(--accent)" },
                  { label: "case_create",    value:  214, display: "214",   color: "var(--success)" },
                  { label: "query_cohort",   value:  142, display: "142",   color: "var(--c5)" },
                  { label: "consent_update", value:   34, display: "34",    color: "var(--warning)" },
                  { label: "anomaly_detect", value:    1, display: "1",     color: "var(--critical)" },
                ]}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Anomaly · under review</h3>
              <span className="badge crit"><Icon.warning /> Flagged</span>
            </div>
            <div className="card-body">
              <div style={{ fontSize: 13, fontWeight: 500 }}>Unusual export volume</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                User · ML · 14:11:32 UTC · 10.4.12.7
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5 }}>
                Auto-detected: 47 student record exports in 4 minutes (3.2σ above the user's
                weekly baseline). Account temporarily soft-locked pending privacy-officer review.
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                <button className="btn primary">Approve & release</button>
                <button className="btn">Open investigation</button>
              </div>
            </div>
          </div>
        </div>

        {/* Hash-chain integrity preview */}
        <div className="col-span-12 card">
          <div className="card-head">
            <h3>Log integrity · hash chain</h3>
            <span className="caption">tamper-evident · verified every 5 min</span>
          </div>
          <div className="card-body" style={{ overflowX: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap", minWidth: 800 }}>
              {[
                "a3f2…91e0", "8c44…ab2d", "5e91…77f1", "23d0…bb47", "f1a2…9c08", "0e4b…12fa", "c7a9…558e", "b290…01d2",
              ].map((hash, i) => (
                <React.Fragment key={i}>
                  <div style={{
                    background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
                    padding: "8px 10px", minWidth: 100, textAlign: "center"
                  }}>
                    <div className="mono" style={{ fontSize: 11, color: "var(--ink)" }}>{hash}</div>
                    <div style={{ fontSize: 9.5, color: "var(--muted)", marginTop: 2, fontFamily: "var(--font-mono)" }}>block #{4982 + i}</div>
                  </div>
                  {i < 7 && <span style={{ color: "var(--border-strong)" }}>—</span>}
                </React.Fragment>
              ))}
              <span className="badge ok" style={{ marginLeft: 8 }}><Icon.check /> Chain intact</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.AuditView = AuditView;
