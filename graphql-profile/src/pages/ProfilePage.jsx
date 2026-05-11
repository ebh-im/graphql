import { useEffect, useState } from "react"
import { graphqlRequest } from "../services/graphql.js"
import XPOverTimeChart from "../components/XPOverTimeChart.jsx"
import XPByProjectChart from "../components/XPByProjectChart.jsx"
import AuditRatioChart from "../components/AuditRatioChart.jsx"
import CardSlider from "../components/CardSlider.jsx"
import { formatXP, formatDate } from "../utils/format.js"
import {
  getAuditTotals,
  getTotalXP,
  getXPByProject,
  getLatestActivity,
} from "../utils/profileData.js"

// ── 1. Normal query ────────────────────────────────────────────
const USER_QUERY = `
  query {
    user {
      id
      login
    }
  }
`

// ── 2. Query with arguments (where + order_by) ─────────────────
const XP_QUERY = `
  query {
    transaction(
      where: { type: { _eq: "xp" } }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      path
    }
  }
`

// ── 3. Nested query (transaction → object) ─────────────────────
const XP_PROJECT_QUERY = `
  query {
    transaction(
      where: {
        type: { _eq: "xp" }
        object: { type: { _eq: "project" } }
      }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      path
      object {
        id
        name
        type
      }
    }
  }
`

// ── 4. Nested query (result → user) — per assignment example ───
const RESULT_QUERY = `
  query {
    result(
      order_by: { createdAt: desc }
      limit: 5
    ) {
      id
      grade
      createdAt
      path
      user {
        id
        login
      }
    }
  }
`

// ── 5. Arguments query ─────────────────────────────────────────
const AUDIT_QUERY = `
  query {
    transaction(
      where: { type: { _in: ["up", "down"] } }
    ) {
      type
      amount
    }
  }
`

export default function ProfilePage({ onLogout }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [xpTransactions, setXpTransactions] = useState([])
  const [projectTransactions, setProjectTransactions] = useState([])
  const [auditData, setAuditData] = useState([])
  const [recentResults, setRecentResults] = useState([])

  useEffect(() => {
    async function fetchAll() {
      try {
        const [userData, xpData, projectXPData, auditRes, resultRes] =
          await Promise.all([
            graphqlRequest(USER_QUERY),
            graphqlRequest(XP_QUERY),
            graphqlRequest(XP_PROJECT_QUERY),
            graphqlRequest(AUDIT_QUERY),
            graphqlRequest(RESULT_QUERY),
          ])

        setUser(userData.user[0])
        setXpTransactions(xpData.transaction)
        setProjectTransactions(projectXPData.transaction)
        setAuditData(auditRes.transaction)
        setRecentResults(resultRes.result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const totalXP = getTotalXP(xpTransactions)
  const xpByProject = getXPByProject(projectTransactions)
  const { up, down } = getAuditTotals(auditData)
  const latestActivity = getLatestActivity(xpTransactions)
  const auditRatio = down === 0 ? "N/A" : (up / down).toFixed(1)

  return (
    <div className="profile-page">
      {/* Top bar */}
      <div className="profile-top-bar">
        <div>
          <h1 className="profile-top-bar__title">My Profile</h1>
          <p className="profile-top-bar__subtitle">Reboot01 · GraphQL Dashboard</p>
        </div>
        <button onClick={onLogout} className="logout-btn">
          Log out
        </button>
      </div>

      {loading && <p className="loading-text">Loading your profile…</p>}
      {error && <p className="error-text" role="alert">{error}</p>}

      {user && !loading && !error && (
        <>
          {/* Pinned identity card */}
          <div className="basic-info">
            <p className="basic-info__title">Account</p>
            <div className="basic-info__grid">
              <div className="basic-info__item">
                <span className="basic-info__label">Login</span>
                <span className="basic-info__value">{user.login}</span>
              </div>
              <div className="basic-info__item">
                <span className="basic-info__label">User ID</span>
                <span className="basic-info__value">#{user.id}</span>
              </div>
              <div className="basic-info__item">
                <span className="basic-info__label">Campus</span>
                <span className="basic-info__value">Reboot01</span>
              </div>
              <div className="basic-info__item">
                <span className="basic-info__label">Last Activity</span>
                <span className="basic-info__value">
                  {latestActivity ? formatDate(latestActivity) : "—"}
                </span>
              </div>
              <div className="basic-info__item">
                <span className="basic-info__label">Total XP</span>
                <span className="basic-info__value">{formatXP(totalXP)}</span>
              </div>
              <div className="basic-info__item">
                <span className="basic-info__label">Audit Ratio</span>
                <span className="basic-info__value">{auditRatio}</span>
              </div>
            </div>
          </div>

          <CardSlider>
          {/* Slide 1 — XP Over Time */}
          <XPOverTimeChart transactions={xpTransactions} />

          {/* Slide 3 — XP By Project */}
          <XPByProjectChart projects={xpByProject} />

          {/* Slide 4 — Audit Ratio */}
          <AuditRatioChart up={up} down={down} />

          {/* Slide 5 — Recent Results */}
          <div className="recent-results">
            <h2 className="recent-results__title">Recent Results</h2>
            <div className="recent-results__body">
              <ul className="recent-results__list">
                {recentResults.map((r) => (
                  <li key={r.id} className="recent-results__item">
                    <span className="recent-results__path">
                      {r.path.split("/").pop() || r.path}
                    </span>
                    <span
                      className={`recent-results__grade ${
                        r.grade >= 1
                          ? "recent-results__grade--pass"
                          : "recent-results__grade--fail"
                      }`}
                    >
                      {r.grade >= 1 ? "PASS" : "FAIL"}
                    </span>
                    <span className="recent-results__date">
                      {formatDate(r.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </CardSlider>
        </>
      )}
    </div>
  )
}
