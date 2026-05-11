import { useState } from "react"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import AnimatedBackground from "./components/AnimatedBackground"
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

  return (
    <>
      <AnimatedBackground />
      <div className="app-content">
        {isLoggedIn
          ? <ProfilePage onLogout={handleLogout} />
          : <LoginPage onLogin={handleLogin} />
        }
      </div>
    </>
  )
}
