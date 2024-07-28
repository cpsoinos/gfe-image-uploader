import { ErrorView } from '@/components/ErrorView/ErrorView'

export const runtime = 'edge'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <ErrorView
        title="Not found"
        description="Could not find requested resource."
        link={{ href: '/', text: 'Return home' }}
      />
    </div>
  )
}
