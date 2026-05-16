// Overview — District/School dashboard
function OverviewView({ role, tweaks }) {
  const D = window.EDAVT;
  const isAdmin = role.id === "admin";
  const isTeacher = role.id === "teacher";
  const isCounselor = role.id === "counselor";

  const scopeLabel = isAdmin ? "District-wide" : isTeacher ? "My caseload" : role.title.split("—")[1] ? role.title.split("—")[1].trim() : role.scope;
  const studentsInScope = isAdmin ? 28140 : isTeacher ? 142 : role.id === "principal" ? 1840 : 218;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            {isAdmin ? <>District <span className="accent">overview</span></> : isTeacher ? <>Class <span className="accent">overview</span></> : <>School <span className="accent">overview</span></>}
          </h1>
          <p className="page-sub">
            {scopeLabel} · Week of May 11, 2026 · Updated <span className="mono">12 min ago</span>
          </p>
        </div>
        <div className="page-actions">
          <button className="btn ghost"><Icon.calendar /> Spring 2026</button>
          <button className="btn"><Icon.download /> Export</button>
          <button className="btn primary"><Icon.plus /> New report</button>
        </div>
      </div>

      <div className="privacy-strip" style={{ marginBottom: 20 }}>
        <Icon.lock />
        <span>
          You are viewing <strong>{scopeLabel.toLowerCase()}</strong> data per your role-based access scope.
          Identifiers are pseudonymized. All views are logged to the audit trail.
        </span>
        <button className="btn ghost" style={{ marginLeft: "auto", height: 24, fontSize: 11 }}>Scope details <Icon.chevRight /></button>
      </div>

      {/* KPI row */}
      <div className="grid cols-4" style={{ marginBottom: 16 }}>
        <Stat label="Students in scope" value={studentsInScope.toLocaleString()} delta="+1.2%" deltaDir="up" spark={[1, 2, 2, 3, 3, 4, 4, 5]} />
        <Stat label="Average attendance" value="93.6" unit="%" delta="−0.6 pp" deltaDir="down"
        spark={D.TRENDS.attendance} sparkColor="var(--info)" />
        <Stat label="At-risk · Tier 2+" value="654" delta="−9.4%" deltaDir="down"
        spark={D.TRENDS.riskCount} sparkColor="var(--accent)" />
        <Stat label="Engagement index" value="84" unit="/100" delta="+2.6" deltaDir="up"
        spark={D.TRENDS.engagement} sparkColor="var(--success)" />
      </div>

      {/* Main grid */}
      <div className="grid cols-12">
        {/* Trend chart */}
        <div className="col-span-8 card">
          <div className="card-head">
            <div className="row" style={{ gap: 12 }}>
              <h3>Trends — last 12 weeks</h3>
              <span className="caption"><span className="live-dot"></span>Simulated refresh every 15 min</span>
            </div>
            <div className="row">
              <div className="legend">
                <span className="legend-item"><span className="legend-swatch" style={{ background: "var(--ink)" }}></span>Attendance %</span>
                <span className="legend-item"><span className="legend-swatch" style={{ background: "var(--accent)" }}></span>At-risk count (×10)</span>
                <span className="legend-item"><span className="legend-swatch" style={{ background: "var(--success)" }}></span>Engagement</span>
              </div>
            </div>
          </div>
          <div className="card-body">
            <LineChart
              labels={D.WEEKS}
              series={[
              { color: "var(--ink)", data: D.TRENDS.attendance, areaFill: "rgba(20,19,14,0.05)" },
              { color: "var(--accent)", data: D.TRENDS.riskCount.map((v) => v / 10), strokeWidth: 1.6 },
              { color: "var(--success)", data: D.TRENDS.engagement, strokeWidth: 1.6, dash: "3,3" }]
              }
              formatY={(v) => v.toFixed(0)}
              height={240} />
            
          </div>
        </div>

        {/* Risk by tier donut */}
        <div className="col-span-4 card">
          <div className="card-head">
            <h3>Risk distribution</h3>
            <span className="caption">Tier 1 / 2 / 3</span>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <Donut
              size={160} thickness={24}
              segments={[
              { label: "Tier 1 — On track", value: 22840, color: "var(--success)" },
              { label: "Tier 2 — Monitor", value: 3140, color: "var(--warning)" },
              { label: "Tier 3 — Acute", value: 654, color: "var(--critical)" },
              { label: "Outliers", value: 836, color: "var(--c5)" }]
              }
              centerValue="2.3%" centerLabel="Tier 3" />
            
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
              { label: "On track", value: 22840, pct: 81.2, color: "var(--success)" },
              { label: "Monitoring", value: 3140, pct: 11.2, color: "var(--warning)" },
              { label: "Acute (Tier 3)", value: 654, pct: 2.3, color: "var(--critical)" },
              { label: "Outliers (DBSCAN)", value: 836, pct: 3.0, color: "var(--c5)" }].
              map((r, i) =>
              <div key={i} style={{ display: "grid", gridTemplateColumns: "10px 1fr auto auto", gap: 8, alignItems: "center", fontSize: 12 }}>
                  <span style={{ width: 8, height: 8, background: r.color, borderRadius: 2 }}></span>
                  <span>{r.label}</span>
                  <span className="mono" style={{ color: "var(--muted)", fontSize: 11 }}>{r.value.toLocaleString()}</span>
                  <span className="mono" style={{ fontSize: 11, minWidth: 36, textAlign: "right" }}>{r.pct.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schools breakdown */}
        {isAdmin &&
        <div className="col-span-7 card">
            <div className="card-head">
              <h3>Schools — at-risk rate vs. attendance</h3>
              <span className="caption">{D.SCHOOLS.length} sites</span>
            </div>
            <div className="card-body tight">
              <table className="table">
                <thead>
                  <tr>
                    <th>School</th>
                    <th>Level</th>
                    <th style={{ textAlign: "right" }}>Students</th>
                    <th>At-risk rate</th>
                    <th style={{ textAlign: "right" }}>Δ 4w</th>
                  </tr>
                </thead>
                <tbody>
                  {D.SCHOOLS.map((s) =>
                <tr key={s.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="avatar" style={{ background: "var(--bg-2)", fontSize: 10 }}>{s.id}</div>
                          <span style={{ fontWeight: 500 }}>{s.name}</span>
                        </div>
                      </td>
                      <td><span className="badge neutral">{s.level}</span></td>
                      <td className="num" style={{ textAlign: "right" }}>{s.students.toLocaleString()}</td>
                      <td>
                        <div className="risk-bar">
                          <div className="risk-bar-track">
                            <div className="risk-bar-fill" style={{
                          width: Math.min(100, s.atRisk * 6) + "%",
                          background: s.atRisk > 12 ? "var(--critical)" : s.atRisk > 9 ? "var(--warning)" : "var(--success)"
                        }}></div>
                          </div>
                          <span className="num">{s.atRisk.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="num" style={{ textAlign: "right", color: s.atRisk > 12 ? "var(--critical)" : "var(--success)" }}>
                        {s.atRisk > 12 ? "↑" : "↓"} {(Math.random() * 1.6 + 0.2).toFixed(1)}pp
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        }

        {!isAdmin &&
        <div className="col-span-7 card">
            <div className="card-head">
              <h3>{isTeacher ? "Class sections" : "Grade-level breakdown"}</h3>
              <span className="caption">5 cohorts</span>
            </div>
            <div className="card-body">
              <HBarList
              items={[
              { label: isTeacher ? "AP Bio · §1" : "Grade 9", value: 88, display: "88% on track", color: "var(--success)" },
              { label: isTeacher ? "AP Bio · §2" : "Grade 10", value: 79, display: "79% on track", color: "var(--success)" },
              { label: isTeacher ? "AP Bio · §3" : "Grade 11", value: 71, display: "71% on track", color: "var(--warning)" },
              { label: isTeacher ? "AP Bio · §4" : "Grade 12", value: 84, display: "84% on track", color: "var(--success)" },
              { label: isTeacher ? "AP Bio · §5" : "Transfers", value: 62, display: "62% on track", color: "var(--critical)" }]
              } />
            
              <div className="divider"></div>
              <div style={{ fontSize: 12, color: "var(--ink-2)" }}>
                <strong style={{ color: "var(--ink)" }}>Section 3 — Period 5</strong> is trending toward concern.
                Attendance has dropped 4.2pp over the last fortnight.
                <button className="btn ghost" style={{ marginTop: 8, height: 26, fontSize: 12, padding: "0 8px" }}>
                  Open caseload <Icon.chevRight />
                </button>
              </div>
            </div>
          </div>
        }

        {/* Alerts feed */}
        <div className="col-span-5 card">
          <div className="card-head">
            <div className="row" style={{ gap: 10 }}>
              <h3>Early-warning alerts</h3>
              <span className="badge crit">3 new</span>
            </div>
            <button className="btn ghost" style={{ height: 24, fontSize: 11 }}>View all <Icon.chevRight /></button>
          </div>
          <div className="card-body tight">
            {[
            { sev: "crit", title: "M. Alvarez · risk 0.91", meta: "Attendance ↓ 14pp this month · Grade 10", ts: "14m ago" },
            { sev: "crit", title: "D. Patel · risk 0.87", meta: "Two failing assessments in Algebra II", ts: "1h ago" },
            { sev: "warn", title: "AP Bio §3 cohort", meta: "Engagement dropped 22% week-over-week", ts: "2h ago" },
            { sev: "warn", title: "J. Williams · new flag", meta: "First-time at-risk flag (Tier 2)", ts: "3h ago" },
            { sev: "info", title: "Weekly digest ready", meta: "27 cases need review by Friday", ts: "8h ago" }].
            map((a, i) =>
            <div key={i} className="alert-row">
                <div className={"stripe " + a.sev}></div>
                <div style={{ minWidth: 0 }}>
                  <h4>{a.title}</h4>
                  <div className="meta">{a.meta}</div>
                </div>
                <div className="timestamp">{a.ts}</div>
              </div>
            )}
          </div>
        </div>

        {/* Attendance heatmap */}
        <div className="col-span-7 card">
          <div className="card-head">
            <h3>Attendance heatmap — last 8 weeks × grade level</h3>
            <span className="caption">% present, by day-of-week</span>
          </div>
          <div className="card-body">
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                <span>K-2</span><span>3-5</span><span>6-8</span><span>9-10</span><span>11-12</span>
              </div>
              <Heatmap
                rows={5} cols={40}
                getValue={(r, c) => {
                  // deterministic
                  const seed = (r * 41 + c * 7) % 100;
                  return 78 + seed % 22 + (r === 4 && c > 28 ? -8 : 0);
                }}
                colorFor={(v) => {
                  if (v >= 95) return "#2A6A3F";
                  if (v >= 90) return "#4F8E5F";
                  if (v >= 85) return "#9FBF8F";
                  if (v >= 80) return "#E0C97D";
                  if (v >= 75) return "#C8553D";
                  return "#8B1F1F";
                }}
                height={120} />
              
            </div>
            <div className="row" style={{ marginTop: 14, gap: 10, fontSize: 11, color: "var(--muted)" }}>
              <span>Less</span>
              {["#8B1F1F", "#C8553D", "#E0C97D", "#9FBF8F", "#4F8E5F", "#2A6A3F"].map((c, i) =>
              <span key={i} style={{ width: 14, height: 10, background: c, borderRadius: 1, display: "inline-block" }}></span>
              )}
              <span>More</span>
              <span className="sep-dot"></span>
              <span>Wed Apr 22 — Fri May 16 · Mon–Fri only</span>
            </div>
          </div>
        </div>

        {/* Privacy / system */}
        <div className="col-span-5 card">
          <div className="card-head">
            <h3>System & privacy posture</h3>
            <span className="badge ok"><Icon.check /> Prototype</span>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
            { label: "Data at rest", val: "AES-256 design target", state: "ok" },
            { label: "Data in transit", val: "TLS 1.3 design target", state: "ok" },
            { label: "Active sessions", val: "1,422 · synthetic load", state: "ok" },
            { label: "Model freshness", val: "at_risk_v3.6 · demo metadata", state: "ok" },
            { label: "Data drift detector", val: "Within 2σ of synthetic baseline", state: "ok" },
            { label: "Open audit reviews", val: "1 · awaiting J. Hartman", state: "warn" }].
            map((row, i) =>
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 10, paddingBottom: 8, borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{row.label}</div>
                  <div style={{ fontSize: 13, marginTop: 2, fontFamily: row.label.startsWith("Model") ? "var(--font-mono)" : "inherit" }}>{row.val}</div>
                </div>
                <span className={"badge " + (row.state === "ok" ? "ok" : "warn")}>
                  {row.state === "ok" ? <><Icon.check /> OK</> : <><Icon.warning /> 1</>}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);

}

window.OverviewView = OverviewView;
