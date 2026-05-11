export function formatXP(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)} MB`
  if (value >= 1000) return `${Math.round(value / 1000)} KB`
  return `${value} B`
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function getProjectName(path) {
  return path.split("/").pop()
}
