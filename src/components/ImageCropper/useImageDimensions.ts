import { useState, useEffect, useMemo } from 'react'
import { getImageDimensions } from '@/lib/getImageDimensions'

export const useImageDimensions = (src: string) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | undefined>(
    undefined,
  )

  const aspectRatio = useMemo(() => {
    return dimensions?.height && dimensions.width ? dimensions.width / dimensions.height : undefined
  }, [dimensions])

  useEffect(() => {
    getImageDimensions(src).then(setDimensions)
  }, [src])

  if (dimensions && aspectRatio) {
    return { ...dimensions, aspectRatio }
  }
}
