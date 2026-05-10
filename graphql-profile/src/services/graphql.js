const GRAPHQL_URL = "https://learn.reboot01.com/api/graphql-engine/v1/graphql"

export async function graphqlRequest(query, variables = {}) {
  const token = localStorage.getItem("jwt")


  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })


  const data = await response.json()
  console.log(data)
  if (data.errors) {
    throw new Error(data.errors[0].message)
  }

  return data.data
}