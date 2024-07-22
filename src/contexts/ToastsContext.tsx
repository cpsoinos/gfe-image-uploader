'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from 'react'
import type { ToastProps } from '@/components/Toast/Toast'

const AUTO_DISMISS_TIMEOUT = 5000

export interface ToastNotification extends ToastProps {
  id: string
}

export interface ToastsContextValue {
  toasts: ToastNotification[]
  addToast: (toast: ToastProps) => void
  removeToast: (id: string) => void
}

export const ToastsContext = createContext<ToastsContextValue | undefined>(undefined)

export const useToasts = () => {
  const context = useContext(ToastsContext)
  if (!context) {
    throw new Error('useToasts must be used within a ToastsProvider')
  }
  return context
}

export const ToastsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  const addToast = useCallback((toast: ToastProps) => {
    const newToast = {
      id: crypto.randomUUID(),
      ...toast,
    }
    setToasts((prev) => [...prev, newToast])
    setTimeout(() => {
      removeToast(newToast.id)
    }, AUTO_DISMISS_TIMEOUT)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [addToast, toasts])

  return <ToastsContext.Provider value={value}>{children}</ToastsContext.Provider>
}
