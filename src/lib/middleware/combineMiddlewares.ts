import { type NextMiddleware, NextResponse } from 'next/server'

export function combineMiddlewares(...middlewares: NextMiddleware[]): NextMiddleware {
  return async (req, event) => {
    for (const middleware of middlewares) {
      const response = await middleware(req, event)
      if (response) {
        // If a middleware returns a response, stop the chain and return that response
        return response
      }
    }
    return NextResponse.next()
  }
}
