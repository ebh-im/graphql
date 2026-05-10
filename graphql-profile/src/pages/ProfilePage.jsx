import { useEffect, useState } from "react"
import { graphqlRequest } from "../services/graphql.js"
import XPOverTimeChart from "../components/XPOverTimeChart.jsx"
import XPByProjectChart from "../components/XPByProjectChart.jsx"
import InfoCard from "../components/InfoCard.jsx"
import { formatXP } from "../utils/format.js"

import {
  getAuditTotals,
  getPassFailCounts,
  getTotalXP,
  getXPByProject,
} from "../utils/profileData.js"

const USER_QUERY = `
  query {
    user {
      id
      login
    }
  }
`

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

const PROGRESS_QUERY = `
  query {
    progress {
      grade
      createdAt
      path
    }
  }
`

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
  const [progressData, setProgressData] = useState([])
  const [auditData, setAuditData] = useState([])

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const userData = await graphqlRequest(USER_QUERY)
        const xpData = await graphqlRequest(XP_QUERY)
        const projectXPData = await graphqlRequest(XP_PROJECT_QUERY)
        const progressRes = await graphqlRequest(PROGRESS_QUERY)
        const auditRes = await graphqlRequest(AUDIT_QUERY)

        setUser(userData.user[0])
        setXpTransactions(xpData.transaction)
        setProjectTransactions(projectXPData.transaction)
        setProgressData(progressRes.progress)
        setAuditData(auditRes.transaction)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const totalXP = getTotalXP(xpTransactions)
  const xpByProject = getXPByProject(projectTransactions)
  const { pass, fail } = getPassFailCounts(progressData)
  const { up, down } = getAuditTotals(auditData)

  return (
    <div className="profile-page">
      <div className="profile-top-bar">
        <div>
          <h1 className="profile-top-bar__title">My Profile</h1>
          <p className="profile-top-bar__subtitle">GraphQL student dashboard</p>
        </div>

        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {loading && <p className="loading-text">Loading your profile...</p>}

      {error && <p className="error-text">{error}</p>}

      {user && !loading && !error && (
        <>
          <div className="basic-info">
            <h2 className="basic-info__title">Basic Information</h2>

            <div className="basic-info__grid">
              <p className="basic-info__item">
                <span className="basic-info__label">ID:</span> {user.id}
              </p>

              <p className="basic-info__item">
                <span className="basic-info__label">Login:</span> {user.login}
              </p>
            </div>
          </div>

          <div className="stats-grid">
            <InfoCard
              title="Total XP"
              value={formatXP(totalXP)}
              description="All XP transactions combined"
            />

            <InfoCard
              title="PASS"
              value={pass}
              description="Completed projects"
            />

            <InfoCard
              title="FAIL"
              value={fail}
              description="Failed attempts"
            />

            <InfoCard
              title="Audit ratio"
              value={down === 0 ? "N/A" : (up / down).toFixed(1)}
              description="Audit up divided by audit down"
            />
          </div>

          <XPOverTimeChart transactions={xpTransactions} />

          <XPByProjectChart projects={xpByProject} />
        </>
      )}
    </div>
  )
}
