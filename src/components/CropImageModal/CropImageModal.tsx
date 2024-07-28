'use client'

import mergeRefs from 'merge-refs'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { updateProfileImage } from '@/app/actions/updateProfileImage'
import { useProfileImages } from '@/contexts/ProfileImagesContext'
import { Button } from '../Button/Button'
import { ImageCropper } from '../ImageCropper/ImageCropper'
import { Modal } from '../Modal/Modal'
import type { ImageTransformations } from '@/types'
import type { Crop, PercentCrop, PixelCrop } from 'react-image-crop'

export interface CropImageModalProps {
  onClose: () => void
}

export const CropImageModal = forwardRef<HTMLDialogElement, CropImageModalProps>(
  ({ onClose }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null)
    const [originalImageDimensions, setOriginalImageDimensions] = useState<
      { width: number; height: number } | undefined
    >()
    const { state, dispatch } = useProfileImages()
    const { activeId } = state
    const activeImage = state.profileImages.find((img) => img.id === activeId)
    const [crop, setCrop] = useState<Crop | undefined>(activeImage?.crop)
    const src = activeImage?.src

    // sync crop with activeImage.crop
    useEffect(() => {
      setCrop(activeImage?.crop)
    }, [activeImage])

    const onCropChange = (_crop: PixelCrop, percentCrop: PercentCrop) => {
      setCrop(percentCrop)
    }

    const onSave = useCallback(async () => {
      if (!crop || !originalImageDimensions || activeId === undefined) {
        return
      }
      const transformations: ImageTransformations = {
        x: (crop.x * originalImageDimensions.width) / 100,
        y: (crop.y * originalImageDimensions.height) / 100,
        width: (crop.width * originalImageDimensions.width) / 100,
        height: (crop.height * originalImageDimensions.height) / 100,
      }
      await updateProfileImage({ id: activeId, crop, transformations })
      dispatch({ type: 'crop', payload: { id: activeId, crop, transformations } })
    }, [activeId, crop, dispatch, originalImageDimensions])

    return (
      <Modal
        ref={mergeRefs(ref, modalRef)}
        title="Crop your picture"
        className="w-[21.4375rem] max-w-[21.4375rem] gap-4 p-6"
        onClose={onClose}
      >
        {src && (
          <form className="flex flex-col gap-8" method="dialog">
            <div className="flex h-[18.125rem] w-[18.4375rem] justify-center bg-neutral-950">
              <ImageCropper
                src={src}
                aspectRatio={1}
                crop={crop}
                setCrop={setCrop}
                onCropChange={onCropChange}
                setOriginalImageDimensions={setOriginalImageDimensions}
              />
            </div>

            <div className="flex justify-between gap-3">
              <Button variant="secondary" className="w-full" size="md">
                Cancel
              </Button>
              <Button className="w-full" size="md" onClick={onSave}>
                Confirm
              </Button>
            </div>
          </form>
        )}
      </Modal>
    )
  },
)
CropImageModal.displayName = 'CropImageModal'
