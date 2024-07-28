import NextLink from 'next/link'
import { forwardRef, type ComponentProps, type PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

export type LinkProps = PropsWithChildren<ComponentProps<typeof NextLink>>

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, ...props }, ref) => (
    <NextLink
      ref={ref}
      {...props}
      className={twMerge(
        'text-netural-600 focus:focus-band inline-flex items-center justify-center gap-1 rounded hover:text-neutral-900 disabled:text-neutral-400',
        className,
      )}
    >
      {children}
    </NextLink>
  ),
)
Link.displayName = 'Link'
