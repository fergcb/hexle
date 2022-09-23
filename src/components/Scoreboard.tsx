import { ReactElement, useState } from 'react'
import { GameData, getLastGame, scoreMessage } from '../Hexle'
import Button from './Button'
import ShareDialog from './ShareDialog'

export interface ScoreboardProps {
  gameData: GameData
  unlimited: boolean
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

export default function Scoreboard ({ gameData, unlimited }: ScoreboardProps): ReactElement {
  const [showShareDialog, setShowShareDialog] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const todaysGame = unlimited ? gameData.unlimitedGames[gameData.unlimitedGames.length - 1] : getLastGame(gameData)!
  const { guesses, target, score, date } = todaysGame
  const today = new Date(date).toLocaleDateString()

  return <>
    <div className="absolute t-0 l-0 w-screen h-screen -mt-4 md:mt-0 font-mono text-zinc-300 bg-tint/50 flex justify-center items-center">
      <div className="m-4 max-h-full bg-zinc-800 rounded-lg p-4 flex flex-col items-center">
        <h2 className="font-bold text-3xl md:text-4xl whitespace-nowrap text-center mb-8l"> { unlimited ? 'Hexle Unlimited' : `Hexle - ${today}`}</h2>
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
        { !unlimited
          ? <>
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
            </>
          : <>
            <div className="mt-4 flex gap-4">
              <Button dark link="/">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-6 h-6"><path d="M17.95 32.7q-2 0-3.4-1.4t-1.4-3.4q0-2 1.4-3.4t3.4-1.4q2 0 3.4 1.4t1.4 3.4q0 2-1.4 3.4t-3.4 1.4ZM9.5 45.1q-1.85 0-3.2-1.375T4.95 40.55V10.5q0-1.9 1.35-3.25T9.5 5.9h2.95V4.8q0-.7.625-1.325t1.375-.625q.85 0 1.4.625.55.625.55 1.325v1.1h15.2V4.8q0-.7.575-1.325T33.6 2.85q.8 0 1.375.625T35.55 4.8v1.1h2.95q1.9 0 3.25 1.35t1.35 3.25v30.05q0 1.8-1.35 3.175Q40.4 45.1 38.5 45.1Zm0-4.55h29V19.6h-29v20.95Z"/></svg>
                Daily
              </Button>
              <Button color={target} link="/unlimited">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-6 h-6"><path d="M24 45.25q-7.45 0-12.8-4.775Q5.85 35.7 5.1 28.45q-.15-.95.475-1.625T7.2 26.15q.9 0 1.6.625.7.625.85 1.675.85 5.3 4.9 8.75 4.05 3.45 9.45 3.45 6.05 0 10.275-4.225Q38.5 32.2 38.5 26.15q0-6.1-4.1-10.3-4.1-4.2-10.2-4.2h-1.15l2.15 2.05q.55.6.5 1.325-.05.725-.5 1.125-.55.55-1.225.55t-1.175-.55l-5.35-5.35q-.35-.25-.5-.675-.15-.425-.15-.925 0-.45.175-.875T17.5 7.6l5.3-5.35q.55-.5 1.225-.5t1.225.5q.45.55.425 1.25-.025.7-.475 1.1l-2.45 2.45h1.2q4 0 7.5 1.5t6.075 4.075Q40.1 15.2 41.6 18.675q1.5 3.475 1.5 7.475 0 3.95-1.5 7.45t-4.075 6.075Q34.95 42.25 31.45 43.75T24 45.25Z"/></svg>
                Play Again
              </Button>
            </div>
          </>
        }
      </div>
    </div>
    { showShareDialog && <ShareDialog gameData={gameData} onClose={() => setShowShareDialog(false)} /> }
  </>
}
