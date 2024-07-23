import './globals.css'
import { Credits } from '@/components/Credits/Credits'
import { notoSans } from '@/lib/fonts'
import type { Metadata } from 'next'

export const runtime = 'edge'

export const metadata: Metadata = {
  title: 'Image Uploader',
  description: 'A challenge by GreatFrontEnd Projects. Built by Corey Psoinos.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={notoSans.className}>
        {children}
        <Credits />
      </body>
    </html>
  )
}
