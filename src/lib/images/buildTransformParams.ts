import type { ImageTransformations } from '@/types'

export const buildTransformParams = (transformations?: ImageTransformations) => {
  if (!transformations) return ''
  return `trim.width=${transformations.width},trim.height=${transformations.height},trim.left=${transformations.x},trim.top=${transformations.y}`
}
