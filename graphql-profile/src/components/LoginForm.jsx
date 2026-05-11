import { useState } from "react"

export default function LoginForm({ onSubmit, loading, error }) {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(identifier, password)
  }

  return (
    <form onSubmit={handleSubmit} className="login-form" noValidate>
      <h1 className="login-form__title">Welcome back</h1>
      <p className="login-form__subtitle">Sign in to your Reboot01 profile</p>

      <div className="login-form__field">
        <label htmlFor="identifier" className="login-form__label">
          Username or Email
        </label>
        <input
          id="identifier"
          type="text"
          placeholder="e.g. jdoe or jdoe@school.com"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="login-form__input"
          autoComplete="username"
          required
        />
      </div>

      <div className="login-form__field">
        <label htmlFor="password" className="login-form__label">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-form__input"
          autoComplete="current-password"
          required
        />
      </div>

      {error && (
        <p className="login-form__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="login-form__btn">
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  )
}
