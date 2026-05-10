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
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </div>
  )
}
