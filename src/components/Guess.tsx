import { ReactElement } from 'react'

export interface GuessProps {
  value: string
  idx: number
}

export default function Guess ({ value, idx }: GuessProps): ReactElement {
  const swatchStyle = {
    backgroundColor: value !== '' ? `#${value}` : 'rgba(0, 0, 0, 0.05)',
  }

  return <li className="flex gap-2 items-center bg-black/5 pr-2 font-mono text-lg md:text-2xl font-semibold">
    <div style={swatchStyle} className="text-black/20 w-[3em] leading-[3em] md:leading-[3em] text-center">№{idx + 1}</div>
    <div className="text-black/25 w-[7ch]">
      { value !== '' ? `#${value}` : '' }
    </div>
  </li>
}
