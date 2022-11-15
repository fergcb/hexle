import { ReactElement } from 'react'
import { getCSSTints, isColourDark, loadData } from '../Hexle'

export default function HistoryTab (): ReactElement {
  const gameData = loadData()
  const games = Object.values(gameData.games)

  return <div>
    <h1 className="font-bold text-2xl sm:text-4xl whitespace-nowrap text-center mb-4">History</h1>
    <ul className="max-h-[75vh] flex flex-col gap-2 p-2 items-stretch overflow-y-scroll">
      { games.map(game => {
        return <li className="bg-zinc-900 rounded p-2 pl-4 flex items-center justify-between" style={getCSSTints(isColourDark(game.target))}>
          <div>
            <h3 className="font-bold text-lg sm:text-xl whitespace-nowrap text-center">{ new Date(game.date).toLocaleDateString() }</h3>
            <div className="font-bold">
              <span className="text-zinc-400">Score:</span>
              {game.score}
            </div>
          </div>
          <div className="inline-flex justify-center bg-tint/10 p-2">
            { game.guesses.map(guess => <div style={{ background: `#${guess}` }} className="w-12 h-12"></div>) }
            <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-12 h-12 fill-zinc-600">
              <path d="M22.4 38.7q-.65-.6-.65-1.55 0-.95.7-1.65l9.25-9.25H9.85q-.95 0-1.6-.625Q7.6 25 7.6 23.95q0-.95.65-1.6.65-.65 1.6-.65H31.7l-9.25-9.3q-.7-.6-.7-1.575T22.4 9.2q.7-.65 1.625-.65t1.625.65l13.2 13.2q.35.3.525.7.175.4.175.85 0 .5-.175.9t-.525.75l-13.2 13.2q-.7.7-1.625.65-.925-.05-1.625-.75Z"/>
            </svg>
            <div style={{ background: `#${game.target}` }} className="w-12 h-12"></div>
          </div>
        </li>
      }) }
    </ul>
  </div>
}
