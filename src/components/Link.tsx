import { AnchorHTMLAttributes, DetailedHTMLProps, ReactElement } from 'react'

export default function Link ({ children, ...props }: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>): ReactElement {
  return <a {...props} className={(props.className ?? '') + 'underline font-semibold transition-all duration-200 hover:brightness-150'}>
    { children }
  </a>
}
