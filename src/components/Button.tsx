import { ButtonHTMLAttributes, DetailedHTMLProps, ReactElement } from 'react'
import { getCSSTints, getDailyTarget, isColourDark } from '../Hexle'

export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  color?: string
  dark?: boolean
  link?: string
}

export default function Button ({ children, color, dark = false, link, onClick, ...props }: ButtonProps): ReactElement {
  color = color ?? getDailyTarget()

  const tints = getCSSTints(isColourDark(color))
  const style = {
    background: dark ? 'transparent' : `#${color}`,
    color: dark ? `#${color}` : 'var(--tint-70)',
    fill: dark ? `#${color}` : 'var(--tint-70)',
    ...tints,
  }

  const baseClassName = 'px-4 py-2 rounded-md hover:brightness-125 font-bold font-mono flex gap-2 justify-center items-center transition-all duration-200'
  const propsClassName = (props.className ?? '')

  const className = baseClassName + ' ' + propsClassName + (dark ? '' : ' shadow-md')

  if (link !== undefined) {
    return <a href={link} {...{ style, className }}>
      { children }
    </a>
  }

  return <button {...props} {...{ style, className, onClick }}>
    { children }
  </button>
}
