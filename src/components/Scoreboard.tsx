import { ReactElement } from 'react'

function scoreMessage (score: number): string {
  if (score === 5000) return 'Exact match!'
  if (score >= 4950) return 'Imperceptibly close!'
  if (score >= 4900) return 'Perceptibly different, given a close look.'
  if (score >= 4500) return 'Perceptibly different, at a glance.'
  if (score >= 2550) return 'More similar than different.'
  if (score > 0) return 'More different than similar.'
  return 'Exact opposites.'
}

export interface ScoreboardProps {
  guesses: string[]
  target: string
  score: number
}

export interface SwatchProps {
  name: string
  colour: string
}

export function Swatch ({ name, colour }: SwatchProps): ReactElement {
  return <div className="flex flex-col items-center gap-1">
  <h3 className="font-semibold text-xl">{name}:</h3>
  <div className="w-24 h-24" style={{ backgroundColor: `#${colour}` }}></div>
  <div className="text-zinc-400 text-lg font-semibold">#{colour}</div>
</div>
}

export default function Scoreboard ({ guesses, target, score }: ScoreboardProps): ReactElement {
  return <div className="absolute t-0 l-0 w-screen h-screen -mt-4 md:mt-0 font-mono text-zinc-300 bg-black/50 flex justify-center items-center">
    <div className="m-4 max-h-full bg-zinc-800 rounded-lg p-4">
      <h2 className="font-bold text-3xl md:text-4xl whitespace-nowrap text-center">Hexle - 29/08/22</h2>
      <div className="grid grid-cols-2">
        <Swatch name="Final Guess" colour={guesses[3]} />
        <Swatch name="Target" colour={target} />
      </div>
      <div className="text-center text-xl">
        Score:
        <span className="font-bold"> {score}</span>
      </div>
      <div className="text-center text-xl">
        {scoreMessage(score)}
      </div>
    </div>
  </div>
}
