import { getCountryName } from '@/lib/getCountryName'
import { getFlagEmoji } from '@/lib/getFlagEmoji'
import type { LocationInfo } from '@/types'
import type { FC } from 'react'

export type LocationProps = LocationInfo

export const Location: FC<LocationProps> = ({ city, region, countryCode }) => {
  const flagEmoji = getFlagEmoji(countryCode)
  const country = getCountryName(countryCode)
  const textContent = region ? `${city}, ${region} ${country}` : `${city}, ${country}`

  return (
    <p className="flex gap-4 text-lg text-neutral-600">
      <span className="text-xl">{flagEmoji}</span>
      <span>{textContent}</span>
    </p>
  )
}
