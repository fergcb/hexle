import { ReactElement } from 'react'
import { getCSSTints } from '../Hexle'

export interface GuessProps {
  value: string
  idx: number
}

export default function Guess ({ value, idx }: GuessProps): ReactElement {
  const swatchStyle = {
    backgroundColor: value !== '' ? `#${value}` : 'var(--tint-05)',
    ...(value !== '' ? getCSSTints(value) : {}),
  }

  return <li className="flex gap-2 items-center bg-tint/5 pr-2 font-mono text-lg md:text-2xl font-semibold">
    <div style={swatchStyle} className="text-tint/40 w-[3em] leading-[3em] md:leading-[3em] text-center">№{idx + 1}</div>
    <div className="text-tint/25 w-[7ch]">
      { value !== '' ? `#${value}` : '' }
    </div>
  </li>
}
