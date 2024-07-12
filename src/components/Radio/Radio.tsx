import { forwardRef, type InputHTMLAttributes } from 'react'

type RadioProps = InputHTMLAttributes<HTMLInputElement>

export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  return (
    <input
      ref={ref}
      type="radio"
      {...props}
      className="focus:focus-band size-6 border-[1.5px] border-neutral-200 bg-white bg-clip-content text-indigo-600 checked:border-indigo-600 checked:bg-radio-checked checked:p-0.5 hover:border-indigo-600 hover:bg-neutral-50 checked:hover:border-indigo-600"
    />
  )
})
Radio.displayName = 'Radio'
