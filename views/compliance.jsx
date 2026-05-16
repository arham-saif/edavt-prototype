// Privacy & Compliance view

function ComplianceView() {
  const D = window.EDAVT;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Privacy <span className="accent">& compliance</span></h1>
          <p className="page-sub">
            Prototype controls for FERPA, COPPA, state student-data privacy laws, and audit-ready monitoring.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn ghost"><Icon.download /> Compliance pack</button>
          <button className="btn"><Icon.external /> Privacy office</button>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 16 }}>
        <Stat label="Frameworks mapped" value="6" delta="+1 (NIST)" deltaDir="up" />
        <Stat label="Controls designed" value="171" unit="/175" delta="prototype" />
        <Stat label="Sample consent requests" value="4" delta="synthetic" />
        <Stat label="Incident workflow" value="0" delta="sample P1s" deltaDir="up" />
      </div>

      <div className="grid cols-12">
        <div className="col-span-7 card">
          <div className="card-head">
            <h3>Compliance frameworks</h3>
            <span className="caption">External + state</span>
          </div>
          <div className="card-body tight">
            <table className="table">
              <thead>
                <tr>
                  <th>Framework</th>
                  <th>Scope</th>
                  <th>Controls</th>
                  <th>Owner</th>
                  <th>Last review</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {D.COMPLIANCE.map((c, i) => (
                  <tr key={i}>
                    <td><strong>{c.name}</strong></td>
                    <td><span className="badge neutral">{c.level}</span></td>
                    <td className="num">{c.controls}</td>
                    <td>{c.owner}</td>
                    <td className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{c.lastReview}</td>
                    <td>
                      {c.status === "designed"
                        ? <span className="badge ok"><Icon.check /> Designed</span>
                        : c.status === "roadmap"
                          ? <span className="badge warn">Roadmap</span>
                          : <span className="badge warn">In progress</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-5 card">
          <div className="card-head">
            <h3>FERPA scope · students by access tier</h3>
          </div>
          <div className="card-body">
            <Donut
              size={160} thickness={24}
              segments={[
                { label: "Tier A — Educational interest", value: 19400, color: "var(--primary)" },
                { label: "Tier B — Directory only",       value:  6200, color: "var(--info)" },
                { label: "Tier C — Restricted (opt-out)", value:  2540, color: "var(--accent)" },
              ]}
              centerValue="9.0%" centerLabel="opt-out rate"
            />
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <FerpaLegend color="var(--primary)" label="Educational interest" v="19,400" pct={68.9}
                desc="Default for teaching staff per role mapping." />
              <FerpaLegend color="var(--info)" label="Directory only" v="6,200" pct={22.0}
                desc="No risk model exposure; aggregate only." />
              <FerpaLegend color="var(--accent)" label="Restricted (opt-out)" v="2,540" pct={9.0}
                desc="Parental opt-out filed; excluded from advisory features." />
            </div>
          </div>
        </div>

        <div className="col-span-6 card">
          <div className="card-head">
            <h3>Security controls</h3>
            <span className="badge ok"><Icon.lock /> Designed</span>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { k: "Encryption at rest",   v: "AES-256 design target · KMS-managed keys",     state: "ok" },
              { k: "Encryption in transit",v: "TLS 1.3 design target · HSTS-ready",           state: "ok" },
              { k: "Authentication",       v: "SAML 2.0 · OIDC · MFA for admin roles",        state: "ok" },
              { k: "Authorization",        v: "RBAC · ABAC scope filters · role-scoped views", state: "ok" },
              { k: "Key management",       v: "Vault/KMS pattern documented for deployment",  state: "ok" },
              { k: "Vulnerability scans",  v: "CI scan gate planned before production",       state: "ok" },
              { k: "Penetration test",     v: "Third-party test planned before paid pilots",  state: "ok" },
              { k: "Backup & DR",          v: "RPO/RTO targets documented for SaaS tier",     state: "ok" },
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr auto", gap: 10, alignItems: "center", paddingBottom: 8, borderBottom: i < 7 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize: 12, color: "var(--ink-2)" }}>{row.k}</div>
                <div className="mono" style={{ fontSize: 11.5, color: "var(--ink)" }}>{row.v}</div>
                <span className="badge ok"><Icon.check /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-6">
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-head">
              <h3>Data-handling rules per source</h3>
              <span className="caption">PII transformation pipeline</span>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { src: "SIS demographics",     mode: "Tokenized (deterministic SHA-256)", k: "k≥10" },
                  { src: "Assessment scores",    mode: "Tokenized + bucketed",              k: "k≥10" },
                  { src: "Attendance",           mode: "Encrypted at column level",         k: "row-level" },
                  { src: "Behavioral incidents", mode: "Encrypted + 7-day grace cache",     k: "row-level" },
                  { src: "Counselor notes",      mode: "Pseudonymized · BERT embeddings only", k: "k≥10" },
                  { src: "Financial / FRPM",     mode: "Aggregated · never row-level",      k: "k≥10" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 70px", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 4, background: "var(--bg)", border: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{r.src}</span>
                    <span className="mono" style={{ fontSize: 11, color: "var(--ink-2)" }}>{r.mode}</span>
                    <span className="badge cool" style={{ justifySelf: "end" }}>{r.k}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Open consent workflow</h3>
              <span className="badge warn">4 pending</span>
            </div>
            <div className="card-body tight">
              {[
                { who: "S-4882 · Parent of B. Hassan", req: "FERPA disclosure — IEP transfer",   submitted: "May 14", due: "May 21" },
                { who: "S-3805 · C. Yamamoto",         req: "Right to inspect data file",       submitted: "May 13", due: "May 27" },
                { who: "S-4108 · Parent of A. Brennan",req: "Opt-out — predictive modeling",    submitted: "May 12", due: "May 19" },
                { who: "S-5021 · L. Nguyen",           req: "Correction request — assessment",   submitted: "May 10", due: "Jun 9" },
              ].map((c, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", padding: "12px 16px", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{c.req}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                      <span className="mono">{c.who}</span> · submitted <span className="mono">{c.submitted}</span> · due <span className="mono">{c.due}</span>
                    </div>
                  </div>
                  <button className="btn">Review</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FerpaLegend({ color, label, v, pct, desc }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "10px 1fr", gap: 10, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
      <span style={{ width: 8, height: 8, background: color, borderRadius: 2, marginTop: 5 }}></span>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{v} · {pct}%</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  );
}

window.ComplianceView = ComplianceView;
