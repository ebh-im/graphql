import { useState } from "react"
import LoginForm from "../components/LoginForm"
import { login } from "../services/auth"

export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(identifier, password) {
    setLoading(true)
    setError("")

    try {
      await login(identifier, password)
      onLogin()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Decorative glass shapes */}
      <div className="glass-shapes" aria-hidden="true">
        <div className="glass-shape glass-shape--1" />
        <div className="glass-shape glass-shape--2" />
        <div className="glass-shape glass-shape--3" />
        <div className="glass-shape glass-shape--4" />
        <div className="glass-shape glass-shape--5" />
      </div>

      <div className="login-page__brand">
        <h1 className="login-page__brand-title">
          Reboot<span>01</span>
        </h1>
        <p className="login-page__brand-sub">Student Profile Dashboard</p>
      </div>

      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  )
}
