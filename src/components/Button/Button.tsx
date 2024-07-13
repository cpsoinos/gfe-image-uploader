import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', ...props }, ref) => {
    const classes = {
      primary: 'bg-indigo-700 text-white hover:bg-indigo-800 shadow',
      secondary:
        'bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50 hover:text-neutral-950 shadow',
      icon: 'inline-flex p-0 size-6 gap-2 text-neutral-600 hover:text-neutral-900 focus:text-neutral-900 bg-white',
    }

    return (
      <button
        ref={ref}
        {...props}
        className={twMerge(
          'focus:focus-band flex items-center justify-center gap-1.5 rounded px-4 py-2.5 disabled:bg-neutral-100 disabled:text-neutral-400',
          classes[variant],
        )}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
