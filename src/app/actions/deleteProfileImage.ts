'use server'

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { auth } from '@/auth'
import { profileImages } from '@/db/schema'
import * as schema from '@/db/schema'

/**
 * Delete a profileImage record from D1 db,
 * and delete the corresponding object from the R2 bucket
 */
export async function deleteProfileImage(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const { env } = getRequestContext()
  const db = drizzle(env.DB, { schema })

  const profileImage = await db.query.profileImages.findFirst({
    where: (profileImages, { and, eq }) =>
      and(eq(profileImages.id, id), eq(profileImages.userId, session.user.id)),
  })
  if (!profileImage) {
    throw new Error('Profile image not found')
  }

  const promises = []

  promises.push(
    db
      .delete(profileImages)
      .where(and(eq(profileImages.id, id), eq(profileImages.userId, session.user.id))),
  )

  const key = `${profileImage.userId}/${profileImage.name}`

  const R2 = new S3Client({
    region: 'auto',
    endpoint: `https://${env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  })

  promises.push(
    R2.send(
      new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
      }),
    ),
  )

  await Promise.all(promises)
}
