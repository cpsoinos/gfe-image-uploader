import mergeRefs from 'merge-refs'
import Image from 'next/image'
import { forwardRef, useRef } from 'react'
import { Button } from '../Button/Button'
import { Modal } from '../Modal/Modal'

export interface CropImageModalProps {
  imageIndex: number
  src: string
}

export const CropImageModal = forwardRef<HTMLDialogElement, CropImageModalProps>(
  ({ imageIndex, src }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null)

    return (
      <Modal
        ref={mergeRefs(ref, modalRef)}
        title="Crop your picture"
        className="w-[21.4375rem] p-6"
      >
        <div className="h-[18.125rem] bg-neutral-950">
          <Image
            src={src}
            alt="Crop your picture"
            className="mx-auto h-full w-full object-contain"
            width={295}
            height={290}
          />
        </div>

        <div className="flex justify-between gap-3">
          <Button variant="secondary" onClick={() => modalRef.current?.close()} className="w-full">
            Cancel
          </Button>
          {/* TODO: confirm crop */}
          <Button className="w-full">Confirm</Button>
        </div>
      </Modal>
    )
  },
)
CropImageModal.displayName = 'CropImageModal'
