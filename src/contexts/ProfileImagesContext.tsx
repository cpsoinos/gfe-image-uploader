import type { LocationInfo, WorkplaceInfo } from '@/types'
import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'

interface ProfileImagesContextValue {
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
  selectedIndex: number
  setSelectedIndex: Dispatch<SetStateAction<number>>
}

export const ProfileImagesContext = createContext<ProfileImagesContextValue | undefined>(undefined)

export const useProfileImages = () => {
  const context = useContext(ProfileImagesContext)
  if (!context) {
    throw new Error('useProfileImages must be used within a ProfileImagesProvider')
  }
  return context
}
