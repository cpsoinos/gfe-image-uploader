import 'react-image-crop/dist/ReactCrop.css'
import './ImageCropper.styles.css'
import { useState, type FC, type ReactEventHandler } from 'react'
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
}

export const ImageCropper: FC<ImageCropperProps> = ({ src, aspectRatio }) => {
  const [crop, setCrop] = useState<Crop>()

  const onImageLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget

    const crop = centerCrop(
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

    setCrop(crop)
  }

  const onCropChange = (_crop: PixelCrop, percentCrop: PercentCrop) => setCrop(percentCrop)

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
