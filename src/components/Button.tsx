import { ButtonHTMLAttributes, DetailedHTMLProps, ReactElement } from 'react'
import { getDailyTarget } from '../Hexle'

export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export default function Button ({ children, ...props }: ButtonProps): ReactElement {
  return <button {...props} style={{ backgroundColor: `#${getDailyTarget()}` }} className={(props.className ?? '') + ' text-tint/60 px-4 py-2 rounded-md hover:brightness-125 font-bold font-mono flex gap-2 justify-center items-center transition-all duration-200 shadow-md'}>
    { children }
  </button>
}
