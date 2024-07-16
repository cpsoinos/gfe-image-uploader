import { forwardRef, useRef, useState, type FC } from 'react'
import { Modal } from '../Modal/Modal'
import { Dropzone } from '../Dropzone/Dropzone'
import mergeRefs from 'merge-refs'
import { ImageRow } from './ImageRow'

const MAX_NUMBER_OF_FILES = 5
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export const UploadImagesModal = forwardRef<HTMLDialogElement>((props, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const selectedImage = files[selectedIndex]

  const error = files.length >= MAX_NUMBER_OF_FILES ? "You've reached the image limit" : undefined
  const helperText = error ? 'Remove one or more to upload more images.' : 'PNG, or JPG (Max 5MB)'

  const onFilesAdded = (files: File[]) => {
    setFiles((prev) => {
      const newFiles = [...prev, ...files]
      if (newFiles.length > 5) newFiles.length = 5
      return newFiles
    })
  }

  const handleDelete = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      newFiles.splice(index, 1)
      return newFiles
    })
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
        {files.map((file, i) => (
          <ImageRow
            image={file}
            key={file.name}
            selected={selectedIndex === i}
            onSelect={() => setSelectedIndex(i)}
            onDelete={() => handleDelete(i)}
          />
        ))}
      </div>
    </Modal>
  )
})
UploadImagesModal.displayName = 'UploadImagesModal'
