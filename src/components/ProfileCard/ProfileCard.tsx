import Image from 'next/image'
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Button } from '../Button/Button'
import { Location } from './Location'
import { Workplace } from './Workplace'
import { ProfileDetails } from './ProfileDetails'
import type { LocationInfo, WorkplaceInfo } from '@/types'

export interface ProfileCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  avatar?: string
  handle: string
  pronouns: string
  workplace: WorkplaceInfo
  location: LocationInfo
}

export const ProfileCard = forwardRef<HTMLDivElement, ProfileCardProps>(
  (
    { name, avatar = '/avatar-empty.svg', handle, workplace, pronouns, location, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        {...props}
        className="border-netural-200 relative flex w-full max-w-xs flex-col gap-6 rounded-lg border bg-white px-4 pb-8 pt-[4.81rem] shadow-md md:max-w-2xl md:px-8 lg:max-w-3xl"
      >
        <div className="absolute left-0 right-0 top-0 z-0 h-32 rounded-t-lg bg-[url(https://portfolio.anderapps.com/cdn-cgi/image/rotate=270/https://gfe-image-uploader-r2.anderapps.com/cover.jpg)] bg-cover bg-[50%] bg-no-repeat md:h-44" />

        <div className="z-10 flex items-end justify-between">
          <Image
            src={avatar}
            width={160}
            height={160}
            alt="avatar"
            className="size-24 rounded-full border-[3.6px] border-white bg-white object-cover md:size-40 md:border-6"
          />
          {/* TODO: implement update picture button */}
          <Button variant="secondary">Update picture</Button>
        </div>

        <h1 className="text-2xl font-semibold md:text-3xl">{name}</h1>

        <ProfileDetails handle={handle}>
          <Workplace {...workplace}>
            <span className="text-neutral-400">•</span>
            {pronouns}
          </Workplace>
          <Location {...location} />
        </ProfileDetails>
      </div>
    )
  },
)
ProfileCard.displayName = 'ProfileCard'
