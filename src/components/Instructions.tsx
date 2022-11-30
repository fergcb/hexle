import { ReactElement } from 'react'
import Button from './Button'
import Link from './Link'

export interface InstructionsProps {
  onClose: () => void
}

export default function Instructions ({ onClose }: InstructionsProps): ReactElement {
  return <div className="absolute t-0 l-0 w-screen h-screen -mt-4 md:mt-0 font-mono text-zinc-300 bg-tint/50 flex justify-center items-center">
    <div className="m-4 max-h-full bg-zinc-800 rounded-lg p-6 flex flex-col items-flex-start max-w-[60ch]">
      <h1 className="font-bold text-5xl whitespace-nowrap text-center mb-0">Hexle</h1>
      <div className="font-mono text-lg text-zinc-400 font-semibold text-center -mt">
        by&nbsp;
        <a href="https://fergusbentley.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors duration-150">Fergus Bentley</a>
      </div>
      <h2 className="font-semibold text-xl mt-4 mb-1">Aim of the Game</h2>
      <p>Guess the colour of the day by its <Link href="https://en.wikipedia.org/wiki/Web_colors#Hex_triplet" target="_blank">hexadecimal colour code</Link>.</p>
      <h2 className="font-semibold text-xl mt-4 mb-1">Scoring</h2>
      <p>The closer the visual match after four guesses, the higher your score. You'll get 5000 points for a perfect match, down to 0 if you enter the perfect opposite colour.</p>
      <h2 className="font-semibold text-xl mt-4 mb-1">Repeat</h2>
      <p>Come back daily to check the colour of the day, but try not to spoil the game for other players by sharing the answer in the meantime!</p>
      <div className="flex w-full justify-end gap-4">
        <Button className="mt-4" dark link="/unlimited">Unlimited</Button>
        <Button className="mt-4" onClick={() => onClose()}>Play</Button>
      </div>
    </div>
  </div>
}
