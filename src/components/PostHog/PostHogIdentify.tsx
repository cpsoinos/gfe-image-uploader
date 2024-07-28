'use client'

import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import type { User } from '@/db/schema'

export default function PostHogIdentify({ user }: { user?: User }): null {
  const posthog = usePostHog()

  useEffect(() => {
    if (user) {
      // Identify sends an event, so you want may want to limit how often you call it
      posthog?.identify(user.id, {
        email: user.email,
      })
    }
  }, [posthog, user])

  return null
}
