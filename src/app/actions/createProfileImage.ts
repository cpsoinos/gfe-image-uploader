'use server'

import { getRequestContext } from '@cloudflare/next-on-pages'
import { drizzle } from 'drizzle-orm/d1'
import { profileImages, type InsertProfileImage } from '@/db/schema'
import { getUserId } from '@/lib/getUserId'

export async function createProfileImage(
  image: Pick<InsertProfileImage, 'name' | 'size' | 'format'>,
) {
  const userId = getUserId()
  if (!userId) {
    throw new Error('User not authenticated')
  }
  const { env } = getRequestContext()
  const db = drizzle(env.DB)

  return await db
    .insert(profileImages)
    .values({
      userId,
      ...image,
    })
    .returning({ insertedId: profileImages.id })
    .onConflictDoNothing()
}
