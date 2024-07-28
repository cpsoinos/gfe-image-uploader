'use server'

import { getRequestContext } from '@cloudflare/next-on-pages'
import { drizzle } from 'drizzle-orm/d1'
import { auth } from '@/auth'
import { profileImages, type InsertProfileImage } from '@/db/schema'

export async function createProfileImage(
  image: Pick<InsertProfileImage, 'name' | 'size' | 'format'>,
) {
  const session = await auth()
  const { env } = getRequestContext()
  const db = drizzle(env.DB)

  return await db
    .insert(profileImages)
    .values({
      userId: session!.user.id,
      ...image,
    })
    .returning({ insertedId: profileImages.id })
    .onConflictDoNothing()
}
