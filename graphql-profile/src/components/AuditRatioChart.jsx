import { formatXP } from "../utils/format.js"

export default function AuditRatioChart({ up, down }) {
  if (!up && !down) {
    return (
      <div className="chart-card">
        <h2 className="chart-title">Audit Ratio</h2>
        <p className="chart-subtitle">No audit data available.</p>
      </div>
    )
  }

  const width = 800
  const height = 360
  const padding = { left: 160, right: 160, top: 106, bottom: 60 }
  const barHeight = 54
  const gap = 40
  const availableWidth = width - padding.left - padding.right
  const total = up + down

  const ratio = down === 0 ? null : up / down
  const ratioText = ratio === null ? "N/A" : ratio.toFixed(1)
  const ratioColor = ratio === null ? "#94a3b8" : ratio >= 1 ? "#4ade80" : "#f87171"

  // bar track = max(up, down); each fill shows how far that value reaches
  const max = Math.max(up, down)
  const doneWidth = max === 0 ? 0 : (up / max) * availableWidth
  const receivedWidth = max === 0 ? 0 : (down / max) * availableWidth

  const doneY = padding.top
  const receivedY = padding.top + barHeight + gap

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h2 className="chart-title">Audit Ratio</h2>
        <p className="chart-subtitle">
          Compares the XP volume of audits you have done versus audits you have
          received.
        </p>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
        {/* ── Done bar ── */}
        <text
          x={padding.left - 12}
          y={doneY + barHeight / 2 + 5}
          fill="#94a3b8"
          fontSize="14"
          textAnchor="end"
        >
          Done
        </text>

        <rect
          x={padding.left}
          y={doneY}
          width={availableWidth}
          height={barHeight}
          rx="8"
          fill="#1e293b"
        />

        <rect
          x={padding.left}
          y={doneY}
          width={doneWidth}
          height={barHeight}
          rx="8"
          fill="#38bdf8"
        />

        <text
          x={padding.left + availableWidth + 12}
          y={doneY + barHeight / 2 + 5}
          fill="#38bdf8"
          fontSize="13"
          fontWeight="600"
        >
          {formatXP(up)}
        </text>

        {/* ── Received bar ── */}
        <text
          x={padding.left - 12}
          y={receivedY + barHeight / 2 + 5}
          fill="#94a3b8"
          fontSize="14"
          textAnchor="end"
        >
          Received
        </text>

        <rect
          x={padding.left}
          y={receivedY}
          width={availableWidth}
          height={barHeight}
          rx="8"
          fill="#1e293b"
        />

        <rect
          x={padding.left}
          y={receivedY}
          width={receivedWidth}
          height={barHeight}
          rx="8"
          fill="#a78bfa"
        />

        <text
          x={padding.left + availableWidth + 12}
          y={receivedY + barHeight / 2 + 5}
          fill="#a78bfa"
          fontSize="13"
          fontWeight="600"
        >
          {formatXP(down)}
        </text>

        {/* ── Ratio badge ── */}
        <text
          x={width / 2}
          y={height - 24}
          fill="#64748b"
          fontSize="13"
          textAnchor="middle"
        >
          Ratio:{"  "}
          <tspan fill={ratioColor} fontWeight="700" fontSize="15">
            {ratioText}
          </tspan>
        </text>
      </svg>
    </div>
  )
}
