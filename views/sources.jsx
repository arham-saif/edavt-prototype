// Data sources / integration view

function SourcesView() {
  const D = window.EDAVT;

  const statusBadge = (s) => {
    if (s === "synced")  return <span className="badge ok"><span className="live-dot" style={{ width: 5, height: 5 }}></span>Synced</span>;
    if (s === "delayed") return <span className="badge warn"><Icon.warning /> Delayed</span>;
    if (s === "error")   return <span className="badge crit"><Icon.warning /> Error</span>;
    return <span className="badge neutral">{s}</span>;
  };

  const piiBadge = (h) => {
    const map = {
      tokenized:      { c: "cool", label: "Tokenized" },
      pseudonymized:  { c: "info", label: "Pseudonymized" },
      encrypted:      { c: "ok",   label: "Encrypted" },
      aggregated:     { c: "neutral", label: "Aggregated" },
    };
    const m = map[h] || { c: "neutral", label: h };
    return <span className={"badge " + m.c}>{m.label}</span>;
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Data <span className="accent">sources</span></h1>
          <p className="page-sub">
            Integrations across Ed-Fi, OneRoster, LTI 1.3, xAPI, QTI, and CSV/SFTP feeds ·
            orchestrated by Apache Airflow · medallion data lake (Bronze → Silver → Gold).
          </p>
        </div>
        <div className="page-actions">
          <button className="btn ghost"><Icon.refresh /> Test all</button>
          <button className="btn"><Icon.external /> Airflow UI</button>
          <button className="btn primary"><Icon.plus /> New connector</button>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 16 }}>
        <Stat label="Active connectors" value="7" delta="+1" deltaDir="up" />
        <Stat label="Records ingested · 24h" value="2.4" unit="M" delta="+11%" deltaDir="up" />
        <Stat label="Pipeline SLA" value="99.7" unit="%" delta="−0.1" deltaDir="down" />
        <Stat label="Tables in Gold layer" value="84" delta="+2" deltaDir="up" />
      </div>

      <div className="grid cols-12">
        <div className="col-span-8 card">
          <div className="card-head">
            <h3>Connectors</h3>
            <span className="caption">7 active · 1 delayed</span>
          </div>
          <div className="card-body tight">
            {D.SOURCES.map((s, i) => (
              <div key={i} className="connector">
                <div className="connector-icon">{s.code}</div>
                <div style={{ minWidth: 0 }}>
                  <h4>{s.name}</h4>
                  <div className="meta">{s.protocol} · {s.records} · sync {s.freq}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {piiBadge(s.piiHandling)}
                  {statusBadge(s.status)}
                  <span className="mono" style={{ fontSize: 11, color: "var(--muted)", width: 90, textAlign: "right" }}>
                    {s.lastSync}
                  </span>
                  <button className="icon-btn"><Icon.more /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4">
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-head">
              <h3>Ingestion volume · 7d</h3>
            </div>
            <div className="card-body">
              <Sparkline data={[1.8, 2.1, 1.9, 2.4, 2.2, 2.6, 2.4]} color="var(--primary)" height={64} width={300} area="rgba(27,58,95,0.08)" />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
              </div>
              <div className="divider"></div>
              <div style={{ fontSize: 12, color: "var(--ink-2)" }}>
                Total: <strong className="mono">14.6M records</strong> · avg lag <strong className="mono">8.2 min</strong>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Medallion layers</h3>
              <span className="caption">Delta Lake</span>
            </div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { layer: "🥉 Bronze", subtitle: "Raw ingested", tables: 38, size: "8.4 TB", color: "#9C7B4A" },
                { layer: "🥈 Silver", subtitle: "Validated · standardized", tables: 62, size: "2.1 TB", color: "#8C8C8C" },
                { layer: "🥇 Gold",   subtitle: "Analytics-ready",   tables: 84, size: "412 GB", color: "#C9A24F" },
              ].map((l, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6, padding: "8px 10px", background: "var(--bg)", borderRadius: 6, border: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{l.layer}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{l.subtitle}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="mono" style={{ fontSize: 12, fontWeight: 500 }}>{l.tables} <span style={{ color: "var(--muted)", fontWeight: 400 }}>tables</span></div>
                    <div className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{l.size}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent pipeline runs */}
        <div className="col-span-12 card">
          <div className="card-head">
            <h3>Recent pipeline runs · Airflow DAGs</h3>
            <span className="caption">last 12 runs</span>
          </div>
          <div className="card-body tight">
            <table className="table">
              <thead>
                <tr>
                  <th>DAG</th>
                  <th>Started</th>
                  <th>Duration</th>
                  <th>Tasks</th>
                  <th>Throughput</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dag: "edfi_incremental_sync",    start: "14:30:00", dur: "4m 12s",  tasks: "12/12", thr: "189k rows/min", state: "ok" },
                  { dag: "oneroster_hourly_roster",  start: "14:00:00", dur: "1m 03s",  tasks: "6/6",   thr: "—",             state: "ok" },
                  { dag: "lti_canvas_grade_pull",    start: "14:22:00", dur: "2m 47s",  tasks: "9/9",   thr: "62k rows/min",  state: "ok" },
                  { dag: "xapi_lrs_stream_ingest",   start: "always-on",dur: "—",       tasks: "stream",thr: "4.1k stmt/min", state: "ok" },
                  { dag: "smarter_balanced_daily",   start: "06:00:00", dur: "18m 22s", tasks: "14/14", thr: "—",             state: "ok" },
                  { dag: "aeries_attendance_nightly",start: "01:30:00", dur: "—",       tasks: "0/8",   thr: "—",             state: "delayed" },
                  { dag: "finance_sftp_4h",          start: "12:00:00", dur: "1m 41s",  tasks: "5/5",   thr: "—",             state: "ok" },
                ].map((r, i) => (
                  <tr key={i}>
                    <td><span className="mono" style={{ fontSize: 12 }}>{r.dag}</span></td>
                    <td className="mono" style={{ color: "var(--muted)" }}>{r.start}</td>
                    <td className="mono">{r.dur}</td>
                    <td className="mono">{r.tasks}</td>
                    <td className="mono">{r.thr}</td>
                    <td>{statusBadge(r.state)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

window.SourcesView = SourcesView;
