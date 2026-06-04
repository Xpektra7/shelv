import { createAuthClient } from 'better-auth/react'

const baseURL = import.meta.env.VITE_BETTER_AUTH_URL ?? window.location.origin

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL,
})
