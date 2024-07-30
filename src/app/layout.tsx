import './globals.css'
import dynamic from 'next/dynamic'
import { twJoin } from 'tailwind-merge'
import { Credits } from '@/components/Credits/Credits'
import { PHProvider } from '@/contexts/PostHogContext'
import { notoSans } from '@/lib/fonts'
import { getUserId } from '@/lib/getUserId'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const runtime = 'edge'

const PostHogPageView = dynamic(() => import('@/components/PostHog/PostHogPageView'), {
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
  const userId = getUserId()

  return (
    <html lang="en" className="h-dvh">
      <PHProvider userId={userId}>
        <body className={twJoin('h-full', notoSans.className)}>
          <PostHogPageView />
          {children}
          <Credits />
        </body>
      </PHProvider>
    </html>
  )
}
