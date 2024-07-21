import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type FC,
  type ReactNode,
  type Reducer,
} from 'react'
import type { ImageTransformations } from '@/types'
import type { Crop } from 'react-image-crop'

export const MAX_NUMBER_OF_FILES = 5
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export interface ProfileImagesContextValue {
  state: ProfileImagesState
  dispatch: Dispatch<ProfileImagesAction>
}

export const ProfileImagesContext = createContext<ProfileImagesContextValue | undefined>(undefined)

export const ProfileImagesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(profileImagesReducer, {
    profileImages: [],
    selectedIndex: -1,
  })

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <ProfileImagesContext.Provider value={value}>{children}</ProfileImagesContext.Provider>
}

export const useProfileImages = () => {
  const context = useContext(ProfileImagesContext)
  if (!context) {
    throw new Error('useProfileImages must be used within a ProfileImagesProvider')
  }
  return context
}

export interface ProfileImagesState {
  profileImages: ProfileImageState[]
  error?: string
  selectedIndex: number
}

type ProfileImagesAction =
  | { type: 'addFile'; payload: File }
  | { type: 'beginUpload'; payload: { index: number } }
  | { type: 'uploadProgress'; payload: { index: number; progress: number } }
  | { type: 'completeUpload'; payload: { index: number; src: string } }
  | { type: 'removeFile'; payload: number }
  | { type: 'selectImage'; payload: number }
  | { type: 'crop'; payload: { index: number; crop: Crop; transformations: ImageTransformations } }

export const profileImagesReducer: Reducer<ProfileImagesState, ProfileImagesAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'addFile': {
      if (state.profileImages.length >= MAX_NUMBER_OF_FILES) {
        return { ...state, error: "You've reached the image limit" }
      } else {
        const initialImageState: ProfileImageState = {
          status: 'pending',
          name: action.payload.name,
          size: action.payload.size,
          file: action.payload,
        }
        const imageState = profileImageReducer(initialImageState, {
          type: 'validate',
        })
        return {
          ...state,
          profileImages: [...state.profileImages, imageState],
        }
      }
    }
    case 'beginUpload': {
      const newProfileImages = [...state.profileImages]
      newProfileImages[action.payload.index] = profileImageReducer(
        newProfileImages[action.payload.index],
        {
          type: 'beginUpload',
        },
      )
      return { ...state, profileImages: newProfileImages }
    }
    case 'uploadProgress': {
      const newProfileImages = [...state.profileImages]
      newProfileImages[action.payload.index] = profileImageReducer(
        newProfileImages[action.payload.index],
        {
          type: 'uploadProgress',
          payload: action.payload.progress,
        },
      )
      return { ...state, profileImages: newProfileImages }
    }
    case 'completeUpload': {
      const newProfileImages = [...state.profileImages]
      newProfileImages[action.payload.index] = profileImageReducer(
        newProfileImages[action.payload.index],
        {
          type: 'completeUpload',
          payload: action.payload.src,
        },
      )
      return { ...state, profileImages: newProfileImages }
    }
    case 'removeFile': {
      const index = action.payload
      const newProfileImages = [...state.profileImages]
      newProfileImages.splice(index, 1)
      const newSelectedIndex =
        index < state.selectedIndex ? state.selectedIndex - 1 : state.selectedIndex
      return { ...state, profileImages: newProfileImages, selectedIndex: newSelectedIndex }
    }
    case 'selectImage':
      return { ...state, selectedIndex: action.payload }
    case 'crop': {
      const { index, crop, transformations } = action.payload
      const newProfileImages = [...state.profileImages]
      newProfileImages[index] = profileImageReducer(newProfileImages[index], {
        type: 'crop',
        payload: { crop, transformations },
      })
      return { ...state, profileImages: newProfileImages }
    }
    default:
      return state
  }
}

export interface ProfileImageState {
  status: 'pending' | 'uploading' | 'uploaded' | 'error'
  progress?: number
  name: string
  size: number
  file?: File
  src?: string
  error?: string
  crop?: Crop
  transformations?: ImageTransformations
}

type ProfileImageAction =
  | { type: 'validate' }
  | { type: 'beginUpload' }
  | { type: 'uploadProgress'; payload: number }
  | { type: 'completeUpload'; payload: string }
  | { type: 'error'; payload: string }
  | { type: 'crop'; payload: { crop: Crop; transformations: ImageTransformations } }

export const profileImageReducer: Reducer<ProfileImageState, ProfileImageAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'validate': {
      if (state.size > MAX_FILE_SIZE_BYTES) {
        return {
          ...state,
          status: 'error',
          error: 'This image is larger than 5MB. Please select a smaller image.',
        }
      } else if (!['image/png', 'image/jpeg'].includes(state.file?.type || '')) {
        return {
          ...state,
          status: 'error',
          error: `The file format of ${state.name} is not supported. Please upload an image in one of the following formats: JPG or PNG.`,
        }
      } else {
        return state
      }
    }
    case 'beginUpload':
      return { ...state, status: 'uploading', progress: 0 }
    case 'uploadProgress':
      return { ...state, status: 'uploading', progress: action.payload }
    case 'completeUpload':
      return { ...state, status: 'uploaded', progress: 100, src: action.payload }
    case 'error':
      return { ...state, status: 'error', error: action.payload }
    case 'crop':
      return {
        ...state,
        crop: action.payload.crop,
        transformations: action.payload.transformations,
      }
    default:
      return state
  }
}
