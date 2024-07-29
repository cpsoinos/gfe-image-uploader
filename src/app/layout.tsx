import './globals.css'
import dynamic from 'next/dynamic'
import { twJoin } from 'tailwind-merge'
import { auth } from '@/auth'
import { Credits } from '@/components/Credits/Credits'
import { PHProvider } from '@/contexts/PostHogContext'
import { notoSans } from '@/lib/fonts'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const runtime = 'edge'

const PostHogPageView = dynamic(() => import('@/components/PostHog/PostHogPageView'), {
  ssr: false,
})

const PostHogIdentify = dynamic(() => import('@/components/PostHog/PostHogIdentify'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Image Uploader',
  description: 'A challenge by GreatFrontEnd Projects. Built by Corey Psoinos.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const session = await auth()
  const user = session?.user

  return (
    <html lang="en" className="h-full">
      <PHProvider>
        <body className={twJoin('h-full', notoSans.className)}>
          <PostHogIdentify user={user} />
          <PostHogPageView />
          {children}
          <Credits />
        </body>
      </PHProvider>
    </html>
  )
}
