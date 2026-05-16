// Predictions view — LSTM time-series forecast

function PredictionsView() {
  const D = window.EDAVT;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Outcome <span className="accent">predictions</span></h1>
          <p className="page-sub">
            LSTM/GRU recurrent networks (PyTorch) + Cox proportional hazards survival models ·
            12-month rolling forecast.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn ghost"><Icon.calendar /> 12 months</button>
          <button className="btn"><Icon.download /> Export forecast</button>
        </div>
      </div>

      <div className="grid cols-12">
        {/* KPI row */}
        <div className="col-span-3"><Stat label="Predicted dropout rate (12m)" value="4.0" unit="%" delta="+0.4 pp" deltaDir="down" /></div>
        <div className="col-span-3"><Stat label="Forecast confidence" value="89" unit="%" delta="+2.1" deltaDir="up" /></div>
        <div className="col-span-3"><Stat label="Students requiring intervention" value="1,127" delta="+8.2%" deltaDir="down" /></div>
        <div className="col-span-3"><Stat label="Model MAE (back-test)" value="0.31" delta="−0.04" deltaDir="up" /></div>

        {/* Forecast chart */}
        <div className="col-span-8 card">
          <div className="card-head">
            <h3>Dropout-risk forecast · district-level</h3>
            <div className="legend">
              <span className="legend-item"><span className="legend-swatch" style={{ background: "var(--ink)" }}></span>Actual</span>
              <span className="legend-item"><span className="legend-swatch" style={{ background: "var(--accent)" }}></span>LSTM forecast</span>
              <span className="legend-item"><span className="legend-swatch" style={{ background: "rgba(200,85,61,0.25)" }}></span>95% CI</span>
            </div>
          </div>
          <div className="card-body">
            <ForecastChart
              labels={D.FORECAST.labels}
              actual={D.FORECAST.actual}
              predicted={D.FORECAST.predicted}
              upper={D.FORECAST.upper}
              lower={D.FORECAST.lower}
              height={260}
            />
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 12, lineHeight: 1.5 }}>
              The model predicts a rise from <span className="mono">3.7% → 4.0%</span> over the next two quarters,
              driven primarily by Grade 11 attendance trends. Confidence widens past month 9 as input feature
              variance grows.
            </div>
          </div>
        </div>

        {/* Survival curve / hazard */}
        <div className="col-span-4 card">
          <div className="card-head">
            <h3>Time-to-event (survival)</h3>
            <span className="caption">Cox PH model</span>
          </div>
          <div className="card-body">
            <SurvivalChart />
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5 }}>
              <strong>Window of effective intervention</strong> for Tier-3 students closes
              around <span className="mono">week 14</span> of a flag — after that the recovery
              probability halves.
            </div>
          </div>
        </div>

        {/* Per-grade forecast table */}
        <div className="col-span-7 card">
          <div className="card-head">
            <h3>Per-grade predictive outcomes</h3>
            <span className="caption">end-of-year projections</span>
          </div>
          <div className="card-body tight">
            <table className="table">
              <thead>
                <tr>
                  <th>Grade</th>
                  <th>Cohort size</th>
                  <th>Projected EOY GPA</th>
                  <th>On-time completion</th>
                  <th>Intervention need</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { g: "Grade 9",  n: 2410, gpa: 3.04, comp: 91.2, need: 142 },
                  { g: "Grade 10", n: 2380, gpa: 2.98, comp: 88.6, need: 178 },
                  { g: "Grade 11", n: 2290, gpa: 2.91, comp: 84.1, need: 264 },
                  { g: "Grade 12", n: 2240, gpa: 2.96, comp: 93.4, need: 92  },
                ].map((r, i) => (
                  <tr key={i}>
                    <td><strong>{r.g}</strong></td>
                    <td className="num">{r.n.toLocaleString()}</td>
                    <td className="num">
                      <span style={{ color: r.gpa < 2.95 ? "var(--warning)" : "var(--ink)" }}>{r.gpa.toFixed(2)}</span>
                    </td>
                    <td>
                      <div className="risk-bar">
                        <div className="risk-bar-track" style={{ width: 80 }}>
                          <div className="risk-bar-fill" style={{
                            width: r.comp + "%",
                            background: r.comp < 86 ? "var(--warning)" : "var(--success)",
                          }}></div>
                        </div>
                        <span className="num">{r.comp.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge neutral">{r.need} students</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model lineage */}
        <div className="col-span-5 card">
          <div className="card-head">
            <h3>Model lineage · MLflow</h3>
            <span className="badge ok"><Icon.check /> Deployed</span>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { ver: "v3.6", state: "production",  date: "May 11, 2026", note: "Quarterly retrain · +0.04 AUC over v3.5", auc: 0.91 },
              { ver: "v3.5", state: "archived",    date: "Feb 8, 2026",  note: "Stable for 12 weeks", auc: 0.87 },
              { ver: "v3.4", state: "archived",    date: "Nov 1, 2025",  note: "Drift detected · auto-rolled forward", auc: 0.84 },
              { ver: "v3.3", state: "archived",    date: "Aug 4, 2025",  note: "Initial deployment of LSTM trajectory", auc: 0.82 },
            ].map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 10, alignItems: "center", paddingBottom: i < 3 ? 12 : 0, borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                <span className="mono" style={{ fontWeight: 600, fontSize: 13 }}>{m.ver}</span>
                <div>
                  <div style={{ fontSize: 12 }}>
                    {m.note}
                    {" "}
                    <span className={"badge " + (m.state === "production" ? "ok" : "neutral")} style={{ marginLeft: 4 }}>
                      {m.state}
                    </span>
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{m.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>AUC</div>
                  <div className="mono" style={{ fontWeight: 600, fontSize: 13 }}>{m.auc.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SurvivalChart() {
  // Synthetic survival curves: tier 1, 2, 3
  const width = 400, height = 180;
  const padding = { top: 10, right: 10, bottom: 24, left: 30 };
  const weeks = Array.from({ length: 26 }, (_, i) => i);
  const curve = (lambda) => weeks.map(w => Math.exp(-lambda * w));
  const c1 = curve(0.005);
  const c2 = curve(0.018);
  const c3 = curve(0.06);
  const xFor = (i) => padding.left + (i / 25) * (width - padding.left - padding.right);
  const yFor = (v) => padding.top + (1 - v) * (height - padding.top - padding.bottom);
  const path = (data) => data.map((v, i) => (i ? "L" : "M") + xFor(i) + "," + yFor(v)).join(" ");
  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
        <g key={i}>
          <line x1={padding.left} x2={width - padding.right} y1={yFor(v)} y2={yFor(v)} stroke="var(--border)" strokeWidth="0.5" strokeDasharray={v === 0 || v === 1 ? "0" : "2,3"} />
          <text x={padding.left - 4} y={yFor(v) + 3} textAnchor="end" fontSize="9" fill="var(--muted)" fontFamily="var(--font-mono)">{(v * 100).toFixed(0)}%</text>
        </g>
      ))}
      <line x1={xFor(14)} x2={xFor(14)} y1={padding.top} y2={height - padding.bottom} stroke="var(--accent)" strokeWidth="0.7" strokeDasharray="3,2" />
      <text x={xFor(14) + 4} y={padding.top + 9} fontSize="9" fill="var(--accent)" fontFamily="var(--font-mono)">wk 14</text>
      <path d={path(c1)} fill="none" stroke="var(--success)" strokeWidth="1.8" />
      <path d={path(c2)} fill="none" stroke="var(--warning)" strokeWidth="1.8" />
      <path d={path(c3)} fill="none" stroke="var(--critical)" strokeWidth="1.8" />
      {[0, 6, 12, 18, 24].map(w => (
        <text key={w} x={xFor(w)} y={height - 6} textAnchor="middle" fontSize="9" fill="var(--muted)" fontFamily="var(--font-mono)">{`wk ${w}`}</text>
      ))}
      {/* end labels */}
      <text x={xFor(25) - 2} y={yFor(c1[25]) + 3} textAnchor="end" fontSize="9" fill="var(--success)" fontFamily="var(--font-mono)">Tier 1</text>
      <text x={xFor(25) - 2} y={yFor(c2[25]) + 3} textAnchor="end" fontSize="9" fill="var(--warning)" fontFamily="var(--font-mono)">Tier 2</text>
      <text x={xFor(25) - 2} y={yFor(c3[25]) + 3} textAnchor="end" fontSize="9" fill="var(--critical)" fontFamily="var(--font-mono)">Tier 3</text>
    </svg>
  );
}

window.PredictionsView = PredictionsView;
