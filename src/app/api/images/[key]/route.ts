import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { auth } from '@/auth'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

type Params = {
  key: string
}

/**
 * Get a signed URL for uploading an object to the R2 bucket
 */
export async function PUT(request: NextRequest, context: { params: Params }) {
  const session = await auth()
  if (!session?.user) return new Response(null, { status: 401 })

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
      Key: `${session?.user.id}/${context.params.key}`,
      ContentType: contentType,
    }),
    {
      expiresIn: 3600,
    },
  )

  return new Response(signedUrl, { status: 200 })
}
