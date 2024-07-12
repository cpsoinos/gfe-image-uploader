import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { forwardRef, type PropsWithChildren } from 'react'

export type LinkProps = PropsWithChildren<NextLinkProps>

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ children, ...props }, ref) => (
  <NextLink
    ref={ref}
    {...props}
    className="text-netural-600 focus:focus-band inline-flex items-center justify-center gap-1 rounded hover:text-neutral-900 disabled:text-neutral-400"
  >
    {children}
  </NextLink>
))
Link.displayName = 'Link'
