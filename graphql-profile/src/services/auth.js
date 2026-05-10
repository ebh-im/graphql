const AUTH_URL = "https://learn.reboot01.com/api/auth/signin"

export async function login(identifier, password) {
  const credentials = `${identifier}:${password}`
  const encodedCredentials = btoa(credentials)

  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
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