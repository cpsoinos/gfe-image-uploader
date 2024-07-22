import mergeRefs from 'merge-refs'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { useProfileImages } from '@/contexts/ProfileImagesContext'
import { getPresignedUploadUrl } from '@/lib/getPresignedUploadUrl'
import { Button } from '../Button/Button'
import { Dropzone } from '../Dropzone/Dropzone'
import { Modal } from '../Modal/Modal'
import { ImageRow } from './ImageRow'

export interface UploadImagesModalProps {
  onClose: () => void
  onCropClick: (index: number) => void
}

export const UploadImagesModal = forwardRef<HTMLDialogElement, UploadImagesModalProps>(
  ({ onCropClick }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null)
    const { state, dispatch } = useProfileImages()
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>()

    const { profileImages, error } = state

    const helperText = error ? 'Remove one or more to upload more images.' : 'PNG, or JPG (Max 5MB)'

    const onFilesAdded = (files: File[]) => {
      files.forEach((file) => dispatch({ type: 'addFile', payload: file }))
    }

    const handleDelete = async (index: number) => {
      const key = profileImages[index].name
      await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/images/${key}`, {
        method: 'DELETE',
      })
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
            dispatch({ type: 'completeUpload', payload: { index } })
          } else {
            console.error('Error uploading file')
          }
        }

        xhr.onerror = () => {
          console.error('Error uploading file')
        }

        dispatch({ type: 'beginUpload', payload: { index } })
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
      if (!selectedIndex) return
      dispatch({ type: 'selectImage', payload: selectedIndex })
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
          <Button onClick={onSave} className="w-full" disabled={selectedIndex === undefined}>
            Select image
          </Button>
        </div>
      </Modal>
    )
  },
)
UploadImagesModal.displayName = 'UploadImagesModal'
