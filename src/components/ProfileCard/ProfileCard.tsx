'use client'

import './ProfileCard.styles.css'
import Image from 'next/image'
import { forwardRef, useMemo, useRef, type HTMLAttributes } from 'react'
import { useProfileImages } from '@/contexts/ProfileImagesContext'
import { buildTransformParams } from '@/lib/images/buildTransformParams'
import { cloudflareLoaderWithTransformations } from '@/lib/images/cloudflareImageLoader'
import { Button } from '../Button/Button'
import { CropImageModal } from '../CropImageModal/CropImageModal'
import { UploadImagesModal } from '../UploadImagesModal/UploadImagesModal'
import { Location } from './Location'
import { ProfileDetails } from './ProfileDetails'
import { Workplace } from './Workplace'
import type { LocationInfo, WorkplaceInfo } from '@/types'

export interface ProfileCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  handle: string
  pronouns: string
  workplace: WorkplaceInfo
  location: LocationInfo
}

export const ProfileCard = forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ name, handle, workplace, pronouns, location, ...props }, ref) => {
    const uploadImagesModalRef = useRef<HTMLDialogElement>(null)
    const cropImageModalRef = useRef<HTMLDialogElement>(null)

    const { state, dispatch } = useProfileImages()
    const selectedImage = state.profileImages[state.selectedIndex]

    const openUploadImagesModal = () => {
      uploadImagesModalRef.current?.showModal()
      dispatch({ type: 'openUploadImagesModal' })
    }

    const openCropImageModal = (index: number) => {
      dispatch({ type: 'openCropImageModal', payload: { index } })
      uploadImagesModalRef.current?.close()
      cropImageModalRef.current?.showModal()
    }

    const onCropImageModalClose = () => {
      dispatch({ type: 'closeCropImageModal' })
      uploadImagesModalRef.current?.showModal()
    }

    const transformationsString = useMemo(() => {
      return buildTransformParams(selectedImage?.transformations)
    }, [selectedImage])

    return (
      <>
        <div
          ref={ref}
          {...props}
          className="border-netural-200 relative flex w-full max-w-xs flex-col gap-6 rounded-lg border bg-white px-4 pb-8 pt-[4.81rem] shadow-md md:max-w-2xl md:px-8 lg:max-w-3xl"
        >
          <div className="profile-card__cover absolute left-0 right-0 top-0 z-0 h-32 rounded-t-lg bg-cover bg-[50%] bg-no-repeat md:h-44" />

          <div className="z-10 flex items-end justify-between">
            <Image
              src={selectedImage?.src || '/avatar-empty.svg'}
              loader={
                selectedImage?.transformations &&
                cloudflareLoaderWithTransformations(transformationsString)
              }
              width={160}
              height={160}
              alt="avatar"
              className="size-24 rounded-full border-[3.6px] border-white bg-white object-cover md:size-40 md:border-6"
              priority
            />
            <Button variant="secondary" onClick={openUploadImagesModal}>
              Update picture
            </Button>
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

        <UploadImagesModal
          ref={uploadImagesModalRef}
          onCropClick={openCropImageModal}
          onClose={() => dispatch({ type: 'closeUploadImagesModal' })}
        />
        <CropImageModal ref={cropImageModalRef} onClose={onCropImageModalClose} />
      </>
    )
  },
)
ProfileCard.displayName = 'ProfileCard'
