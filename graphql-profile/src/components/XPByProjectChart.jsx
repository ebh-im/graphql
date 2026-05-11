import { formatXP } from "../utils/format.js"

export default function XPByProjectChart({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="chart-card">
        <h2 className="chart-title">XP by Project</h2>
        <p className="chart-subtitle">No project XP data available.</p>
      </div>
    )
  }

  const top5 = projects.slice(0, 5)

  const width = 800
  const barHeight = 34
  const gap = 14
  const padding = 60
  const height = padding * 2 + top5.length * (barHeight + gap)

  const maxXP = Math.max(...top5.map((project) => project.xp))

  return (
    <div className="chart-card">
      <h2 className="chart-title">XP by Project</h2>
      <p className="chart-subtitle" style={{ marginBottom: "1.5rem" }}>
        This chart shows how much XP you earned from each project.
      </p>

      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
        {top5.map((project, index) => {
          const y = padding + index * (barHeight + gap)
          const barWidth = (project.xp / maxXP) * (width - padding * 2)

          return (
            <g key={project.project}>
              <text
                x={padding}
                y={y - 8}
                fill="#cbd5e1"
                fontSize="13"
              >
                {project.project}
              </text>

              <rect
                x={padding}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="8"
                fill="#38bdf8"
              />

              <text
                x={padding + barWidth + 10}
                y={y + 22}
                fill="#94a3b8"
                fontSize="13"
              >
                {formatXP(project.xp)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
