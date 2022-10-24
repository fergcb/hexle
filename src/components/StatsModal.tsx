import { ReactElement, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { getDailyTarget, HexToRGB, loadData, RGBtoHSL } from '../Hexle'

export interface StatsModalProps {
  onClose: () => void
}

enum TimeScale {
  ALL_TIME = Infinity,
  DAYS_30 = 30,
  DAYS_7 = 7
}

export default function StatsModal ({ onClose }: StatsModalProps): ReactElement {
  const [timeScale, setTimeScale] = useState(TimeScale.ALL_TIME)

  const gameData = loadData()
  const allGames = Object.values(gameData.games)
  const games = allGames
    .filter(game => {
      if (timeScale === TimeScale.ALL_TIME) return true
      const today = new Date()
      const gameDate = new Date(game.date)
      const diff = today.getTime() - gameDate.getTime()
      const days = diff / 1000 / 60 / 60 / 24
      return days <= timeScale
    })

  const points = games.map(game => ({
    time: new Date(game.date).getTime(),
    score: game.score,
  }))

  const allScoresbyHue = games
    .map(game => ({
      hue: RGBtoHSL(HexToRGB(game.target))[0],
      score: game.score,
    }))
    .sort((a, b) => a.hue - b.hue)

  const collatedHuePoints: Array<{hue: number, scores: number[]}> = [{
    hue: allScoresbyHue[0].hue,
    scores: [allScoresbyHue[0].score],
  }]

  for (let i = 1; i < allScoresbyHue.length; i++) {
    const point = allScoresbyHue[i]

    const last = collatedHuePoints[collatedHuePoints.length - 1]
    if (point.hue === last.hue) {
      last.scores.push(point.score)
    } else {
      collatedHuePoints.push({
        hue: point.hue,
        scores: [point.score],
      })
    }
  }

  const huePoints = collatedHuePoints.map(point => ({
    hue: point.hue,
    score: Math.round(point.scores.reduce((a, b) => a + b) / point.scores.length),
  }))

  const minHue = huePoints.reduce((a, b) => a.hue < b.hue ? a : b)
  const maxHue = huePoints.reduce((a, b) => a.hue > b.hue ? a : b)

  if (maxHue.hue !== 360) {
    huePoints.push({
      hue: 360,
      score: (maxHue.score + minHue.score) / 2,
    })
  }

  if (minHue.hue !== 0) {
    huePoints.unshift({
      hue: 0,
      score: (maxHue.score + minHue.score) / 2,
    })
  }

  const dateFormatter = (timestamp: number): string => new Date(timestamp).toLocaleDateString() + '     '

  const highScore = allGames
    .map(game => game.score)
    .reduce((a, b) => a > b ? a : b)

  const total = allGames
    .map(game => game.score)
    .reduce((a, b) => a + b)

  const mean = (total / allGames.length).toFixed(0)

  return <div className="absolute t-0 l-0 w-screen h-screen -mt-4 md:mt-0 font-mono text-zinc-300 bg-zinc-800 flex justify-center sm:items-center pt-8 sm:p-0">
    <button onClick={onClose} className="absolute md:hidden top-1 right-1 sm:top-4 sm:right-4 flex justify-center items-center rounded-full fill-zinc-500 hover:bg-zinc-700 hover:fill-zinc-400 transition-colors duration-200 w-10 h-10 sm:w-14 sm:h-14">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-10 h-10 sm:w-12 sm:h-12">
        <path d="m24 27.2-9.9 9.9q-.7.7-1.625.7t-1.575-.7q-.7-.65-.7-1.575 0-.925.7-1.575L20.8 24l-9.9-9.9q-.65-.65-.65-1.6 0-.95.65-1.6.6-.65 1.55-.65.95 0 1.65.65l9.9 9.95 9.95-10q.65-.65 1.575-.65.925 0 1.625.65.65.7.65 1.625t-.65 1.575l-9.95 9.9 9.9 9.95q.7.7.7 1.625t-.7 1.575q-.65.7-1.6.7-.95 0-1.55-.7Z"/>
      </svg>
    </button>
    <div className="max-h-full p-2 md:p-0 flex flex-col items-flex-start w-full max-w-[60ch] relative overflow-x-hidden overflow-y-auto sm:overflow-hidden">
      <button onClick={onClose} className="absolute -top-14 -right-14 hidden md:flex justify-center items-center rounded-full fill-zinc-500 hover:bg-zinc-700 hover:fill-zinc-400 transition-colors duration-200 w-14 h-14">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-12 h-12">
          <path d="m24 27.2-9.9 9.9q-.7.7-1.625.7t-1.575-.7q-.7-.65-.7-1.575 0-.925.7-1.575L20.8 24l-9.9-9.9q-.65-.65-.65-1.6 0-.95.65-1.6.6-.65 1.55-.65.95 0 1.65.65l9.9 9.95 9.95-10q.65-.65 1.575-.65.925 0 1.625.65.65.7.65 1.625t-.65 1.575l-9.95 9.9 9.9 9.95q.7.7.7 1.625t-.7 1.575q-.65.7-1.6.7-.95 0-1.55-.7Z"/>
        </svg>
      </button>

      <h1 className="font-bold text-2xl sm:text-4xl whitespace-nowrap text-center mb-4">My Stats</h1>
      <h2 className="font-bold text-xl sm:text-2xl whitespace-nowrap mb-2 flex justify-between items-center">
        Score History:
        <select onChange={e => setTimeScale(parseFloat(e.target.value) as TimeScale)} className="bg-tint/40 text-base font-semibold rounded py-1 px-2 w-32">
          <option value={TimeScale.ALL_TIME}>All time</option>
          <option value={TimeScale.DAYS_30}>≤30 days</option>
          <option value={TimeScale.DAYS_7}>≤7 days</option>
        </select>
      </h2>
      <div className="w-[calc(100% + 1.5rem)] bg-tint/40 rounded pr-4 pt-4">
        <ResponsiveContainer width="100%" aspect={2}>
          <LineChart data={points}>
            <Line type="monotone" dataKey="score" stroke={'#' + getDailyTarget()} strokeWidth={3} dot={false} />
            <XAxis dataKey="time" type="number" tickFormatter={dateFormatter} domain={['dataMin', 'dataMax']} minTickGap={40} stroke="#a1a1aa" strokeWidth={2}/>
            <YAxis domain={[0, 5000]} stroke="#a1a1aa" strokeWidth={2}/>
            <Tooltip labelFormatter={dateFormatter} contentStyle={{ backgroundColor: '#18181b', borderRadius: '0.25rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <h2 className="font-bold text-xl sm:text-2xl whitespace-nowrap mt-4 flex justify-between items-center">Performance by Hue:</h2>
      <div className="w-full -mb-4">
        <ResponsiveContainer width="100%" aspect={4}>
          <AreaChart data={huePoints}>
            <defs>
              <linearGradient id="hues" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f04c4c"/>
                <stop offset="16.66%" stopColor="#f0f04c"/>
                <stop offset="33.33%" stopColor="#4cf04c"/>
                <stop offset="50%" stopColor="#4cf0f0"/>
                <stop offset="66.66%" stopColor="#4c4cf0"/>
                <stop offset="83.33%" stopColor="#f04cf0"/>
                <stop offset="100%" stopColor="#f04c4c"/>
              </linearGradient>
            </defs>
            <Area type="basis" dataKey="score" stroke="none" strokeWidth={3} dot={false} fillOpacity={1} fill="url(#hues)" />
            <XAxis dataKey="hue" type="number" domain={['dataMin', 'dataMax']} stroke="none" tick={false}/>

          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-6 justify-center">
        <div className="text-center font-bold">
          <h3>Games Played</h3>
          <div className="text-xl sm:text-3xl">{allGames.length}</div>
        </div>
        <div className="text-center font-bold">
          <h3>Current Streak</h3>
          <div className="text-xl sm:text-3xl">{gameData.currentStreak}</div>
        </div>
        <div className="text-center font-bold">
          <h3>Longest Streak</h3>
          <div className="text-xl sm:text-3xl">{gameData.longestStreak}</div>
        </div>
        <div className="text-center font-bold">
          <h3>All Time Score</h3>
          <div className="text-xl sm:text-3xl">{total}</div>
        </div>
        <div className="text-center font-bold">
          <h3>Personal Best</h3>
          <div className="text-xl sm:text-3xl">{highScore}</div>
        </div>
        <div className="text-center font-bold">
          <h3>All Time Avg.</h3>
          <div className="text-xl sm:text-3xl">{mean}</div>
        </div>
      </div>
    </div>
  </div>
}
