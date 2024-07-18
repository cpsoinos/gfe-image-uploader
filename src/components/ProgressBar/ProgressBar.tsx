import { useId, type FC } from 'react'

export interface ProgressBarProps {
  progress: number
}

export const ProgressBar: FC<ProgressBarProps> = ({ progress }) => {
  const progressId = useId()

  return (
    <div className="flex items-center gap-4" aria-role="progressbar" aria-labelledby={progressId}>
      <div className="relative h-1.5 w-full rounded-full bg-gray-200">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-indigo-700 transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span id={progressId} className="text-xs font-medium text-neutral-600">
        {progress}%
      </span>
    </div>
  )
}
