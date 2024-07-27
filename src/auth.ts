import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { drizzle } from 'drizzle-orm/d1'
import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import * as schema from './db/schema'
import { saltAndHashPassword, verifyPassword } from './lib/password'

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  const { env } = getRequestContext()
  const db = drizzle(env.DB, { schema })

  const adapter = DrizzleAdapter(db)

  return {
    // debug: true,
    adapter,
    providers: [
      GitHub,
      Credentials({
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
          username: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        authorize: async (credentials) => {
          const pwHash = await saltAndHashPassword(credentials.password as string)

          // logic to verify if the user exists
          const user = await db.query.users.findFirst({
            where: (users, { and, eq, isNotNull }) =>
              and(eq(users.email, credentials.username as string), isNotNull(users.hashedPassword)),
          })

          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error('User not found.')
          }

          const passwordMatches = await verifyPassword(
            user?.hashedPassword as string,
            credentials.password as string,
          )

          if (!passwordMatches) {
            throw new Error('Password does not match')
          }

          // return user object with their profile data
          return user
        },
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
