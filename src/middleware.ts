import { combineMiddlewares } from './lib/middleware/combineMiddlewares'
import { corsMiddleware } from './lib/middleware/corsMiddleware'
import type { NextMiddleware } from 'next/server'

const combinedMiddleware = combineMiddlewares(corsMiddleware)

export const middleware: NextMiddleware = async (req, event) => {
  const res = await combinedMiddleware(req, event)
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
