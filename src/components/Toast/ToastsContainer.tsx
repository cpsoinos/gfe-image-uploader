'use client'

import { useToasts } from '@/contexts/ToastsContext'
import { Toast } from './Toast'
import type { FC } from 'react'

export const ToastsContainer: FC = () => {
  const { toasts } = useToasts()

  return (
    <div
      role="region"
      tabIndex={-1}
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-10 flex flex-col justify-center gap-4"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}
