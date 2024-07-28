'use server'

import { getRequestContext } from '@cloudflare/next-on-pages'
import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { auth } from '@/auth'
import { profileImages, type ProfileImage } from '@/db/schema'

export async function updateProfileImage(
  image: Pick<ProfileImage, 'id' | 'crop' | 'transformations'>,
) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const { env } = getRequestContext()
  const db = drizzle(env.DB)

  return await db
    .update(profileImages)
    .set({
      crop: image.crop,
      transformations: image.transformations,
    })
    .where(and(eq(profileImages.userId, session.user.id), eq(profileImages.id, image.id)))
    .returning()
}
