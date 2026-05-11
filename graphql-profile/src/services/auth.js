const AUTH_URL = "https://learn.reboot01.com/api/auth/signin"

export async function login(identifier, password) {
  const encoded = btoa(`${identifier}:${password}`)

  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${encoded}`,
    },
  })

  if (!response.ok) {
    throw new Error("Invalid username/email or password")
  }

  const token = await response.json()
  localStorage.setItem("jwt", token)
  return token
}

export function getToken() {
  return localStorage.getItem("jwt")
}

export function logout() {
  localStorage.removeItem("jwt")
}

export function decodeToken() {
  const token = getToken()
  if (!token) return null
  try {
    const payload = token.split(".")[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}
