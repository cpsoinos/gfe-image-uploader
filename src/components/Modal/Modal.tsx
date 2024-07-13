import { forwardRef, useRef, type DialogHTMLAttributes, type PropsWithChildren } from 'react'
import { Button } from '../Button/Button'
import mergeRefs from 'merge-refs'
import CloseIcon from '@/icons/close.svg'

export interface ModalProps extends DialogHTMLAttributes<HTMLDialogElement> {
  title: string
  description?: string
}

export const Modal = forwardRef<HTMLDialogElement, PropsWithChildren<ModalProps>>(
  ({ title, description, children, ...props }, ref) => {
    const localRef = useRef<HTMLDialogElement>(null)

    const close = () => {
      localRef.current?.close()
    }

    return (
      <dialog
        ref={mergeRefs(ref, localRef)}
        className="w-full max-w-xs flex-col gap-8 rounded-lg bg-white px-6 py-8 backdrop:bg-neutral-950 backdrop:opacity-70 open:flex md:max-w-xl"
        {...props}
      >
        <div>
          <div className="flex justify-between">
            <h2 className="text-xl font-medium text-neutral-900">{title}</h2>
            <Button variant="icon" onClick={close} autoFocus>
              <CloseIcon className="text-neutral-600" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          {description && <p className="text-neutral-600">{description}</p>}
        </div>
        {children}
      </dialog>
    )
  },
)
Modal.displayName = 'Modal'
