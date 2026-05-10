import { useState } from "react"

export default function XPOverTimeChart({ transactions }) {
  const [hoveredPoint, setHoveredPoint] = useState(null)

  if (!transactions || transactions.length === 0) {
    return (
      <div className="chart-card">
        <h2 className="chart-title">XP Over Time</h2>
        <p className="chart-subtitle">No XP data available.</p>
      </div>
    )
  }

  const width = 800
  const height = 360
  const padding = 60

  function formatXP(value) {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} MB`
    }

    if (value >= 1000) {
      return `${Math.round(value / 1000)} KB`
    }

    return `${value} B`
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  let runningTotal = 0

  const points = transactions.map((transaction, index) => {
    runningTotal += transaction.amount

    const x =
      padding +
      (index / (transactions.length - 1 || 1)) *
        (width - padding * 2)

    return {
      x,
      amount: transaction.amount,
      xp: runningTotal,
      date: transaction.createdAt,
      path: transaction.path,
    }
  })

  const maxXp = Math.max(...points.map((point) => point.xp))

  const pointsWithPosition = points.map((point) => {
    const y =
      height -
      padding -
      (point.xp / maxXp) * (height - padding * 2)

    return {
      ...point,
      y,
    }
  })

  const linePoints = pointsWithPosition
    .map((point) => `${point.x},${point.y}`)
    .join(" ")

  const gridLines = [0, 25, 50, 75, 100]

  const firstDate = formatDate(transactions[0].createdAt)
  const lastDate = formatDate(transactions[transactions.length - 1].createdAt)

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h2 className="chart-title">XP Over Time</h2>
        <p className="chart-subtitle">
          This graph shows your cumulative XP growth from {firstDate} to{" "}
          {lastDate}.
        </p>
      </div>

      <div className="chart-relative">
        {hoveredPoint && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
              transform: "translate(-50%, -120%)",
            }}
          >
            <p className="chart-tooltip__title">
              Total XP: {formatXP(hoveredPoint.xp)}
            </p>

            <p className="chart-tooltip__detail">
              Earned: {formatXP(hoveredPoint.amount)}
            </p>

            <p className="chart-tooltip__detail">
              Date: {formatDate(hoveredPoint.date)}
            </p>
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
          {gridLines.map((percent) => {
            const y =
              height -
              padding -
              (percent / 100) * (height - padding * 2)

            const labelValue = Math.round((maxXp * percent) / 100)

            return (
              <g key={percent}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="4 4"
                />

                <text
                  x={padding - 12}
                  y={y + 4}
                  fill="#94a3b8"
                  fontSize="12"
                  textAnchor="end"
                >
                  {formatXP(labelValue)}
                </text>
              </g>
            )
          })}

          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#64748b"
          />

          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#64748b"
          />

          <polyline
            points={linePoints}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {pointsWithPosition.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === point ? 6 : 4}
              fill="#38bdf8"
              stroke="#0f172a"
              strokeWidth="2"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          <text
            x={padding}
            y={height - 20}
            fill="#94a3b8"
            fontSize="12"
          >
            {firstDate}
          </text>

          <text
            x={width - padding}
            y={height - 20}
            fill="#94a3b8"
            fontSize="12"
            textAnchor="end"
          >
            {lastDate}
          </text>
        </svg>
      </div>
    </div>
  )
}
