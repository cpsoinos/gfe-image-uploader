import Image from 'next/image'
import { useEffect, useMemo, useState, type ChangeEventHandler, type FC } from 'react'
import { Radio } from '../Radio/Radio'
import { formatFileSize } from '@/lib/formatFileSize'
import { Button } from '../Button/Button'
import CropIcon from '@/icons/crop-line.svg'
import TrashIcon from '@/icons/delete-bin-3-line.svg'
import FileDamagedIcon from '@/icons/file-damage-line.svg'
import CloseIcon from '@/icons/close.svg'
import type { ProfileImageState } from '@/contexts/ProfileImagesContext'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const VALID_IMAGE_TYPES = ['image/png', 'image/jpeg']

export interface ImageRowProps extends ProfileImageState {
  selected?: boolean
  onSelect: () => void
  onDelete: () => void
}

export const ImageRow: FC<ImageRowProps> = ({
  name,
  size,
  file,
  src,
  error,
  selected,
  onSelect,
  onDelete,
}) => {
  // const [error, setError] = useState<string | undefined>(undefined)

  // useEffect(() => {
  //   if (file.size > MAX_FILE_SIZE_BYTES) {
  //     setError('This image is larger than 5MB. Please select a smaller image.')
  //   } else if (!VALID_IMAGE_TYPES.includes(file.type)) {
  //     setError(
  //       `The file format of ${file.name} is not supported. Please upload an image in one of the following formats: JPG or PNG.`,
  //     )
  //   } else {
  //     setError(undefined)
  //   }
  // }, [file])

  const thumbnail = useMemo(() => {
    if (error) {
      return undefined
    } else if (src) {
      return src
    } else if (file) {
      return URL.createObjectURL(file)
    }
  }, [file, src, error])

  const onRadioChanged: ChangeEventHandler<HTMLInputElement> = (ev) => {
    if (ev.target.checked && onSelect) {
      onSelect()
    }
  }

  return (
    <div className="flex items-center gap-4">
      {thumbnail ? (
        <Image
          className="size-20 flex-none rounded-md object-cover"
          src={thumbnail}
          onLoad={() => URL.revokeObjectURL(thumbnail)}
          width={80}
          height={80}
          alt="thumbnail"
        />
      ) : (
        <div className="flex size-20 flex-none items-center justify-center rounded-md border-[0.851px] border-neutral-200 bg-neutral-50">
          <FileDamagedIcon className="size-8 text-neutral-700" />
        </div>
      )}
      <div className="flex grow flex-col justify-between gap-5">
        <div className="flex flex-col gap-1">
          <div className="flex">
            <p className="grow font-semibold">{name}</p>
            {error ? (
              <Button variant="icon" className="size-5" onClick={onDelete}>
                <CloseIcon className="size-4 text-neutral-600" />
                <span className="sr-only">Delete</span>
              </Button>
            ) : (
              <Radio checked={selected} name="selectedImage" onChange={onRadioChanged} />
            )}
          </div>
          <p className="text-xs text-neutral-600">{formatFileSize(size)}</p>
        </div>
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : (
          <div className="flex items-center gap-2 text-neutral-600">
            {/* TODO: handle cropping */}
            <Button variant="tertiary">
              <CropIcon className="size-5" />
              Crop image
            </Button>
            •
            <Button variant="tertiary" onClick={onDelete}>
              <TrashIcon className="size-5" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
