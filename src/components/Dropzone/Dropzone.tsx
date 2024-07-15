import { useRef, type ChangeEventHandler, type DragEventHandler, type FC } from 'react'
import UploadCloud from '@/icons/upload-cloud-2-line.svg'

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  error?: string
  helperText?: string
}

export const Dropzone: FC<DropzoneProps> = ({ accept, error, helperText, onFilesSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    !error && inputRef.current?.click()
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const fileList = ev.target.files
    if (fileList) {
      onFilesSelected(Array.from(fileList))
    }
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

  const handleDragOver: DragEventHandler<HTMLDivElement> = (ev) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault()
  }

  return (
    <>
      <div
        role="button"
        className="flex h-48 w-full flex-col items-center justify-center gap-5 rounded border border-neutral-200 bg-neutral-50 py-6"
        onClick={handleClick}
        onDragOver={handleDragOver}
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
