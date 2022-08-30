import { ReactElement, useState, useEffect, useCallback } from 'react'
import { calculateScore, getCSSTints, getDailyTarget, getIsoDate, getLastGame, getLongestStreak, getStreak, isValidHex, loadData } from '../Hexle'
import Observable from '../Observable'
import GuessList from './GuessList'
import HexBox from './HexBox'
import Keyboard from './Keyboard'
import Scoreboard from './Scoreboard'

export default function Game (): ReactElement {
  const target = getDailyTarget()

  const [gameData, setGameData] = useState(loadData)
  const [hasPlayedToday, setHasPlayedToday] = useState(false)
  const [numGuessed, setNumGuessed] = useState(0)
  const [guesses, setGuesses] = useState<string[]>(['', '', '', ''])
  const [hex, setHex] = useState<string>('')
  const [invalid, setInvalid] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const keySource = new Observable<string>()

  const doEndGame = useCallback(() => {
    const score = calculateScore(guesses[3], target)
    const date = getIsoDate(new Date())

    const data = structuredClone(gameData)

    data.currentStreak = getStreak(data)
    data.longestStreak = getLongestStreak(data)
    data.totalScore += score

    data.games[date] = { target, guesses, score, date }

    localStorage.setItem('hexleData', JSON.stringify(data))

    setGameOver(true)
    setGameData(data)
  }, [gameData, guesses, target])

  useEffect(() => {
    if (gameOver) return
    if (numGuessed === 4) {
      doEndGame()
    }
  }, [guesses, numGuessed, gameOver, doEndGame])

  useEffect(() => {
    const today = getIsoDate(new Date())
    const lastGame = getLastGame(gameData)
    setHasPlayedToday(lastGame !== undefined && lastGame.date === today)
  }, [gameData])

  function handleGuess (): void {
    if (numGuessed > 3) return

    if (!isValidHex(hex)) {
      setInvalid(true)
      setTimeout(() => setInvalid(false), 500)
      setHex('')
      return
    }

    const localGuesses = guesses.slice()
    localGuesses[numGuessed] = hex

    setNumGuessed(numGuessed + 1)
    setGuesses(localGuesses)
    setHex('')
  }

  function handleKey (key: string): void {
    keySource.broadcast(key)
  }

  function handleVirtualKey (value: string): void {
    if (value === 'backspace') setHex(hex.substring(0, hex.length - 1))
    else if (value === 'enter') handleGuess()
    else if (hex.length < 6) setHex(hex + value)
  }

  return <div style={{ backgroundColor: `#${target}`, ...getCSSTints(target) }} className="w-screen h-screen flex flex-col items-center md:justify-center p-4 gap-4">
    <HexBox value={hex} invalid={invalid} disabled={gameOver || hasPlayedToday} onUpdate={setHex} onKey={handleKey} onSubmit={handleGuess} />
    <GuessList guesses={guesses} />
    <Keyboard onClick={handleVirtualKey} keySource={keySource} />
    {(gameOver || hasPlayedToday) && <Scoreboard gameData={gameData} />}
  </div>
}
