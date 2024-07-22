import { TRANSFORM_BASE_URL } from './constants'
import type { ImageLoader, ImageLoaderProps } from 'next/image'

// Docs: https://developers.cloudflare.com/images/url-format
const cloudflareLoader: ImageLoader = ({ src, width, quality }) => {
  const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto']

  return `${TRANSFORM_BASE_URL}/${params.join(',')}/${src}`
}

export default cloudflareLoader

export const cloudflareLoaderWithTransformations =
  (transformations: string) =>
  ({ src, width, quality }: ImageLoaderProps) => {
    const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto', transformations]

    return `${TRANSFORM_BASE_URL}/${params.join(',')}/${src}`
  }
