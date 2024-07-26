import { auth } from '@/auth'
import { combineMiddlewares } from './lib/middleware/combineMiddlewares'
import { corsMiddleware } from './lib/middleware/corsMiddleware'
import type { NextMiddleware } from 'next/server'

const combinedMiddleware = combineMiddlewares(auth as NextMiddleware, corsMiddleware)

export const middleware: NextMiddleware = async (req, event) => {
  const res = await combinedMiddleware(req, event)
  return res
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
