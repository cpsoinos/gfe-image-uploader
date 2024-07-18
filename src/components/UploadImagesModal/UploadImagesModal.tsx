import { forwardRef, useEffect, useReducer, useRef, useState, type FC } from 'react'
import { Modal } from '../Modal/Modal'
import { Dropzone } from '../Dropzone/Dropzone'
import mergeRefs from 'merge-refs'
import { ImageRow } from './ImageRow'
import {
  MAX_NUMBER_OF_FILES,
  profileImagesReducer,
  useProfileImages,
} from '@/contexts/ProfileImagesContext'
import { getPresignedUploadUrl } from '@/lib/getPresignedUploadUrl'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export const UploadImagesModal = forwardRef<HTMLDialogElement>((props, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null)
  // const { files, setFiles, selectedIndex, setSelectedIndex } = useProfileImages()

  // const selectedImage = files[selectedIndex]
  const [state, dispatch] = useReducer(profileImagesReducer, {
    profileImages: [],
    selectedIndex: -1,
  })
  const { profileImages, error, selectedIndex } = state

  // const error = files.length >= MAX_NUMBER_OF_FILES ? "You've reached the image limit" : undefined
  const helperText = error ? 'Remove one or more to upload more images.' : 'PNG, or JPG (Max 5MB)'

  const onFilesAdded = (files: File[]) => {
    files.forEach((file) => dispatch({ type: 'addFile', payload: file }))
    // setFiles((prev) => {
    //   const newFiles = [...prev, ...files]
    //   if (newFiles.length > 5) newFiles.length = 5
    //   return newFiles
    // })
  }

  useEffect(() => {
    profileImages.forEach((image, i) => {
      if (image.status === 'pending' && image.file) {
        uploadFile(image.file, i)
      }
    })
  }, [profileImages])

  const handleDelete = (index: number) => {
    dispatch({ type: 'removeFile', payload: index })
    // setFiles((prev) => {
    //   const newFiles = [...prev]
    //   newFiles.splice(index, 1)
    //   return newFiles
    // })
  }

  const onSelected = (index: number) => {
    dispatch({ type: 'selectImage', payload: index })
  }

  const uploadFile = async (file: File, index: number) => {
    const presignedUploadUrl = await getPresignedUploadUrl(file)
    const xhr = new XMLHttpRequest()
    // const formData = new FormData()

    // formData.append('file', file)

    xhr.open('PUT', presignedUploadUrl, true)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100
        dispatch({ type: 'uploadProgress', payload: { index, progress } })
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log(xhr.responseText)
        dispatch({ type: 'completeUpload', payload: { index, src: xhr.responseText } })
        console.log('File uploaded successfully')
      } else {
        console.error('Error uploading file')
      }
    }

    xhr.onerror = () => {
      console.error('Error uploading file')
    }

    dispatch({ type: 'beginUpload', payload: { index } })
    xhr.send(file)
  }

  return (
    <Modal
      ref={mergeRefs(ref, modalRef)}
      title="Upload image(s)"
      description="You may upload up to 5 images"
    >
      <Dropzone
        accept="image/png,image/jpeg"
        onChange={onFilesAdded}
        error={error}
        helperText={helperText}
      />
      <div className="flex flex-col gap-8">
        {profileImages.map((image, i) => (
          <ImageRow
            key={image.name}
            {...image}
            selected={selectedIndex === i}
            onSelect={() => onSelected(i)}
            onDelete={() => handleDelete(i)}
          />
        ))}
      </div>
    </Modal>
  )
})
UploadImagesModal.displayName = 'UploadImagesModal'
