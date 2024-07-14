import type { FC, PropsWithChildren } from 'react'

export interface ProfileDetailsProps {
  handle: string
}

export const ProfileDetails: FC<PropsWithChildren<ProfileDetailsProps>> = ({
  handle,
  children,
}) => {
  return (
    <div className="flex flex-col flex-wrap gap-3 text-xl md:flex-row">
      <p>{handle}</p>
      <span className="hidden text-neutral-400 md:inline">•</span>
      {children}
    </div>
  )
}
