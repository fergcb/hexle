import { ReactElement } from 'react'
import Button from './Button'

export interface InstructionsProps {
  onClose: () => void
}

export default function Instructions ({ onClose }: InstructionsProps): ReactElement {
  return <div className="absolute t-0 l-0 w-screen h-screen -mt-4 md:mt-0 font-mono text-zinc-300 bg-tint/50 flex justify-center items-center">
    <div className="m-4 max-h-full bg-zinc-800 rounded-lg p-6 flex flex-col items-flex-start max-w-[60ch]">
      <h1 className="font-bold text-4xl whitespace-nowrap text-center mb-8l">Introducing:</h1>
      <h2 className="font-bold text-2xl whitespace-nowrap text-center mb-8l">Hexle Unlimited</h2>
      <p className="mt-4">Hexle Unlimited is a new game mode, where your target colour is random each time you play, rather than linked to the current date.</p>
      <p className="mt-4">That means you can play Hexle Unlimited as many times a day as you like!</p>
      <div className="flex w-full justify-end gap-4">
        <Button className="mt-4" dark onClick={() => onClose()}>Cancel</Button>
        <Button className="mt-4" link="/unlimited">Play Unlimited</Button>
      </div>
    </div>
  </div>
}
