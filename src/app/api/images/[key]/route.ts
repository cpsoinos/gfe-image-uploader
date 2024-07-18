import { getRequestContext } from '@cloudflare/next-on-pages'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

type Params = {
  key: string
}

/**
 * Get a signed URL for uploading an object to the R2 bucket
 */
export async function PUT(request: NextRequest, context: { params: Params }) {
  const { env } = getRequestContext()
  const searchParams = request.nextUrl.searchParams
  const contentType = searchParams.get('contentType')
  if (!contentType) {
    return new Response('Missing contentType search param', { status: 400 })
  }

  const R2 = new S3Client({
    region: 'auto',
    endpoint: `https://${env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  })

  const signedUrl = await getSignedUrl(
    R2,
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: context.params.key,
      ContentType: contentType,
    }),
    {
      expiresIn: 3600,
    },
  )

  return new Response(signedUrl, { status: 200 })
}

/**
 * Delete an object from the R2 bucket
 *
 * @note
 * When running locally, this will not delete the object from the remote R2 bucket.
 * Instead, it will attempt to delete the object from the local R2 bucket storage emulator created by wrangler.
 */
export async function DELETE(_request: NextRequest, context: { params: Params }) {
  const { env } = getRequestContext()
  const R2 = env.R2_BUCKET
  const key = context.params.key
  await R2.delete(key)

  return new Response(null, { status: 204 })
}
