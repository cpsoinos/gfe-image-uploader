import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import type { ImageTransformations } from '@/types'
import type { Crop } from 'react-image-crop'

export const profileImages = sqliteTable(
  'profile_images',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$type<Date>(),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
      .$type<Date>(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
    size: integer('size', { mode: 'number' }).notNull(),
    format: text('format', { enum: ['image/jpeg', 'image/png'] }).notNull(),
    crop: text('crop', { mode: 'json' }).$type<Crop>(),
    transformations: text('transformations', { mode: 'json' }).$type<ImageTransformations>(),
    selected: integer('selected', { mode: 'boolean' }).notNull().default(false),
  },
  (table) => {
    return {
      userIdNameIdx: uniqueIndex('userId_name_idx').on(table.userId, table.name),
      selectedByUserIdx: uniqueIndex('selected_by_user_idx')
        .on(table.userId, table.selected)
        .where(sql`profile_images.selected = 1`),
    }
  },
)

export type ProfileImage = typeof profileImages.$inferSelect // return type when queried
export type InsertProfileImage = typeof profileImages.$inferInsert // insert type
