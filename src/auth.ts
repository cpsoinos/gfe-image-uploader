import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { drizzle } from 'drizzle-orm/d1'
import NextAuth, { type DefaultSession } from 'next-auth'
import Auth0 from 'next-auth/providers/auth0'
import GitHub from 'next-auth/providers/github'
import * as schema from './db/schema'

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  const { env } = getRequestContext()
  const db = drizzle(env.DB, { schema })

  const adapter = DrizzleAdapter(db)

  return {
    adapter,
    providers: [
      GitHub,
      Auth0({
        issuer: 'https://gfe-image-uploader.us.auth0.com',
      }),
    ],
    callbacks: {
      async authorized({ auth }) {
        // Logged in users are authenticated, otherwise redirect to login page
        return !!auth?.user
      },
      async session({ session, user }) {
        const userFromDb = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, user.id),
        })

        session.user = userFromDb!
        return session
      },
    },
  }
})

declare module 'next-auth' {
  interface Session {
    user: schema.User & DefaultSession['user']
  }
}
