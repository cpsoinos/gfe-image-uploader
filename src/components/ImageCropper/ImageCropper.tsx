import 'react-image-crop/dist/ReactCrop.css'
import './ImageCropper.styles.css'
import { type Dispatch, type FC, type ReactEventHandler, type SetStateAction } from 'react'
import {
  centerCrop,
  makeAspectCrop,
  ReactCrop,
  type Crop,
  type PercentCrop,
  type PixelCrop,
} from 'react-image-crop'

export interface ImageCropperProps {
  src: string
  aspectRatio: number
  crop?: Crop
  setCrop: Dispatch<SetStateAction<Crop | undefined>>
  onCropChange: (crop: PixelCrop, percentCrop: PercentCrop) => void
  setOriginalImageDimensions: Dispatch<
    SetStateAction<{ width: number; height: number } | undefined>
  >
}

export const ImageCropper: FC<ImageCropperProps> = ({
  src,
  aspectRatio,
  crop,
  setCrop,
  onCropChange,
  setOriginalImageDimensions,
}) => {
  const onImageLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget
    setOriginalImageDimensions({ width, height })

    if (!crop) {
      const initialCrop = centerCrop(
        makeAspectCrop(
          {
            // You don't need to pass a complete crop into
            // makeAspectCrop or centerCrop.
            unit: '%',
            width: 90,
          },
          aspectRatio,
          width,
          height,
        ),
        width,
        height,
      )
      setCrop(initialCrop)
    }
  }

  return (
    <ReactCrop
      crop={crop}
      onChange={onCropChange}
      aspect={aspectRatio}
      circularCrop
      className="max-h-full"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} onLoad={onImageLoad} className="!max-h-[18.125rem]" alt="To be cropped" />
    </ReactCrop>
  )
}
