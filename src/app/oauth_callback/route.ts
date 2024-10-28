import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  if (!code) return NextResponse.json({ status: 400 })
  const token = await exchangeCodeForToken(code)
  if (!token) {
    return NextResponse.json({ status: 400 })
  }
  const user = await fetchUser(token)
  return NextResponse.json({
    message: `received code: ${code} and exchanged it for token ${token} then fetched user: ${JSON.stringify(
      user
    )}`
  })
}

export async function fetchUser(token: string): Promise<any | null> {
  const GITHUB_USER_URL = "https://api.github.com/user"
  try {
    const response = await fetch(GITHUB_USER_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    })
    if (!response.ok) {
      const error = await response.json()
      console.error("error fetching user info:", error)
      return null
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("error during fetch:", error)
    return null
  }
}

export async function exchangeCodeForToken(
  code: string
): Promise<string | null> {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
  const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error(
      "couldn't read GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET from .env. look into it, ye?"
    )
  }
  const body = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    code
  })
  try {
    const response = await fetch(GITHUB_TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString()
    })
    if (!response.ok) {
      const error = await response.json()
      console.error("error exchanging code for token:", error)
      return null
    }
    const data = await response.json()
    return data.access_token // Return the access token
  } catch (error) {
    console.error("error during fetch:", error)
    return null
  }
}
