import { ReactElement, useState } from 'react'
import { GameData, getLastGame, scoreMessage } from '../Hexle'
import Button from './Button'
import ShareDialog from './ShareDialog'

export interface ScoreboardProps {
  gameData: GameData
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

export default function Scoreboard ({ gameData }: ScoreboardProps): ReactElement {
  const [showShareDialog, setShowShareDialog] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const todaysGame = getLastGame(gameData)!
  const { guesses, target, score, date } = todaysGame
  const today = new Date(date).toLocaleDateString()

  return <>
    <div className="absolute t-0 l-0 w-screen h-screen -mt-4 md:mt-0 font-mono text-zinc-300 bg-tint/50 flex justify-center items-center">
      <div className="m-4 max-h-full bg-zinc-800 rounded-lg p-4 flex flex-col items-center">
        <h2 className="font-bold text-3xl md:text-4xl whitespace-nowrap text-center mb-8l">Hexle - {today}</h2>
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
        <Button className="mt-4" onClick={() => setShowShareDialog(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-6 h-6 fill-tint/60"><path d="M36.35 45.05q-2.8 0-4.8-2.025t-2-4.725q0-.4.1-.925t.2-1.025l-13.35-7.8q-.95 1-2.175 1.625-1.225.625-2.625.625-2.7 0-4.725-2.025Q4.95 26.75 4.95 24q0-2.8 2.025-4.775Q9 17.25 11.7 17.25q1.4 0 2.6.525 1.2.525 2.2 1.525l13.35-7.7q-.1-.35-.2-.925-.1-.575-.1-.925 0-2.75 2-4.75t4.8-2q2.75 0 4.75 2t2 4.75q0 2.75-2.025 4.75t-4.725 2q-1.5 0-2.65-.4t-2.05-1.4L18.25 22q.1.45.175 1.05.075.6.075.95t-.075.825q-.075.475-.175.925l13.4 7.5q.9-.8 2.025-1.275Q34.8 31.5 36.35 31.5q2.7 0 4.725 2.025Q43.1 35.55 43.1 38.3q0 2.7-2 4.725-2 2.025-4.75 2.025Z"/></svg>
          Share
        </Button>
        <div className="flex flex-wrap max-w-sm mt-4 gap-4 justify-center">
          <div className="text-center font-bold">
            <h3>Current Streak:</h3>
            <div className="text-3xl">{gameData.currentStreak}</div>
          </div>
          <div className="text-center font-bold">
            <h3>Longest Streak:</h3>
            <div className="text-3xl">{gameData.longestStreak}</div>
          </div>
          <div className="text-center font-bold">
            <h3>All Time Score:</h3>
            <div className="text-3xl">{gameData.totalScore}</div>
          </div>
        </div>
      </div>
    </div>
    { showShareDialog && <ShareDialog gameData={gameData} onClose={() => setShowShareDialog(false)} /> }
  </>
}
