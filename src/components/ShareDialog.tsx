import { ReactElement } from 'react'
import { GameData, getLastGame, scoreMessage } from '../Hexle'

export interface ShareDialogProps {
  gameData: GameData
  onClose: () => void
}

export default function ShareDialog ({ gameData, onClose }: ShareDialogProps): ReactElement {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const todaysGame = getLastGame(gameData)!
  const { guesses, target, score, date } = todaysGame
  const today = new Date(date).toLocaleDateString()

  function handleShare (): void {
    const shareData: ShareData = {
      title: 'Hexle',
      text: `
I scored ${score} in today's Hexle.
${scoreMessage(score)}

🔥 Streak: ${gameData.currentStreak}
🧮 Total Score: ${gameData.totalScore}

Try to beat my score!
`.trim(),
      url: 'https://hexle.fergcb.uk',
    }

    navigator.share(shareData)
      .catch(err => console.error(err))
  }

  return <div className="absolute top-0 left-0 w-screen h-screen md:mt-0 font-mono text-zinc-300 bg-zinc-800 flex justify-center items-center">
    <button onClick={onClose} className="absolute md:hidden top-4 right-4 flex justify-center items-center rounded-full fill-zinc-500 hover:bg-zinc-700 hover:fill-zinc-400 transition-colors duration-200 w-14 h-14">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-12 h-12">
        <path d="m24 27.2-9.9 9.9q-.7.7-1.625.7t-1.575-.7q-.7-.65-.7-1.575 0-.925.7-1.575L20.8 24l-9.9-9.9q-.65-.65-.65-1.6 0-.95.65-1.6.6-.65 1.55-.65.95 0 1.65.65l9.9 9.95 9.95-10q.65-.65 1.575-.65.925 0 1.625.65.65.7.65 1.625t-.65 1.575l-9.95 9.9 9.9 9.95q.7.7.7 1.625t-.7 1.575q-.65.7-1.6.7-.95 0-1.55-.7Z"/>
      </svg>
    </button>
    <div className="m-4 max-h-full bg-zinc-800 rounded-lg p-4 flex flex-col items-center">
      <div className="relative p-8 w-full flex flex-col items-center">
        <button onClick={onClose} className="absolute -top-14 -right-14 hidden md:flex justify-center items-center rounded-full fill-zinc-500 hover:bg-zinc-700 hover:fill-zinc-400 transition-colors duration-200 w-14 h-14">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-12 h-12">
            <path d="m24 27.2-9.9 9.9q-.7.7-1.625.7t-1.575-.7q-.7-.65-.7-1.575 0-.925.7-1.575L20.8 24l-9.9-9.9q-.65-.65-.65-1.6 0-.95.65-1.6.6-.65 1.55-.65.95 0 1.65.65l9.9 9.95 9.95-10q.65-.65 1.575-.65.925 0 1.625.65.65.7.65 1.625t-.65 1.575l-9.95 9.9 9.9 9.95q.7.7.7 1.625t-.7 1.575q-.65.7-1.6.7-.95 0-1.55-.7Z"/>
          </svg>
        </button>

        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-zinc-500 rounded-tl"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-zinc-500 rounded-tr"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-zinc-500 rounded-bl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-zinc-500 rounded-br"></div>

        <h2 className="font-bold text-2xl md:text-4xl whitespace-nowrap text-center mb-6">Hexle - {today}</h2>

        <div className="inline-flex justify-center bg-tint/15 p-2">
          { guesses.map(guess => <div style={{ background: `#${guess}` }} className="w-12 h-12"></div>) }
          <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-12 h-12 fill-zinc-600">
            <path d="M22.4 38.7q-.65-.6-.65-1.55 0-.95.7-1.65l9.25-9.25H9.85q-.95 0-1.6-.625Q7.6 25 7.6 23.95q0-.95.65-1.6.65-.65 1.6-.65H31.7l-9.25-9.3q-.7-.6-.7-1.575T22.4 9.2q.7-.65 1.625-.65t1.625.65l13.2 13.2q.35.3.525.7.175.4.175.85 0 .5-.175.9t-.525.75l-13.2 13.2q-.7.7-1.625.65-.925-.05-1.625-.75Z"/>
          </svg>
          <div style={{ background: `#${target}` }} className="w-12 h-12"></div>
        </div>

        <div className="text-xl">
          <p className="mt-8 text-center">I scored <span className="font-bold">{score}</span> in today's Hexle.</p>
          <p className="mb-6 text-center italic text-zinc-400">{ scoreMessage(score) }</p>
          <p>🔥 Streak: <span className="font-bold">{gameData.currentStreak}</span></p>
          <p>🧮 Total Score: <span className="font-bold">{gameData.totalScore}</span></p>
          <p className="mt-4 text-center">Try to beat my score:</p>
        </div>
        <span className="text-xl bg-tint/25 px-4 py-1 mt-1" style={{ color: `#${target}` }}>https://hexle.fergcb.uk/</span>
      </div>
      <div className="flex mt-8 items-center gap-2">
        <div>Take a screenshot or use your device's share menu:</div>
        <div>
          <button onClick={handleShare} className="flex justify-center items-center rounded-full fill-zinc-500 hover:bg-zinc-700 hover:fill-zinc-400 transition-colors duration-200 w-14 h-14">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-10 h-10 relative -left-0.5">
              <path d="M36.35 45.05q-2.8 0-4.8-2.025t-2-4.725q0-.4.1-.925t.2-1.025l-13.35-7.8q-.95 1-2.175 1.625-1.225.625-2.625.625-2.7 0-4.725-2.025Q4.95 26.75 4.95 24q0-2.8 2.025-4.775Q9 17.25 11.7 17.25q1.4 0 2.6.525 1.2.525 2.2 1.525l13.35-7.7q-.1-.35-.2-.925-.1-.575-.1-.925 0-2.75 2-4.75t4.8-2q2.75 0 4.75 2t2 4.75q0 2.75-2.025 4.75t-4.725 2q-1.5 0-2.65-.4t-2.05-1.4L18.25 22q.1.45.175 1.05.075.6.075.95t-.075.825q-.075.475-.175.925l13.4 7.5q.9-.8 2.025-1.275Q34.8 31.5 36.35 31.5q2.7 0 4.725 2.025Q43.1 35.55 43.1 38.3q0 2.7-2 4.725-2 2.025-4.75 2.025Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
}
