import './globals.css'
import dynamic from 'next/dynamic'
import { Credits } from '@/components/Credits/Credits'
import { PHProvider } from '@/contexts/PostHogContext'
import { notoSans } from '@/lib/fonts'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const runtime = 'edge'

const PostHogPageView = dynamic(() => import('@/components/PostHogPageView/PostHogPageView'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Image Uploader',
  description: 'A challenge by GreatFrontEnd Projects. Built by Corey Psoinos.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <PHProvider>
        <body className={notoSans.className}>
          <PostHogPageView />
          {children}
          <Credits />
        </body>
      </PHProvider>
    </html>
  )
}
