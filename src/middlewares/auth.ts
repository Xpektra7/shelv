import { createMiddleware } from '@tanstack/react-start'
import { auth } from '#/lib/auth'
import { redirect } from '@tanstack/react-router'
import { getRequestHeaders } from '@tanstack/react-start/server'

export const authFnMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw redirect({ to: '/login' })
    }

    return next({ context: { session } })
  },
)

export const authMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ request, next }) => {
    const url = new URL(request.url)

    // // console.log(`[${request.method}] : ${url.pathname}`)

    if (url.pathname.startsWith('/api/auth')) {
      return next()
    }

    if (
      !url.pathname.startsWith('/dashboard') &&
      !url.pathname.startsWith('/api/ai')
    ) {
      return next()
    }

    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw redirect({ to: '/login' })
    }

    return next({ context: { session } })
  },
)
