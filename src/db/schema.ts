import { integer, sqliteTable, text, primaryKey, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { id, timestamps } from './utils/common'
import type { WorkplaceInfo, LocationInfo, ImageTransformations } from '@/types'
import type { AdapterAccountType } from 'next-auth/adapters'
import type { Crop } from 'react-image-crop'

export const users = sqliteTable(
  'user',
  {
    id,
    ...timestamps,
    name: text('name').notNull(),
    email: text('email').notNull(),
    emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
    hashedPassword: text('hashedPassword'),
    image: text('image'),
    handle: text('handle'),
    workplace: text('workplace', { mode: 'json' }).$type<WorkplaceInfo>(),
    location: text('location', { mode: 'json' }).$type<LocationInfo>(),
    pronouns: text('pronouns'),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex('email_idx').on(table.email),
    }
  },
)

export type User = typeof users.$inferSelect // return type when queried
export type InsertUser = typeof users.$inferInsert // insert type

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
})

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
)

export const authenticators = sqliteTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: integer('credentialBackedUp', {
      mode: 'boolean',
    }).notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
)

export const profileImages = sqliteTable(
  'profileImage',
  {
    id,
    ...timestamps,
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    size: integer('size', { mode: 'number' }).notNull(),
    format: text('format', { enum: ['image/jpeg', 'image/png'] }).notNull(),
    crop: text('crop', { mode: 'json' }).$type<Crop>(),
    transformations: text('transformations', { mode: 'json' }).$type<ImageTransformations>(),
  },
  (table) => {
    return {
      userIdNameIdx: uniqueIndex('userId_name_idx').on(table.userId, table.name),
    }
  },
)

export type ProfileImage = typeof profileImages.$inferSelect // return type when queried
export type InsertProfileImage = typeof profileImages.$inferInsert // insert type
