import './Radio.styles.css'
import { forwardRef, type InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type RadioProps = InputHTMLAttributes<HTMLInputElement>

export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  return (
    <input
      ref={ref}
      type="radio"
      {...props}
      className={twMerge('focus:focus-band size-6 border-none bg-cover', props.className)}
    />
  )
})
Radio.displayName = 'Radio'
