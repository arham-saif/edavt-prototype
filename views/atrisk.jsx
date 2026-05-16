// At-Risk Students view — list + ML-driven SHAP explanation panel

function AtRiskView({ role }) {
  const D = window.EDAVT;
  const [selected, setSelected] = React.useState(D.STUDENTS[0]);
  const [filter, setFilter] = React.useState("all");

  const filtered = React.useMemo(() => {
    if (filter === "all") return D.STUDENTS;
    return D.STUDENTS.filter(s => s.status === filter);
  }, [filter]);

  const riskColor = (r) => r > 0.8 ? "var(--critical)" : r > 0.65 ? "var(--warning)" : "var(--ink-2)";

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">At-risk <span className="accent">students</span></h1>
          <p className="page-sub">
            Powered by <span className="mono">at_risk_v3.6</span> · XGBoost ensemble + LSTM trajectory ·
            calibrated probability of Tier-2 outcome within 8 weeks.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn ghost"><Icon.filter /> Filters</button>
          <button className="btn"><Icon.download /> Export caseload</button>
          <button className="btn primary"><Icon.plus /> Bulk intervention</button>
        </div>
      </div>

      <div className="privacy-strip" style={{ marginBottom: 20, background: "var(--warning-soft)", borderColor: "#E8D2A6", color: "var(--warning)" }}>
        <Icon.fingerprint />
        <span>
          <strong>Educational interest scope active.</strong> You can view {filtered.length} of 654 flagged students per FERPA §99.31.
          Each record viewed is logged. Names shown are pseudonymized initials — full names require case ownership.
        </span>
      </div>

      <div className="tabs">
        {[
          { id: "all",          label: "All flagged",   count: D.STUDENTS.length },
          { id: "new",          label: "New",           count: D.STUDENTS.filter(s => s.status === "new").length },
          { id: "monitoring",   label: "Monitoring",    count: D.STUDENTS.filter(s => s.status === "monitoring").length },
          { id: "intervention", label: "In intervention", count: D.STUDENTS.filter(s => s.status === "intervention").length },
          { id: "resolved",     label: "Resolved",      count: D.STUDENTS.filter(s => s.status === "resolved").length },
        ].map(t => (
          <div key={t.id} className={"tab" + (filter === t.id ? " active" : "")} onClick={() => setFilter(t.id)}>
            {t.label} <span className="tab-count">{t.count}</span>
          </div>
        ))}
      </div>

      <div className="grid cols-12">
        {/* Student list */}
        <div className="col-span-7 card">
          <div className="card-head">
            <h3>Ranked by risk score</h3>
            <div className="row">
              <span className="caption">Showing {filtered.length} of 654</span>
            </div>
          </div>
          <div className="card-body tight">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 24 }}></th>
                  <th>Student</th>
                  <th>Grade</th>
                  <th>Risk</th>
                  <th>Top factors</th>
                  <th>Status</th>
                  <th>Flagged</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} onClick={() => setSelected(s)}
                      style={{ background: selected.id === s.id ? "var(--bg-2)" : "transparent" }}>
                    <td>
                      <div style={{ width: 4, height: 22, background: riskColor(s.risk), borderRadius: 2 }}></div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="avatar">{s.name.split(" ").map(p => p[0]).join("").slice(0, 2)}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                          <div className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{s.id} · {s.school}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge neutral">{s.grade}</span></td>
                    <td>
                      <div className="risk-bar">
                        <div className="risk-bar-track">
                          <div className="risk-bar-fill" style={{ width: (s.risk * 100) + "%", background: riskColor(s.risk) }}></div>
                        </div>
                        <span className="num" style={{ fontWeight: 500, color: riskColor(s.risk) }}>{s.risk.toFixed(2)}</span>
                        {s.trend === "up"   && <span style={{ color: "var(--critical)" }}><Icon.arrowUp /></span>}
                        {s.trend === "down" && <span style={{ color: "var(--success)"  }}><Icon.arrowDown /></span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {s.factors.map(f => <span key={f} className="badge outline">{f}</span>)}
                      </div>
                    </td>
                    <td>
                      <span className={"badge " + (
                        s.status === "intervention" ? "warn" :
                        s.status === "new"          ? "crit" :
                        s.status === "resolved"     ? "ok"   : "neutral"
                      )}>
                        {s.status}
                      </span>
                    </td>
                    <td className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{s.flagged}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SHAP detail */}
        <div className="col-span-5">
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-head">
              <div>
                <h3>{selected.name} · <span className="mono" style={{ fontWeight: 400, color: "var(--muted)" }}>{selected.id}</span></h3>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                  Grade {selected.grade} · {selected.school} · Caseworker: {selected.caseworker}
                </div>
              </div>
              <button className="btn ghost" style={{ height: 26 }}><Icon.external /></button>
            </div>
            <div className="card-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Risk score</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 44, color: riskColor(selected.risk), lineHeight: 1, marginTop: 4 }}>
                    {selected.risk.toFixed(2)}
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                    base rate 0.18 · 95% CI [{(selected.risk - 0.06).toFixed(2)}, {(selected.risk + 0.05).toFixed(2)}]
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    Model · <strong style={{ color: "var(--ink)" }}>at_risk_v3.6</strong>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    AUC 0.91 · Brier 0.07
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    Last scored 12 min ago
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Feature contributions (SHAP)
              </div>
              <div style={{ position: "relative" }}>
                {D.SHAP_EXAMPLE.features.map((f, i) => {
                  const maxAbs = Math.max(...D.SHAP_EXAMPLE.features.map(x => Math.abs(x.impact)));
                  const pct = (Math.abs(f.impact) / maxAbs) * 48;
                  return (
                    <div key={i} className="shap-row">
                      <span className="feat">{f.name}</span>
                      <div className="shap-bar">
                        <div className="shap-center"></div>
                        <div className={"shap-fill " + (f.dir === "pos" ? "pos" : "neg")}
                          style={{
                            left: f.dir === "pos" ? "50%" : `${50 - pct}%`,
                            width: pct + "%",
                          }}
                        ></div>
                      </div>
                      <span className="val">{f.impact > 0 ? "+" : ""}{f.impact.toFixed(2)}</span>
                    </div>
                  );
                })}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-mono)", marginTop: 6 }}>
                  <span>← decreases risk</span>
                  <span>increases risk →</span>
                </div>
              </div>

              <div className="divider"></div>

              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Suggested intervention
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ink-2)" }}>
                Attendance is the largest driver. Pattern matches <strong style={{ color: "var(--ink)" }}>Cohort C</strong> ·
                students who recovered with weekly check-ins + parental contact (n=148, 71% recovery rate within 6 weeks).
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                <button className="btn">Open case file</button>
                <button className="btn ghost">Notify counselor</button>
                <button className="btn ghost">Compare cohort</button>
              </div>
            </div>
          </div>

          {/* model card */}
          <div className="card">
            <div className="card-head">
              <h3>Model transparency</h3>
              <span className="badge ok"><Icon.check /> Reviewed</span>
            </div>
            <div className="card-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
                {[
                  { k: "Algorithm",       v: "XGBoost + LSTM" },
                  { k: "Training data",   v: "2019–2025 (N=412k)" },
                  { k: "Features",        v: "73 inputs · 8 protected" },
                  { k: "Fairness audit",  v: "Equalized odds Δ < 0.04" },
                  { k: "Retraining",      v: "Quarterly + drift-trigger" },
                  { k: "Owner",           v: "IR · Dr. P. Iyer" },
                ].map((row, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{row.k}</div>
                    <div style={{ marginTop: 2, fontFamily: row.k === "Algorithm" || row.k === "Training data" ? "var(--font-mono)" : "inherit", fontSize: row.k === "Training data" ? 11 : 12 }}>{row.v}</div>
                  </div>
                ))}
              </div>
              <button className="btn ghost" style={{ marginTop: 12, height: 26, fontSize: 12 }}>
                Open model card <Icon.external />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.AtRiskView = AtRiskView;
