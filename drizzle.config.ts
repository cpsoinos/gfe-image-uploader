import type { Config } from 'drizzle-kit'

const { LOCAL_DB_PATH, CF_DB_ID, CF_D1_TOKEN, CF_ACCOUNT_ID } = process.env

// Use better-sqlite driver for local development
export default LOCAL_DB_PATH
  ? ({
      schema: './src/db/*.ts',
      dialect: 'sqlite',
      out: './drizzle',
      dbCredentials: {
        url: LOCAL_DB_PATH,
      },
    } satisfies Config)
  : ({
      schema: './src/db/*.ts',
      out: './drizzle',
      dialect: 'sqlite',
      driver: 'd1-http',
      dbCredentials: {
        databaseId: CF_DB_ID!,
        token: CF_D1_TOKEN!,
        accountId: CF_ACCOUNT_ID!,
      },
    } satisfies Config)
