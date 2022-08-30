import { ReactElement } from 'react'
import Guess from './Guess'

export interface GuessListProps {
  guesses: string[]
}

export default function GuessList ({ guesses }: GuessListProps): ReactElement {
  return (
    <ul className="grid grid-cols-2 gap-2">
      {
        guesses.map((value, i) => <Guess value={value} key={i} idx={i} />)
      }
    </ul>
  )
}
