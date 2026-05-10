import { useState } from "react"

export default function LoginForm({ onSubmit, loading, error }) {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(identifier, password)
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1 className="login-form__title">Login</h1>

      <input
        type="text"
        placeholder="Username or Email"
        value={identifier}
        onChange={(event) => setIdentifier(event.target.value)}
        className="login-form__input"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="login-form__input"
        required
      />

      {error && <p className="login-form__error">{error}</p>}

      <button type="submit" disabled={loading} className="login-form__btn">
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  )
}
