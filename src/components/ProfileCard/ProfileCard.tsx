import Image from 'next/image'
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Button } from '../Button/Button'
import WebflowLogo from '@/icons/webflow-logo.svg'
import { getFlagEmoji } from '@/lib/getFlagEmoji'

export interface ProfileCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  handle: string
  jobTitle: string
  companyName: string
  companyLogo: string
  pronouns: string
  location: {
    city: string
    state?: string
    country: string
  }
}

export const ProfileCard = forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ name, handle, jobTitle, companyName, companyLogo, pronouns, location, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className="border-netural-200 relative flex w-full max-w-xs flex-col gap-6 rounded-lg border bg-white px-4 pb-8 pt-[4.81rem] shadow-md md:max-w-2xl md:px-8 lg:max-w-3xl"
      >
        <div className="absolute left-0 right-0 top-0 z-0 h-32 rounded-t-lg bg-[url(https://portfolio.anderapps.com/cdn-cgi/image/rotate=270/https://gfe-image-uploader-r2.anderapps.com/cover.jpg)] bg-cover bg-[50%] bg-no-repeat md:h-44" />

        <div className="z-10 flex items-end justify-between">
          <Image
            // TODO: dynamic src
            src="/avatar.jpg"
            width={160}
            height={160}
            alt="avatar"
            className="size-24 rounded-full border-[3.6px] border-white md:size-40 md:border-6"
          />
          {/* TODO: implement update picture button */}
          <Button variant="secondary">Update picture</Button>
        </div>

        <h1 className="text-2xl font-semibold md:text-3xl">{name}</h1>

        {/* details */}
        <div className="flex flex-col gap-3 text-xl">
          <p>{handle}</p>
          <div className="flex flex-col gap-2">
            {jobTitle}
            <div className="flex gap-3">
              <span className="inline-flex gap-2">
                <span className="text-neutral-600">at</span>
                <WebflowLogo className="size-6" />
                {companyName}
              </span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-600">{pronouns}</span>
            </div>
          </div>
          <p className="flex gap-4 text-lg text-neutral-600">
            <span>{getFlagEmoji('CA')}</span>
            <span>
              {location.city}, {location.country}
            </span>
          </p>
        </div>
      </div>
    )
  },
)
ProfileCard.displayName = 'ProfileCard'
