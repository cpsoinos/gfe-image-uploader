'use client'

import { useRef, useState, type ChangeEventHandler, type DragEventHandler, type FC } from 'react'
import { twJoin } from 'tailwind-merge'
import UploadCloud from '@/icons/upload-cloud-2-line.svg'

interface DropzoneProps {
  onChange: (files: File[]) => void
  accept?: string
  error?: string
  helperText?: string
}

export const Dropzone: FC<DropzoneProps> = ({
  accept,
  error,
  helperText,
  onChange: onFilesSelected,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleClick = () => {
    !error && inputRef.current?.click()
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const fileList = ev.target.files
    if (fileList) {
      onFilesSelected(Array.from(fileList))
    }
  }

  const handleDragEnter: DragEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault()
    ev.stopPropagation()
    setIsDragging(true)
  }

  const handleDragOver: DragEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault()
    ev.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave: DragEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault()
    ev.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop: DragEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault()
    const fileList: File[] = []

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      ;[...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === 'file') {
          const file = item.getAsFile()!
          fileList.push(file)
        }
      })
    } else {
      // Use DataTransfer interface to access the file(s)
      ;[...ev.dataTransfer.files].forEach((file, i) => {
        fileList.push(file)
      })
    }
    onFilesSelected(fileList)
  }

  return (
    <>
      <div
        role="button"
        className={twJoin(
          'flex h-48 w-full flex-col items-center justify-center gap-5 rounded border border-neutral-200 py-6',
          isDragging ? 'bg-neutral-100' : 'bg-neutral-50',
        )}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {error ? (
          <div className="flex flex-col gap-1">
            <p className="semibold text-center text-base text-red-600">{error}</p>
            {helperText && <p className="text-center text-xs text-neutral-600">{helperText}</p>}
          </div>
        ) : (
          <>
            <div className="flex size-12 items-center justify-center rounded-full bg-white shadow">
              <UploadCloud className="size-6 text-indigo-700" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-center text-lg text-neutral-900">
                Click or drag and drop to upload
              </p>
              {helperText && <p className="text-center text-sm text-neutral-600">{helperText}</p>}
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        onChange={handleInputChange}
        type="file"
        hidden
        multiple
        accept={accept}
      />
    </>
  )
}
