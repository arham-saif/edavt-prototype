// Student segmentation / clustering view

function SegmentsView() {
  const D = window.EDAVT;
  const [highlight, setHighlight] = React.useState(null);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Student <span className="accent">segments</span></h1>
          <p className="page-sub">
            Unsupervised clustering (K-Means · k=5) + DBSCAN outlier detection · 73-feature embedding ·
            run weekly on Spark.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn ghost"><Icon.refresh /> Re-cluster</button>
          <button className="btn"><Icon.download /> Export</button>
        </div>
      </div>

      <div className="grid cols-12">
        <div className="col-span-8 card">
          <div className="card-head">
            <h3>UMAP projection · 28,140 students</h3>
            <div className="legend">
              {D.SEGMENTS.map(s => (
                <span key={s.id} className="legend-item" onClick={() => setHighlight(highlight === s.id ? null : s.id)} style={{ cursor: "pointer", opacity: highlight && highlight !== s.id ? 0.4 : 1 }}>
                  <span className="legend-swatch" style={{ background: s.color }}></span>
                  {s.id} · {s.name}
                </span>
              ))}
            </div>
          </div>
          <div className="card-body" style={{ background: "var(--surface-2)" }}>
            <ClusterScatter segments={D.SEGMENTS} highlightId={highlight} onPick={setHighlight} height={360} />
          </div>
        </div>

        <div className="col-span-4">
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-head">
              <h3>Composition</h3>
              <span className="caption">28,140 students</span>
            </div>
            <div className="card-body">
              <StackedBar
                height={32}
                segments={D.SEGMENTS.map(s => ({ label: s.name, value: s.count, color: s.color }))}
              />
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {D.SEGMENTS.map(s => (
                  <div key={s.id} onClick={() => setHighlight(highlight === s.id ? null : s.id)}
                    style={{
                      display: "grid", gridTemplateColumns: "10px 1fr auto auto", gap: 10, alignItems: "center",
                      padding: "6px 8px", borderRadius: 4, cursor: "pointer",
                      background: highlight === s.id ? "var(--bg-2)" : "transparent",
                    }}
                  >
                    <span style={{ width: 8, height: 8, background: s.color, borderRadius: 2 }}></span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{s.id} · {s.name}</span>
                    <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{s.count.toLocaleString()}</span>
                    <span className="mono" style={{ fontSize: 11, color: "var(--muted)", minWidth: 36, textAlign: "right" }}>{s.share}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Segment <span style={{ color: "var(--muted)", fontWeight: 400 }}>· focus</span></h3>
            </div>
            <div className="card-body">
              {(() => {
                const seg = highlight ? D.SEGMENTS.find(s => s.id === highlight) : D.SEGMENTS[3];
                return (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 36, height: 36, background: seg.color, borderRadius: 8, display: "grid", placeItems: "center", color: "white", fontFamily: "var(--font-display)", fontSize: 20 }}>{seg.id}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{seg.name}</div>
                        <div className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
                          {seg.count.toLocaleString()} students · avg risk {seg.risk.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                      {seg.traits.map((t, i) => <span key={i} className="badge neutral">{t}</span>)}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5 }}>
                      Recommended intervention strategy: <strong style={{ color: "var(--ink)" }}>Tiered MTSS protocol</strong>.
                      Historical recovery in this segment is <strong className="mono">{Math.round((1 - seg.risk) * 100)}%</strong> within
                      a single semester when paired with weekly counselor check-ins.
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Feature profile per segment */}
        <div className="col-span-12 card">
          <div className="card-head">
            <h3>Segment feature profile</h3>
            <span className="caption">Z-scored deviation from district mean</span>
          </div>
          <div className="card-body tight">
            <table className="table">
              <thead>
                <tr>
                  <th>Segment</th>
                  <th>Attendance</th>
                  <th>GPA</th>
                  <th>Engagement</th>
                  <th>LMS activity</th>
                  <th>Assessment</th>
                  <th>Behavior</th>
                  <th>Trajectory (LSTM)</th>
                </tr>
              </thead>
              <tbody>
                {D.SEGMENTS.map((s, i) => {
                  // synth z-scores by segment id
                  const z = {
                    A: [+1.4, +1.6, +1.3, +1.1, +1.2, +0.9, +0.8],
                    B: [+0.3, +0.2, +0.1, +0.4, +0.2, +0.1, +0.2],
                    C: [-0.6, -0.7, -0.5, -0.8, -0.4, -0.2, -0.7],
                    D: [-1.9, -1.0, -1.2, -0.9, -0.7, -0.4, -1.4],
                    E: [-2.1, -2.3, -2.0, -1.6, -1.9, -1.4, -2.2],
                    F: [+0.2, -0.4, +0.1, -0.6, +0.3, +1.1, -0.3],
                  }[s.id];
                  const cell = (v) => {
                    const w = Math.min(50, Math.abs(v) * 20);
                    const color = v > 0 ? "var(--success)" : "var(--critical)";
                    return (
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 60, height: 8, background: "var(--bg-2)", borderRadius: 1, position: "relative" }}>
                            <div style={{
                              position: "absolute",
                              left: v > 0 ? "50%" : `${50 - w}%`,
                              width: w + "%",
                              height: "100%",
                              background: color,
                              borderRadius: 1,
                            }}></div>
                            <div style={{ position: "absolute", left: "50%", top: -1, bottom: -1, width: 1, background: "var(--border-strong)" }}></div>
                          </div>
                          <span className="mono" style={{ fontSize: 11, color: v > 0 ? "var(--success)" : "var(--critical)" }}>{v > 0 ? "+" : ""}{v.toFixed(1)}σ</span>
                        </div>
                      </td>
                    );
                  };
                  return (
                    <tr key={s.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 10, height: 10, background: s.color, borderRadius: 2 }}></span>
                          <strong style={{ fontSize: 13 }}>{s.id} · {s.name}</strong>
                        </div>
                      </td>
                      {z.map((v, j) => cell(v))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

window.SegmentsView = SegmentsView;
