// Chart components — all SVG, no deps.
const { useMemo, useState, useRef, useEffect } = React;

function pathFromPoints(pts) {
  if (!pts.length) return "";
  return pts.map((p, i) => (i === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
}

// Smooth (Catmull-Rom-ish) path
function smoothPath(pts) {
  if (pts.length < 2) return pathFromPoints(pts);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[Math.max(0, i - 1)];
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const [x3, y3] = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = x1 + (x2 - x0) / 6;
    const c1y = y1 + (y2 - y0) / 6;
    const c2x = x2 - (x3 - x1) / 6;
    const c2y = y2 - (y3 - y1) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`;
  }
  return d;
}

// ====== Sparkline ======
function Sparkline({ data, color = "var(--ink-2)", height = 32, width = 120, fill = true, area = "rgba(20,19,14,0.06)" }) {
  const { min, max } = useMemo(() => ({ min: Math.min(...data), max: Math.max(...data) }), [data]);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
  i / (data.length - 1) * width,
  height - (v - min) / range * (height - 4) - 2]
  );
  const d = smoothPath(pts);
  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      {fill &&
      <path d={`${d} L${width},${height} L0,${height} Z`} fill={area} />
      }
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.5" fill={color} />
    </svg>);

}

// ====== Line chart (multi-series with grid) ======
function LineChart({ series, labels, height = 220, yLabel, formatY = (v) => v, padding = { top: 12, right: 14, bottom: 22, left: 38 } }) {
  const width = 600; // SVG viewBox width
  const all = series.flatMap((s) => s.data).filter((v) => v != null);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const yMin = min - (max - min) * 0.1;
  const yMax = max + (max - min) * 0.1;
  const range = yMax - yMin || 1;

  const xFor = (i) => padding.left + i / (labels.length - 1) * (width - padding.left - padding.right);
  const yFor = (v) => padding.top + (1 - (v - yMin) / range) * (height - padding.top - padding.bottom);

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => yMin + i / ticks * range);

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      {/* gridlines */}
      {yTicks.map((t, i) =>
      <g key={i}>
          <line x1={padding.left} x2={width - padding.right} y1={yFor(t)} y2={yFor(t)} stroke="var(--border)" strokeWidth="0.5" strokeDasharray={i === 0 || i === ticks ? "0" : "2,3"} />
          <text x={padding.left - 6} y={yFor(t) + 3} textAnchor="end" fontSize="9" fill="var(--muted)" fontFamily="var(--font-mono)">
            {formatY(t)}
          </text>
        </g>
      )}
      {/* x labels */}
      {labels.map((l, i) =>
      i % Math.ceil(labels.length / 8) === 0 || i === labels.length - 1 ?
      <text key={i} x={xFor(i)} y={height - 6} textAnchor="middle" fontSize="9" fill="var(--muted)" fontFamily="var(--font-mono)">{l}</text> :
      null
      )}
      {/* series */}
      {series.map((s, idx) => {
        // Split into continuous segments by null
        const segments = [];
        let cur = [];
        s.data.forEach((v, i) => {
          if (v == null) {if (cur.length) segments.push(cur);cur = [];} else
          cur.push([xFor(i), yFor(v)]);
        });
        if (cur.length) segments.push(cur);
        return (
          <g key={idx}>
            {s.areaFill && segments.map((seg, j) => {
              const d = smoothPath(seg);
              const x0 = seg[0][0],xN = seg[seg.length - 1][0];
              const yBase = height - padding.bottom;
              return <path key={j} d={`${d} L${xN},${yBase} L${x0},${yBase} Z`} fill={s.areaFill} />;
            })}
            {segments.map((seg, j) =>
            <path key={j} d={smoothPath(seg)} fill="none" stroke={s.color} strokeWidth={s.strokeWidth || 1.8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s.dash || "0"} />
            )}
          </g>);

      })}
    </svg>);

}

// ====== Forecast line chart with confidence band ======
function ForecastChart({ labels, actual, predicted, lower, upper, height = 240 }) {
  const width = 600;
  const padding = { top: 12, right: 16, bottom: 26, left: 36 };
  const all = [...actual, ...predicted, ...lower, ...upper].filter((v) => v != null);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const yMin = min - 0.5;
  const yMax = max + 0.5;
  const range = yMax - yMin || 1;

  const xFor = (i) => padding.left + i / (labels.length - 1) * (width - padding.left - padding.right);
  const yFor = (v) => padding.top + (1 - (v - yMin) / range) * (height - padding.top - padding.bottom);

  // confidence band
  const bandTop = [];
  const bandBot = [];
  predicted.forEach((v, i) => {
    if (upper[i] != null && lower[i] != null) {
      bandTop.push([xFor(i), yFor(upper[i])]);
      bandBot.push([xFor(i), yFor(lower[i])]);
    }
  });

  const actSeg = [];
  let cur = [];
  actual.forEach((v, i) => {
    if (v == null) {if (cur.length) actSeg.push(cur);cur = [];} else
    cur.push([xFor(i), yFor(v)]);
  });
  if (cur.length) actSeg.push(cur);

  const predSeg = [];
  cur = [];
  predicted.forEach((v, i) => {
    if (v == null) {if (cur.length) predSeg.push(cur);cur = [];} else
    cur.push([xFor(i), yFor(v)]);
  });
  if (cur.length) predSeg.push(cur);

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => yMin + i / ticks * range);

  // forecast start index = first non-null predicted that has null actual
  const forecastStart = predicted.findIndex((v, i) => v != null && actual[i] == null);

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      {/* y gridlines */}
      {yTicks.map((t, i) =>
      <g key={i}>
          <line x1={padding.left} x2={width - padding.right} y1={yFor(t)} y2={yFor(t)} stroke="var(--border)" strokeWidth="0.5" strokeDasharray={i === 0 ? "0" : "2,3"} />
          <text x={padding.left - 6} y={yFor(t) + 3} textAnchor="end" fontSize="9" fill="var(--muted)" fontFamily="var(--font-mono)">{t.toFixed(1)}%</text>
        </g>
      )}
      {/* forecast separator */}
      {forecastStart > 0 &&
      <g>
          <line x1={xFor(forecastStart - 0.5)} x2={xFor(forecastStart - 0.5)} y1={padding.top} y2={height - padding.bottom} stroke="var(--border-strong)" strokeWidth="0.5" strokeDasharray="3,3" />
          <text x={xFor(forecastStart - 0.5) + 4} y={padding.top + 9} fontSize="9" fill="var(--muted)" fontFamily="var(--font-mono)">forecast →</text>
        </g>
      }
      {/* confidence band */}
      {bandTop.length > 1 &&
      <path
        d={`${smoothPath(bandTop)} L${bandBot[bandBot.length - 1][0]},${bandBot[bandBot.length - 1][1]} ${[...bandBot].reverse().map((p) => `L${p[0]},${p[1]}`).join(" ")} Z`}
        fill="rgba(200, 85, 61, 0.12)" />

      }
      {/* x labels */}
      {labels.map((l, i) =>
      <text key={i} x={xFor(i)} y={height - 8} textAnchor="middle" fontSize="9" fill="var(--muted)" fontFamily="var(--font-mono)">{l}</text>
      )}
      {/* actual line */}
      {actSeg.map((seg, j) =>
      <path key={j} d={smoothPath(seg)} fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      )}
      {actSeg.flat().map((p, i) =>
      <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="var(--ink)" />
      )}
      {/* predicted line */}
      {predSeg.map((seg, j) =>
      <path key={j} d={smoothPath(seg)} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeDasharray="4,3" />
      )}
      {predSeg.flat().map((p, i) =>
      <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="var(--accent)" />
      )}
    </svg>);

}

// ====== Horizontal Bar list ======
function HBarList({ items, height = 220, color = "var(--primary)" }) {
  const max = Math.max(...items.map((i) => i.value));
  const rowH = Math.min(28, (height - 8) / items.length);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map((it, i) =>
      <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr 56px", gap: 10, alignItems: "center", fontSize: 12 }}>
          <span style={{ color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.label}</span>
          <div style={{ height: 14, background: "var(--bg-2)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, width: it.value / max * 100 + "%", background: it.color || color, borderRadius: 2 }} />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-2)", textAlign: "right" }}>{it.display ?? it.value}</span>
        </div>
      )}
    </div>);

}

// ====== Stacked bar (single row, segmented) ======
function StackedBar({ segments, height = 28 }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <div style={{ display: "flex", height, borderRadius: 4, overflow: "hidden", background: "var(--bg-2)" }}>
      {segments.map((s, i) =>
      <div key={i} title={`${s.label}: ${s.value}`}
      style={{
        width: s.value / total * 100 + "%",
        background: s.color,
        borderRight: i < segments.length - 1 ? "1.5px solid var(--surface)" : "none"
      }} />

      )}
    </div>);

}

// ====== Donut ======
function Donut({ segments, size = 140, thickness = 22, centerLabel, centerValue }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-2)" strokeWidth={thickness} />
      {segments.map((s, i) => {
        const frac = s.value / total;
        const len = c * frac;
        const el =
        <circle key={i}
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={s.color} strokeWidth={thickness}
        strokeDasharray={`${len} ${c - len}`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.4s ease" }} />;


        offset += len;
        return el;
      })}
      {centerValue !== undefined &&
      <g>
          <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fontSize="22" fontFamily="var(--font-display)" fill="var(--ink)" style={{ fontStyle: "normal" }}>
            {centerValue}
          </text>
          <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--muted)" letterSpacing="0.06em">
            {(centerLabel || "").toUpperCase()}
          </text>
        </g>
      }
    </svg>);

}

// ====== Cluster scatter (segments) ======
function ClusterScatter({ segments, height = 320, highlightId, onPick }) {
  const width = 600;
  // Deterministic synthetic 2D embedding per segment
  const dots = useMemo(() => {
    const out = [];
    segments.forEach((seg, si) => {
      // cluster center
      const cx = 70 + si % 3 * 180 + (si > 2 ? 90 : 0);
      const cy = 50 + Math.floor(si / 3) * 130 + (si % 2 ? 30 : 0);
      const n = Math.max(20, Math.min(120, Math.round(seg.share * 4)));
      // pseudo-random per seg
      let s = (si + 1) * 9301;
      for (let i = 0; i < n; i++) {
        s = (s * 9301 + 49297) % 233280;
        const r1 = s / 233280;
        s = (s * 9301 + 49297) % 233280;
        const r2 = s / 233280;
        const ang = r1 * Math.PI * 2;
        const rad = Math.sqrt(r2) * (seg.id === "F" ? 70 : 40);
        out.push({
          x: cx + Math.cos(ang) * rad,
          y: cy + Math.sin(ang) * rad,
          c: seg.color,
          segId: seg.id
        });
      }
    });
    return out;
  }, [segments]);

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height }}>
      {/* axes labels */}
      <text x={12} y={height - 8} fontSize="10" fontFamily="var(--font-mono)" fill="var(--muted)">UMAP-1 →</text>
      <text x={12} y={14} fontSize="10" fontFamily="var(--font-mono)" fill="var(--muted)">↑ UMAP-2</text>
      {dots.map((d, i) =>
      <circle key={i} cx={d.x} cy={d.y} r={highlightId && d.segId !== highlightId ? 2 : 3}
      fill={d.c}
      opacity={highlightId && d.segId !== highlightId ? 0.18 : 0.72} />

      )}
      {/* cluster labels */}
      {segments.map((seg, si) => {
        const cx = 70 + si % 3 * 180 + (si > 2 ? 90 : 0);
        const cy = 50 + Math.floor(si / 3) * 130 + (si % 2 ? 30 : 0);
        return (
          <g key={si} onClick={() => onPick && onPick(seg.id)} style={{ cursor: "pointer" }}>
            <text x={cx} y={cy - (seg.id === "F" ? 80 : 50)} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill={seg.color} fontWeight="600">{seg.id} · {seg.name}</text>
          </g>);

      })}
    </svg>);

}

// ====== Heatmap (cells x days) ======
function Heatmap({ rows, cols, getValue, colorFor, height = 110 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 3, height }}>
      {Array.from({ length: rows * cols }).map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const v = getValue(r, c);
        return <div key={i} title={`${v}`} style={{ background: colorFor(v), borderRadius: 2, height: "100%", minHeight: 8 }} />;
      })}
    </div>);

}

// ====== Stat-strip block (label + big number) ======
function Stat({ label, value, unit, delta, deltaDir, spark, sparkColor }) {
  return (
    <div className="kpi">
      <div className="kpi-label">
        <span>{label}</span>
      </div>
      <div className="kpi-value">
        {value}{unit && <span className="unit">{unit}</span>}
      </div>
      <div className="kpi-delta">
        {deltaDir === "up" && <span className="up" style={{ color: "var(--success)" }}>↑</span>}
        {deltaDir === "down" && <span className="down" style={{ color: "var(--critical)" }}>↓</span>}
        <span className={deltaDir === "up" ? "up" : deltaDir === "down" ? "down" : ""}
        style={{ color: deltaDir === "up" ? "var(--success)" : deltaDir === "down" ? "var(--critical)" : "var(--ink-2)" }}>
          {delta}
        </span>
        <span className="vs">vs. last 4 wks</span>
      </div>
      {spark &&
      <div className="kpi-spark">
          <Sparkline data={spark} color={sparkColor || "var(--ink-2)"} width={110} height={56} area="rgba(20,19,14,0.05)" />
        </div>
      }
    </div>);

}

window.Sparkline = Sparkline;
window.LineChart = LineChart;
window.ForecastChart = ForecastChart;
window.HBarList = HBarList;
window.StackedBar = StackedBar;
window.Donut = Donut;
window.ClusterScatter = ClusterScatter;
window.Heatmap = Heatmap;
window.Stat = Stat;