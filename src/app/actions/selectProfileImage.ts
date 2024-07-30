'use server'

import { getRequestContext } from '@cloudflare/next-on-pages'
import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { profileImages } from '@/db/schema'
import { getUserId } from '@/lib/getUserId'

/**
 * Update a user's selected profile image.
 * This requires a database "transaction" (D1 uses the batch api instead)
 * to ensure that only one image is selected at a time.
 */
export const selectProfileImage = async (imageId: string) => {
  const userId = getUserId()

  const { env } = getRequestContext()
  const db = drizzle(env.DB)

  await db.batch([
    db
      .update(profileImages)
      .set({ selected: false })
      .where(and(eq(profileImages.userId, userId), eq(profileImages.selected, true))),
    db
      .update(profileImages)
      .set({ selected: true })
      .where(and(eq(profileImages.userId, userId), eq(profileImages.id, imageId))),
  ])
}
