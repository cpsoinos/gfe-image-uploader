import mergeRefs from 'merge-refs'
import { forwardRef, useCallback, useRef, useState } from 'react'
import { useProfileImages } from '@/contexts/ProfileImagesContext'
import { Button } from '../Button/Button'
import { ImageCropper } from '../ImageCropper/ImageCropper'
import { Modal } from '../Modal/Modal'
import type { ImageTransformations } from '@/types'
import type { Crop, PercentCrop, PixelCrop } from 'react-image-crop'

export interface CropImageModalProps {
  imageIndex: number
  src: string
  open: boolean
  onClose: () => void
  // onConfirmCrop: (index: number, transformations: ImageTransformations) => void
}

export const CropImageModal = forwardRef<HTMLDialogElement, CropImageModalProps>(
  ({ imageIndex, src, onClose }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null)
    const [originalImageDimensions, setOriginalImageDimensions] = useState<
      { width: number; height: number } | undefined
    >()
    const [crop, setCrop] = useState<Crop | undefined>()

    const onCropChange = (_crop: PixelCrop, percentCrop: PercentCrop) => {
      setCrop(percentCrop)
    }

    const { dispatch } = useProfileImages()

    const onSave = useCallback(() => {
      if (!crop || !originalImageDimensions) {
        return
      }
      const transformations: ImageTransformations = {
        x: (crop.x * originalImageDimensions.width) / 100,
        y: (crop.y * originalImageDimensions.height) / 100,
        width: (crop.width * originalImageDimensions.width) / 100,
        height: (crop.height * originalImageDimensions.height) / 100,
      }
      dispatch({ type: 'crop', payload: { index: imageIndex, crop, transformations } })
    }, [crop, dispatch, imageIndex, originalImageDimensions])

    return (
      <Modal
        ref={mergeRefs(ref, modalRef)}
        title="Crop your picture"
        className="w-[21.4375rem] max-w-[21.4375rem] gap-4 p-6"
        onClose={onClose}
      >
        <div className="flex flex-col gap-8">
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
            <Button
              variant="secondary"
              onClick={() => modalRef.current?.close()}
              className="w-full"
              size="md"
            >
              Cancel
            </Button>
            <Button className="w-full" size="md" onClick={onSave}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    )
  },
)
CropImageModal.displayName = 'CropImageModal'
