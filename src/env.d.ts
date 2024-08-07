interface CloudflareEnv {
  DB: D1Database
  R2_BUCKET: R2Bucket
  R2_ACCESS_KEY_ID: string
  R2_SECRET_ACCESS_KEY: string
  CF_ACCOUNT_ID: string
  R2_BUCKET_NAME: string
  NEXT_PUBLIC_R2_BASE_URL: string
  NEXT_PUBLIC_TRANSFORM_BASE_URL: string
  NEXT_PUBLIC_POSTHOG_KEY: string
  NEXT_PUBLIC_POSTHOG_HOST: string
}
