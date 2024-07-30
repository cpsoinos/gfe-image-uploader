'use server'

import { getRequestContext } from '@cloudflare/next-on-pages'
import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { profileImages, type ProfileImage } from '@/db/schema'
import { getUserId } from '@/lib/getUserId'

export async function updateProfileImage(
  image: Pick<ProfileImage, 'id' | 'crop' | 'transformations'>,
) {
  const userId = getUserId()

  const { env } = getRequestContext()
  const db = drizzle(env.DB)

  return await db
    .update(profileImages)
    .set({
      crop: image.crop,
      transformations: image.transformations,
    })
    .where(and(eq(profileImages.userId, userId), eq(profileImages.id, image.id)))
    .returning()
}
