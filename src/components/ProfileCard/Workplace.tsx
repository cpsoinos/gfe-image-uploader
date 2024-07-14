import { logos } from '@/lib/logos'
import type { WorkplaceInfo } from '@/types'
import type { FC, PropsWithChildren } from 'react'

export type WorkplaceProps = WorkplaceInfo

export const Workplace: FC<PropsWithChildren<WorkplaceProps>> = ({
  title,
  companyName,
  children,
}) => {
  const Logo = logos.get(companyName)

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      {title}
      <div className="flex gap-3">
        <span className="inline-flex gap-2">
          <span className="text-neutral-600">at</span>
          {Logo && <Logo className="size-6" />}
          {companyName}
          {children}
        </span>
      </div>
    </div>
  )
}
