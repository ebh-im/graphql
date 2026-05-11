import { getProjectName } from "./format.js"

export function getTotalXP(transactions) {
  return transactions.reduce((sum, t) => sum + t.amount, 0)
}

export function getXPByProject(transactions) {
  const map = transactions.reduce((acc, t) => {
    const name = t.object?.name || getProjectName(t.path)
    acc[name] = (acc[name] || 0) + t.amount
    return acc
  }, {})

  return Object.entries(map)
    .map(([project, xp]) => ({ project, xp }))
    .sort((a, b) => b.xp - a.xp)
}

export function getAuditTotals(auditData) {
  const up = auditData
    .filter((t) => t.type === "up")
    .reduce((sum, t) => sum + t.amount, 0)

  const down = auditData
    .filter((t) => t.type === "down")
    .reduce((sum, t) => sum + t.amount, 0)

  return { up, down }
}

export function getLatestActivity(transactions) {
  if (!transactions.length) return null
  return transactions[transactions.length - 1].createdAt
}
