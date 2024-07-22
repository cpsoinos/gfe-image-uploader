import { twJoin } from 'tailwind-merge'
import type { FC } from 'react'

export interface ToastProps {
  type: 'success' | 'error'
  message: string
}

export const Toast: FC<ToastProps> = ({ type, message }) => {
  const badgeText = {
    success: 'Success',
    error: 'Error',
  }[type]

  return (
    <div
      className={twJoin(
        'flex items-center gap-3 rounded-full py-1 pe-2.5 ps-0.5 text-sm font-medium',
        type === 'success' && 'bg-green-50 text-green-700',
        type === 'error' && 'bg-red-50 text-red-600',
      )}
    >
      <div
        className={twJoin(
          'rounded-full bg-white px-2.5 py-0.5',
          type === 'success' && 'text-green-700',
          type === 'error' && 'text-red-800',
        )}
      >
        {badgeText}
      </div>
      {message}
    </div>
  )
}
