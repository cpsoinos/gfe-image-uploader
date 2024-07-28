import { Link } from '@/components/Link/Link'
import EmotionSadIcon from '@/icons/emotion-sad-line.svg'
import type { FC } from 'react'

export interface ErrorViewProps {
  title: string
  description: string
  link: {
    href: string
    text: string
  }
}

export const ErrorView: FC<ErrorViewProps> = ({ title, description, link }) => {
  return (
    <div className="flex flex-col items-center gap-5 p-6">
      <EmotionSadIcon className="size-12 rounded-full bg-white p-3 text-indigo-700 shadow" />
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl">{title}</h2>
        <p>
          {description}{' '}
          <Link href={link.href} className="text-indigo-700">
            {link.text}
          </Link>
        </p>
      </div>
    </div>
  )
}
