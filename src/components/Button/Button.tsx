import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', ...props }, ref) => {
    const classes = {
      primary: 'bg-indigo-700 text-white hover:bg-indigo-800',
      secondary:
        'bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50 hover:text-neutral-950',
    }

    return (
      <button
        ref={ref}
        {...props}
        className={clsx(
          'focus:focus-band flex items-center justify-center gap-1.5 rounded px-4 py-2.5 shadow disabled:bg-neutral-100 disabled:text-neutral-400',
          classes[variant],
        )}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
