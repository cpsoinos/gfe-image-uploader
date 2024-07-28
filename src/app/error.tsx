'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { ErrorView } from '@/components/ErrorView/ErrorView'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <ErrorView
        title="Unexpected error"
        description="We're facing some issues at the moment. Please try again later or contact support at"
        link={{ href: 'mailto:info@anderapps.com', text: 'info@anderapps.com' }}
      />
    </div>
  )
}
