'use client'

import mergeRefs from 'merge-refs'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { useProfileImages } from '@/contexts/ProfileImagesContext'
import { getPresignedUploadUrl } from '@/lib/getPresignedUploadUrl'
import { Button } from '../Button/Button'
import { Dropzone } from '../Dropzone/Dropzone'
import { Modal } from '../Modal/Modal'
import { ImageRow } from './ImageRow'

const SUCCESS_MESSAGE_TIMEOUT = 350

export interface UploadImagesModalProps {
  onClose: () => void
  onCropClick: (index: number, isCropOnSelect?: boolean) => void
}

export const UploadImagesModal = forwardRef<HTMLDialogElement, UploadImagesModalProps>(
  ({ onCropClick }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null)
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    const { state, dispatch } = useProfileImages()

    const { profileImages, error } = state

    const helperText = error ? 'Remove one or more to upload more images.' : 'PNG, or JPG (Max 5MB)'

    const onFilesAdded = (files: File[]) => {
      files.forEach((file) => dispatch({ type: 'addFile', payload: file }))
    }

    const handleDelete = async (index: number) => {
      const key = profileImages[index].name
      await fetch(`/api/images/${key}`, {
        method: 'DELETE',
      })
      if (selectedIndex === index) {
        setSelectedIndex((prev) => prev - 1)
      }
      dispatch({ type: 'removeFile', payload: index })
    }

    const handleCancelUpload = async (index: number) => {
      const xhr = profileImages[index].xhr
      xhr?.abort()
      dispatch({ type: 'removeFile', payload: index })
    }

    const onSelected = (index: number) => {
      setSelectedIndex(index)
    }

    const uploadFile = useCallback(
      async (file: File, index: number) => {
        const presignedUploadUrl = await getPresignedUploadUrl(file)
        const xhr = new XMLHttpRequest()

        xhr.open('PUT', presignedUploadUrl, true)

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            dispatch({ type: 'uploadProgress', payload: { index, progress } })
          }
        }

        xhr.onload = () => {
          if (xhr.status === 200) {
            dispatch({ type: 'uploadSuccess', payload: { index } })
            setTimeout(() => {
              dispatch({ type: 'uploadComplete', payload: { index } })
            }, SUCCESS_MESSAGE_TIMEOUT)
          } else {
            dispatch({
              type: 'uploadError',
              payload: {
                index,
                error:
                  'An unexpected error occurred during the upload. Please contact support if the issue persists.',
              },
            })
          }
        }

        xhr.onerror = () => {
          dispatch({
            type: 'uploadError',
            payload: {
              index,
              error:
                'An error occurred during the upload. Please check your network connection and try again.',
            },
          })
        }

        dispatch({ type: 'uploadStart', payload: { index, xhr } })
        xhr.send(file)
      },
      [dispatch],
    )

    useEffect(() => {
      profileImages.forEach((image, i) => {
        if (image.status === 'pending' && image.file) {
          uploadFile(image.file, i)
        }
      })
    }, [profileImages, uploadFile])

    const onSave = () => {
      if (selectedIndex === undefined) return
      onCropClick(selectedIndex, true)
      modalRef.current?.close()
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
              onCancelUpload={() => handleCancelUpload(i)}
              onSelect={() => onSelected(i)}
              onDelete={() => handleDelete(i)}
              onCropClick={() => onCropClick(i)}
            />
          ))}
        </div>

        <div className="flex justify-between gap-4">
          <Button variant="secondary" className="w-full" onClick={() => modalRef.current?.close()}>
            Cancel
          </Button>
          <Button onClick={onSave} className="w-full" disabled={selectedIndex === -1}>
            Select image
          </Button>
        </div>
      </Modal>
    )
  },
)
UploadImagesModal.displayName = 'UploadImagesModal'
