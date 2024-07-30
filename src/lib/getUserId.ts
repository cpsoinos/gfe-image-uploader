import { cookies } from 'next/headers'

const UNIQUE_IDENTIFIER_COOKIE = `ph_${process.env.NEXT_PUBLIC_POSTHOG_KEY}_posthog`

export const getUserId = (): string => {
  const phCookie = cookies().get(UNIQUE_IDENTIFIER_COOKIE)?.value
  if (!phCookie) {
    return crypto.randomUUID()
  }
  return JSON.parse(phCookie).distinct_id
}
