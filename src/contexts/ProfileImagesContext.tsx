'use client'

import { usePostHog } from 'posthog-js/react'
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type FC,
  type PropsWithChildren,
  type Reducer,
} from 'react'
import { MAX_FILE_SIZE_BYTES, MAX_NUMBER_OF_FILES, R2_BASE_URL } from '@/lib/images/constants'
import type { ProfileImage } from '@/db/schema'
import type { ImageTransformations } from '@/types'
import type { Crop } from 'react-image-crop'

export interface ProfileImagesContextValue {
  state: ProfileImagesState
  dispatch: Dispatch<ProfileImagesAction>
}

export const ProfileImagesContext = createContext<ProfileImagesContextValue | undefined>(undefined)

export type ProfileImagesProviderProps = PropsWithChildren<{
  pathPrefix: string
  storedImages: ProfileImage[]
}>

export const ProfileImagesProvider: FC<ProfileImagesProviderProps> = ({
  pathPrefix,
  storedImages = [],
  children,
}) => {
  const posthog = usePostHog()
  pathPrefix ||= posthog.get_distinct_id()

  const profileImages = storedImages.map((image) => {
    const profileImageState: ProfileImageState = {
      id: image.id,
      pathPrefix,
      status: 'uploaded',
      name: image.name,
      size: image.size,
      src: `${R2_BASE_URL}/${pathPrefix}/${image.name}`,
      selected: image.selected,
      crop: image.crop ?? undefined,
      transformations: image.transformations ?? undefined,
    }
    return profileImageState
  })

  const selectedId = profileImages.find((image) => image.selected)?.id
  const error =
    profileImages.length >= MAX_NUMBER_OF_FILES ? "You've reached the image limit" : undefined

  const [state, dispatch] = useReducer(profileImagesReducer, {
    pathPrefix,
    profileImages,
    selectedId,
    isUploadImagesModalOpen: false,
    isCropImageModalOpen: false,
    error,
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

export type ProfileImagesState = {
  pathPrefix: string
  profileImages: ProfileImageState[]
  error?: string
  selectedId?: string
  activeId?: string
  isCroppingPendingSelection?: boolean
} & (
  | {
      isUploadImagesModalOpen: false
      isCropImageModalOpen: false
    }
  | {
      isUploadImagesModalOpen: true
      isCropImageModalOpen: false
    }
  | {
      isUploadImagesModalOpen: false
      isCropImageModalOpen: true
    }
)

type ProfileImagesAction =
  | { type: 'addFile'; payload: File }
  | { type: 'uploadStart'; payload: { index: number; xhr: XMLHttpRequest } }
  | { type: 'uploadProgress'; payload: { index: number; progress: number } }
  | { type: 'uploadError'; payload: { index: number; error: string } }
  | { type: 'uploadSuccess'; payload: { index: number } }
  | { type: 'uploadComplete'; payload: { index: number } }
  | { type: 'setId'; payload: { index: number; id: string } }
  | { type: 'removeFile'; payload: number }
  | { type: 'selectImage'; payload: string }
  | { type: 'crop'; payload: { id: string; crop: Crop; transformations: ImageTransformations } }
  | { type: 'openUploadImagesModal' }
  | { type: 'closeUploadImagesModal' }
  | { type: 'openCropImageModal'; payload: { id: string; isSelectionPending?: boolean } }
  | { type: 'closeCropImageModal' }

export const profileImagesReducer: Reducer<ProfileImagesState, ProfileImagesAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'addFile': {
      const nonErroredImages = state.profileImages.filter((image) => image.status !== 'error')
      if (nonErroredImages.length >= MAX_NUMBER_OF_FILES) {
        return { ...state, error: "You've reached the image limit" }
      } else {
        const initialImageState: ProfileImageState = {
          pathPrefix: state.pathPrefix,
          status: 'pending',
          name: action.payload.name,
          size: action.payload.size,
          file: action.payload,
          selected: false,
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
    case 'uploadStart': {
      const newProfileImages = [...state.profileImages]
      newProfileImages[action.payload.index] = profileImageReducer(
        newProfileImages[action.payload.index],
        {
          type: 'uploadStart',
          payload: { xhr: action.payload.xhr },
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
    case 'uploadError': {
      const newProfileImages = [...state.profileImages]
      newProfileImages[action.payload.index] = profileImageReducer(
        newProfileImages[action.payload.index],
        {
          type: 'error',
          payload: action.payload.error,
        },
      )
      return { ...state, profileImages: newProfileImages }
    }
    case 'uploadSuccess': {
      const newProfileImages = [...state.profileImages]
      newProfileImages[action.payload.index] = profileImageReducer(
        newProfileImages[action.payload.index],
        {
          type: 'uploadSuccess',
        },
      )
      return { ...state, profileImages: newProfileImages }
    }
    case 'uploadComplete': {
      const newProfileImages = [...state.profileImages]
      newProfileImages[action.payload.index] = profileImageReducer(
        newProfileImages[action.payload.index],
        {
          type: 'uploadComplete',
        },
      )
      return { ...state, profileImages: newProfileImages }
    }
    case 'setId': {
      const newProfileImages = [...state.profileImages]
      newProfileImages[action.payload.index] = profileImageReducer(
        newProfileImages[action.payload.index],
        {
          type: 'setId',
          payload: action.payload.id,
        },
      )
      return { ...state, profileImages: newProfileImages }
    }
    case 'removeFile': {
      const index = action.payload
      const newProfileImages = [...state.profileImages]
      newProfileImages.splice(index, 1)
      return {
        ...state,
        profileImages: newProfileImages,
        error:
          newProfileImages.length >= MAX_NUMBER_OF_FILES
            ? "You've reached the image limit"
            : undefined,
      }
    }
    case 'selectImage': {
      const newProfileImages = state.profileImages.reduce<ProfileImageState[]>((acc, image) => {
        return [
          ...acc,
          {
            ...image,
            selected: image.id === action.payload,
          },
        ]
      }, [])
      return {
        ...state,
        profileImages: newProfileImages,
        selectedId: action.payload,
        activeId: undefined,
      }
    }
    case 'crop': {
      const { id, crop, transformations } = action.payload
      const newProfileImages = [...state.profileImages]
      const idx = newProfileImages.findIndex((image) => image.id === id)
      newProfileImages[idx] = profileImageReducer(newProfileImages[idx], {
        type: 'crop',
        payload: { crop, transformations },
      })
      return { ...state, profileImages: newProfileImages }
    }
    case 'openUploadImagesModal':
      return { ...state, isUploadImagesModalOpen: true, isCropImageModalOpen: false }
    case 'closeUploadImagesModal': {
      return {
        ...state,
        isUploadImagesModalOpen: false,
      }
    }
    case 'openCropImageModal':
      return {
        ...state,
        activeId: action.payload.id,
        isUploadImagesModalOpen: false,
        isCropImageModalOpen: true,
        isCroppingPendingSelection: action.payload.isSelectionPending,
      }
    case 'closeCropImageModal':
      return {
        ...state,
        activeId: undefined,
        isCropImageModalOpen: false,
        isUploadImagesModalOpen: !state.isCroppingPendingSelection,
      }
    default:
      return state
  }
}

export interface ProfileImageState {
  id?: string
  pathPrefix: string
  status: 'pending' | 'uploading' | 'uploadComplete' | 'uploaded' | 'error'
  xhr?: XMLHttpRequest
  progress?: number
  name: string
  size: number
  file?: File
  src?: string
  error?: string
  crop?: Crop
  transformations?: ImageTransformations
  selected: boolean
}

type ProfileImageAction =
  | { type: 'validate' }
  | { type: 'uploadStart'; payload: { xhr: XMLHttpRequest } }
  | { type: 'uploadProgress'; payload: number }
  | { type: 'uploadError'; payload: string }
  | { type: 'uploadSuccess' }
  | { type: 'uploadComplete' }
  | { type: 'setId'; payload: string }
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
    case 'uploadStart':
      return { ...state, status: 'uploading', progress: 0, xhr: action.payload.xhr }
    case 'uploadProgress':
      return { ...state, status: 'uploading', progress: action.payload }
    case 'uploadError':
      return { ...state, status: 'error', error: action.payload }
    case 'uploadSuccess':
      return {
        ...state,
        status: 'uploadComplete',
        progress: 100,
        src: `${R2_BASE_URL}/${state.name}`,
        xhr: undefined,
      }
    case 'uploadComplete':
      return {
        ...state,
        status: 'uploaded',
      }
    case 'setId':
      return { ...state, id: action.payload }
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
