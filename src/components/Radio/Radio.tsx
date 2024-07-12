import { forwardRef, type InputHTMLAttributes } from 'react'
import './Radio.styles.css'

type RadioProps = InputHTMLAttributes<HTMLInputElement>

export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  return <input ref={ref} type="radio" {...props} className="focus:focus-band size-6 border-none" />
})
Radio.displayName = 'Radio'
