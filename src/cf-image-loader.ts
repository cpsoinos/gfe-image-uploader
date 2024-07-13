import type { ImageLoader, ImageLoaderProps } from 'next/image'

// Docs: https://developers.cloudflare.com/images/url-format
const cloudflareLoader: ImageLoader = ({ src, width, quality }) => {
  const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto']

  return `https://portfolio.anderapps.com/cdn-cgi/image/${params.join(',')}/${src}`
}

export default cloudflareLoader

export const cloudflareLoaderWithTransformations =
  (transformations: string) =>
  ({ src, width, quality }: ImageLoaderProps) => {
    const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto', transformations]

    return `https://portfolio.anderapps.com/cdn-cgi/image/${params.join(',')}/${src}`
  }
