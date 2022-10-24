import { ReactElement } from 'react'

export interface TooltipProps {
  content: string | ReactElement
  children: ReactElement | ReactElement[]
}

export default function Tooltip ({ content, children }: TooltipProps): ReactElement {
  return <div className="inline-block group relative">
    {children}
    <div className="transition-[opacity transform] duration-150 opacity-0 hover-supported:group-hover:opacity-100 translate-y-1/2 hover-supported:group-hover:translate-y-0 absolute -translate-x-1/2 left-1/2 bottom-full mb-2 pointer-events-none bg-zinc-800 text-zinc-300 font-mono p-2 whitespace-nowrap z-10 rounded-md">{content}</div>
  </div>
}
