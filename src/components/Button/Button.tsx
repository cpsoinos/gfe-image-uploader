import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary' | 'icon'
  size?: 'sm' | 'md'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-indigo-700 text-white hover:bg-indigo-800 shadow',
      secondary:
        'bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50 hover:text-neutral-950 shadow',
      tertiary:
        'text-netural-600 focus:focus-band inline-flex items-center justify-center gap-1 rounded hover:text-neutral-900 disabled:text-neutral-400 p-0 md:p-0 text-sm md:text-sm',
      icon: 'inline-flex p-0 md:p-0 size-6 gap-2 text-neutral-600 hover:text-neutral-900 focus:text-neutral-900 bg-white',
    }
    const sizeClasses = {
      sm: 'px-3 md:px-3 py-2 md:py-2 text-sm',
      md: 'px-4 py-2.5 md:px-4 md:py-2.5 text-base',
    }

    return (
      <button
        ref={ref}
        {...props}
        className={twMerge(
          'focus-visible:focus-band flex items-center justify-center gap-1.5 rounded px-3 py-2 text-sm focus-visible:outline-transparent disabled:bg-neutral-100 disabled:text-neutral-400 md:px-4 md:py-2.5 md:text-base',
          variantClasses[variant],
          size && sizeClasses[size],
          props.className,
        )}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
