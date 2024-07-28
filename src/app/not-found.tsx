import { Link } from '@/components/Link/Link'
import EmotionSadIcon from '@/icons/emotion-sad-line.svg'

export const runtime = 'edge'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-5 p-6">
        <EmotionSadIcon className="size-12 rounded-full bg-white p-3 text-indigo-700 shadow" />
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl">Not found</h2>
          <p>
            Could not find requested resource.{' '}
            <Link href="/" className="text-indigo-700">
              Return home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
