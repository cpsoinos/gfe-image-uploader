import mergeRefs from 'merge-refs'
import { forwardRef, useRef } from 'react'
import { Button } from '../Button/Button'
import { ImageCropper } from '../ImageCropper/ImageCropper'
import { Modal } from '../Modal/Modal'

export interface CropImageModalProps {
  imageIndex: number
  src: string
  open: boolean
  onClose: () => void
}

export const CropImageModal = forwardRef<HTMLDialogElement, CropImageModalProps>(
  ({ imageIndex, src, onClose }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null)

    return (
      <Modal
        ref={mergeRefs(ref, modalRef)}
        title="Crop your picture"
        className="w-[21.4375rem] max-w-[21.4375rem] gap-4 p-6"
        onClose={onClose}
      >
        <div className="flex flex-col gap-8">
          <div className="flex h-[18.125rem] w-[18.4375rem] justify-center bg-neutral-950">
            <ImageCropper src={src} aspectRatio={1} />
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
            {/* TODO: confirm crop */}
            <Button className="w-full" size="md">
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    )
  },
)
CropImageModal.displayName = 'CropImageModal'
