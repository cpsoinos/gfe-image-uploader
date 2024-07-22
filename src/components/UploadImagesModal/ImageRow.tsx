import Image from 'next/image'
import { useMemo, type ChangeEventHandler, type FC } from 'react'
import CloseIcon from '@/icons/close.svg'
import CropIcon from '@/icons/crop-line.svg'
import TrashIcon from '@/icons/delete-bin-3-line.svg'
import FileDamagedIcon from '@/icons/file-damage-line.svg'
import { buildTransformParams } from '@/lib/buildTransformParams'
import { cloudflareLoaderWithTransformations } from '@/lib/cloudflareImageLoader'
import { formatFileSize } from '@/lib/formatFileSize'
import { Button } from '../Button/Button'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { Radio } from '../Radio/Radio'
import type { ProfileImageState } from '@/contexts/ProfileImagesContext'

export interface ImageRowProps extends ProfileImageState {
  selected?: boolean
  onSelect: () => void
  onDelete: () => void
  onCropClick: () => void
}

export const ImageRow: FC<ImageRowProps> = ({
  name,
  size,
  file,
  src,
  status,
  progress,
  error,
  selected,
  transformations,
  onSelect,
  onDelete,
  onCropClick,
}) => {
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

  const transformationsString = useMemo(() => {
    return buildTransformParams(transformations)
  }, [transformations])

  return (
    <div className="flex items-center gap-4">
      {thumbnail ? (
        <Image
          className="size-20 flex-none rounded-md object-cover"
          src={thumbnail}
          loader={cloudflareLoaderWithTransformations(transformationsString)}
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

        {['pending', 'uploading'].includes(status) && <ProgressBar progress={progress || 0} />}

        {status === 'error' && <p className="text-xs text-red-600">{error}</p>}

        {status === 'uploaded' && (
          <div className="flex items-center gap-2 text-neutral-600">
            <Button variant="tertiary" onClick={onCropClick} className="text-xs md:text-sm">
              <CropIcon className="size-4 md:size-5" />
              Crop image
            </Button>
            •
            <Button variant="tertiary" onClick={onDelete} className="text-xs md:text-sm">
              <TrashIcon className="size-4 md:size-5" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
