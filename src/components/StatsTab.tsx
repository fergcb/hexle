import { ReactElement, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { ContentType } from 'recharts/types/component/Tooltip'
import { getDailyTarget, HexToRGB, loadData, Outcome, RGBtoHSL } from '../Hexle'

enum TimeScale {
  ALL_TIME = Infinity,
  DAYS_30 = 30,
  DAYS_7 = 7
}

interface Game extends Outcome {
  average: number
}

export default function StatsTab (): ReactElement {
  const [timeScale, setTimeScale] = useState(TimeScale.ALL_TIME)

  const gameData = loadData()
  const allGames = Object
    .values(gameData.games)
    .map((outcome, i, games) => {
      const game = outcome as Game
      game.average = Math.round(games
        .slice(0, i + 1)
        .map(game => game.score)
        .reduce((a, b) => a + b) / (i + 1))
      return game
    })

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
    average: game.average,
  }))

  const hueBars = [
    { name: 'red', color: '#ef4444', scores: [] as number[], averageScore: 0 },
    { name: 'orange', color: '#f97316', scores: [], averageScore: 0 },
    { name: 'yellow', color: '#eab308', scores: [], averageScore: 0 },
    { name: 'green', color: '#84cc16', scores: [], averageScore: 0 },
    { name: 'cyan', color: '#06b6d4', scores: [], averageScore: 0 },
    { name: 'blue', color: '#3b82f6', scores: [], averageScore: 0 },
    { name: 'indigo', color: '#8b5cf6', scores: [], averageScore: 0 },
    { name: 'violet', color: '#d946ef', scores: [], averageScore: 0 },
  ]

  allGames.forEach(game => {
    const hue = RGBtoHSL(HexToRGB(game.target))[0]
    let bar
    if (hue <= 15 || hue > 340) bar = 0
    else if (hue >= 16 && hue < 40) bar = 1
    else if (hue >= 41 && hue < 65) bar = 2
    else if (hue >= 66 && hue < 150) bar = 3
    else if (hue >= 151 && hue < 190) bar = 4
    else if (hue >= 190 && hue < 255) bar = 5
    else if (hue >= 256 && hue < 280) bar = 6
    else bar = 7

    hueBars[bar].scores.push(game.score)
  })

  hueBars.forEach(bar => {
    if (bar.scores.length > 0) {
      bar.averageScore = bar.scores.reduce((a, b) => a + b) / bar.scores.length
    }
  })

  const minScore = hueBars
    .filter(bar => bar.scores.length !== 0)
    .reduce((a, b) => a.averageScore < b.averageScore ? a : b)
    .averageScore

  hueBars.forEach(bar => {
    if (bar.scores.length === 0) {
      bar.averageScore = minScore
      bar.color = 'transparent'
    }
  })

  const dateFormatter = (timestamp: number): string => new Date(timestamp).toLocaleDateString() + '     '

  const tooltipContent: ContentType<number, string> = ({ active, payload, label }) => {
    active = active ?? false
    if (active && payload !== undefined && payload.length > 0) {
      const date = new Date(label).toLocaleDateString()
      const average = payload[0].value
      const score = payload[2].value
      return (
        <div className="rounded-md drop-shadow-lg bg-zinc-900 p-2 border border-zinc-600">
          <h4 className="font-bold text-sm md:text-lg">{date}</h4>
          <ul>
            <li className="text-sm md:text-base flex items-center">
              <span className="inline-block w-4 h-4 rounded-full border-2 border-tint/10 mr-2" style={{ backgroundColor: '#' + getDailyTarget() }}></span>
              Score: {score}
            </li>
            <li className="text-sm md:text-base flex items-center">
              <span className="inline-block w-4 h-4 rounded-full border-2 border-zinc-500 mr-2"></span>
              Avg.: {average}
            </li>
          </ul>
        </div>
      )
    }
  }

  const highScore = allGames
    .map(game => game.score)
    .reduce((a, b) => a > b ? a : b)

  const total = allGames
    .map(game => game.score)
    .reduce((a, b) => a + b)

  const mean = (total / allGames.length).toFixed(0)

  return <div>
    <h1 className="font-bold text-2xl sm:text-4xl whitespace-nowrap text-center mb-4">My Stats</h1>
    <h2 className="font-bold text-xl sm:text-2xl whitespace-nowrap mb-2 flex justify-between items-center">
      Score History:
      <select onChange={e => setTimeScale(parseFloat(e.target.value) as TimeScale)} className="bg-zinc-900 text-base font-semibold rounded py-1 px-2 w-32">
        <option value={TimeScale.ALL_TIME}>All time</option>
        <option value={TimeScale.DAYS_30}>≤30 days</option>
        <option value={TimeScale.DAYS_7}>≤7 days</option>
      </select>
    </h2>
    <div className="w-[calc(100% + 1.5rem)] rounded pr-4 pt-4 bg-zinc-900">
      <ResponsiveContainer width="100%" aspect={2}>
        <LineChart data={points}>
          <Line type="monotone" dataKey="average" stroke="#71717a" strokeWidth={2} dot={false} strokeDasharray="6 4" />
          <Line type="monotone" dataKey="score" stroke={'var(--tint-05)'} strokeWidth={7} dot={false} name="contrast" />
          <Line type="monotone" dataKey="score" stroke={'#' + getDailyTarget()} strokeWidth={3} dot={false} />
          <XAxis dataKey="time" type="number" tickFormatter={dateFormatter} domain={['dataMin', 'dataMax']} minTickGap={40} stroke="#a1a1aa" strokeWidth={2} tickMargin={8}/>
          <YAxis domain={[(dataMin: number) => Math.max(0, dataMin - 1000), 5000]} stroke="#a1a1aa" strokeWidth={2} />
          <Tooltip labelFormatter={dateFormatter} content={tooltipContent} contentStyle={{ backgroundColor: '#18181b', borderRadius: '0.25rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
    <h2 className="font-bold text-xl sm:text-2xl whitespace-nowrap mt-4 flex justify-between items-center">Performance by Hue:</h2>
    <div className="w-full mt-2 mb-2">
      <ResponsiveContainer width="100%" aspect={5}>
        <BarChart data={hueBars}>
          <Bar dataKey="averageScore" stroke="none" minPointSize={5} radius={[4, 4, 0, 0]}>
            {
              hueBars.map((_, index) => (
                <Cell key={`cell-${index}`} fill={hueBars[index].color} />
              ))
            }
          </Bar>
          <XAxis strokeWidth={3} height={1} tick={false} stroke="#71717a"></XAxis>
          <YAxis domain={[(minData: number) => Math.max(0, minData - 500), 'maxData']} stroke="none" width={0}></YAxis>
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="flex flex-wrap gap-6 justify-center overflow-y-scroll pt-2 pb-4">
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
}
