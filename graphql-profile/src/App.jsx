import { useState } from "react"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import { getToken, logout } from "./services/auth"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getToken()))

  function handleLogin() {
    setIsLoggedIn(true)
  }

  function handleLogout() {
    logout()
    setIsLoggedIn(false)
  }

  if (isLoggedIn) {
    return <ProfilePage onLogout={handleLogout} />
  }

  return <LoginPage onLogin={handleLogin} />
}