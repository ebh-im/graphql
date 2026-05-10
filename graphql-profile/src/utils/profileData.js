import { getProjectName } from "./format.js"

export function getTotalXP(transactions) {
  return transactions.reduce((sum, item) => sum + item.amount, 0)
}

export function getXPByProject(transactions) {
  const xpByProject = transactions.reduce((acc, item) => {
    const project = item.object?.name || getProjectName(item.path)

    if (!acc[project]) {
      acc[project] = 0
    }

    acc[project] += item.amount
    return acc
  }, {})

  return Object.entries(xpByProject)
    .map(([project, xp]) => ({ project, xp }))
    .sort((a, b) => b.xp - a.xp)
}

export function getPassFailCounts(progressData) {
  const gradedProgress = progressData.filter((item) => item.grade !== null)

  return {
    pass: gradedProgress.filter((item) => item.grade === 1).length,
    fail: gradedProgress.filter((item) => item.grade === 0).length,
  }
}

export function getAuditTotals(auditData) {
  const up = auditData
    .filter((item) => item.type === "up")
    .reduce((sum, item) => sum + item.amount, 0)

  const down = auditData
    .filter((item) => item.type === "down")
    .reduce((sum, item) => sum + item.amount, 0)

  return { up, down }
}