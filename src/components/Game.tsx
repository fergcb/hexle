import { ReactElement, useState, useEffect, useCallback } from 'react'
import { calculateScore, getCSSTints, getDailyTarget, getToday, getLastGame, getLongestStreak, getStreak, isValidHex, loadData, getRandomTarget, isColourDark } from '../Hexle'
import Observable from '../Observable'
import GuessList from './GuessList'
import HexBox from './HexBox'
import Instructions from './Instructions'
import Keyboard from './Keyboard'
import Scoreboard from './Scoreboard'

export interface GameProps {
  unlimited?: boolean
}

export default function Game ({ unlimited = false }: GameProps): ReactElement {
  const [gameData, setGameData] = useState(loadData)
  const [numGuessed, setNumGuessed] = useState(0)
  const [guesses, setGuesses] = useState<string[]>(['', '', '', ''])
  const [hex, setHex] = useState<string>('')
  const [invalid, setInvalid] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [showInstructions, setShowInstructions] = useState(!unlimited && !hasPlayedBefore())
  const [target] = useState(unlimited ? getRandomTarget() : getDailyTarget())
  const [theme, setTheme] = useState<string>('auto')
  const [highContrast, setHighContrast] = useState(localStorage.getItem('hexle-highContrast') === 'true')

  const isDark = isColourDark(target)
  const tints = getCSSTints(theme === 'auto' ? isDark : (theme !== 'dark'), highContrast)

  const keySource = new Observable<string>()

  const doEndGame = useCallback(() => {
    const score = calculateScore(guesses[3], target)
    const date = getToday()
    const data = structuredClone(gameData)

    if (unlimited) {
      data.unlimitedGames.push({ target, guesses, score, date })
    } else {
      data.currentStreak = getStreak(data)
      data.longestStreak = getLongestStreak(data)
      data.totalScore += score

      data.games[date] = { target, guesses, score, date }
    }

    localStorage.setItem('hexleData', JSON.stringify(data))

    setGameOver(true)
    setGameData(data)
  }, [gameData, guesses, target, unlimited])

  useEffect(() => {
    if (gameOver) return
    if (numGuessed === 4) {
      doEndGame()
    }
  }, [guesses, numGuessed, gameOver, doEndGame])

  function hasPlayedToday (): boolean {
    if (unlimited) return false
    const lastGame = getLastGame(gameData)
    if (lastGame === undefined) return false
    return lastGame.date === getToday()
  }

  function hasPlayedBefore (): boolean {
    return Object.entries(gameData.games).length > 0
  }

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

  function handleChangeHighContrast (value: boolean): void {
    setHighContrast(value)
    localStorage.setItem('hexle-highContrast', String(value))
  }

  return <div style={{ backgroundColor: `#${target}`, ...tints }} className="w-screen h-screen flex flex-col items-center md:justify-center p-4 gap-4">
    <HexBox value={hex} invalid={invalid} disabled={gameOver || hasPlayedToday()} onUpdate={setHex} onKey={handleKey} onSubmit={handleGuess} />
    <GuessList guesses={guesses} />
    <div className="mt-auto md:my-10"></div>
    <Keyboard onClick={handleVirtualKey} keySource={keySource} onSummonHelp={() => setShowInstructions(true)} onChangeTheme={value => setTheme(value)} onChangeHighContrast={handleChangeHighContrast} />
    {(gameOver || (!unlimited && hasPlayedToday())) && <Scoreboard {...{ gameData, unlimited }} />}
    {(showInstructions) && <Instructions onClose={() => setShowInstructions(false)} />}
  </div>
}
