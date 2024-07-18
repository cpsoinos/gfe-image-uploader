import {
  createContext,
  useContext,
  useMemo,
  type Dispatch,
  type FC,
  type ReactNode,
  type Reducer,
  type SetStateAction,
} from 'react'

export const MAX_NUMBER_OF_FILES = 5
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

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

// interface ImageReference {
//   key: string
//   url: string
// }

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
      const newProfileImages = [...state.profileImages]
      newProfileImages.splice(action.payload, 1)
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
}

type ProfileImageAction =
  // | { type: 'addFile'; payload: File }
  | { type: 'validate' }
  | { type: 'beginUpload' }
  | { type: 'uploadProgress'; payload: number }
  | { type: 'completeUpload'; payload: string }
  | { type: 'error'; payload: string }

export const profileImageReducer: Reducer<ProfileImageState, ProfileImageAction> = (
  state,
  action,
) => {
  switch (action.type) {
    // case 'addFile':
    //   return { ...state, status: 'pending', file: action.payload }
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
    default:
      return state
  }
}

// export const ProfileImagesProvider: FC<{ children: ReactNode }> = ({ children }) => {
//   const value = useMemo<ProfileImagesContextValue>(() => ({}))

//   return (
//     <ProfileImagesContext.Provider>
//       {children}
//     </ProfileImagesContext.Provider>
//   )
// }
