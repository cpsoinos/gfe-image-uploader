import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { drizzle } from 'drizzle-orm/d1'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import * as schema from './db/schema'
import { saltAndHashPassword, verifyPassword } from './lib/password'

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  //   const { env } = getRequestContext()
  //   const db = drizzle(env.DB)

  //   return {
  //     providers: [
  //       Credentials({
  //         // You can specify which fields should be submitted, by adding keys to the `credentials` object.
  //         // e.g. domain, username, password, 2FA token, etc.
  //         credentials: {
  //           username: { label: 'Email', type: 'email' },
  //           password: { label: 'Password', type: 'password' },
  //         },
  //         authorize: async (credentials) => {
  //           let user = null

  //           // logic to salt and hash password
  //           // const pwHash = (credentials.password)

  //           const pwHash = await saltAndHashPassword(credentials.password as string)

  //           // logic to verify if the user exists
  //           // user = await getUserFromDb(credentials.email, pwHash)
  //           // user = await db.select().from(users).where(eq(users.email, credentials.email))
  //           user = await db
  //             .select()
  //             .from(users)
  //             .where(and(eq(users.email, credentials.username as string), eq(users.password, pwHash)))

  //           if (!user) {
  //             // No user found, so this is their first attempt to login
  //             // meaning this is also the place you could do registration
  //             throw new Error('User not found.')
  //           }

  //           // return user object with their profile data
  //           return user
  //         },
  //       }),
  //     ],
  //   }
  // })

  // export const { handlers, signIn, signOut, auth } = NextAuth({

  const { env } = getRequestContext()
  const db = drizzle(env.DB, { schema })

  return {
    debug: true,
    adapter: DrizzleAdapter(db),
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
          // let user = null

          // logic to salt and hash password
          // const pwHash = (credentials.password)

          const pwHash = await saltAndHashPassword(credentials.password as string)

          // logic to verify if the user exists
          // user = await getUserFromDb(credentials.email, pwHash)
          // user = await db.select().from(users).where(eq(users.email, credentials.email))
          // user = await db
          //   .select()
          //   .from(users)
          //   .jo
          //   .where(and(eq(users.email, credentials.username as string), eq(users.password, pwHash)))
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
    },
  }
})

declare module 'next-auth' {
  interface Session {
    accessToken?: string
  }
}
