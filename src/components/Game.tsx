import { ReactElement, useState, useEffect, useCallback } from 'react'
import { calculateScore, getCSSTints, getDailyTarget, getToday, getLastGame, getLongestStreak, getStreak, isValidHex, loadData } from '../Hexle'
import Observable from '../Observable'
import GuessList from './GuessList'
import HelpButton from './HelpButton'
import HexBox from './HexBox'
import Instructions from './Instructions'
import Keyboard from './Keyboard'
import Scoreboard from './Scoreboard'

export default function Game (): ReactElement {
  const [gameData, setGameData] = useState(loadData)
  const [numGuessed, setNumGuessed] = useState(0)
  const [guesses, setGuesses] = useState<string[]>(['', '', '', ''])
  const [hex, setHex] = useState<string>('')
  const [invalid, setInvalid] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [showInstructions, setShowInstructions] = useState(!hasPlayedBefore())

  const keySource = new Observable<string>()

  const doEndGame = useCallback(() => {
    const target = getDailyTarget()

    const score = calculateScore(guesses[3], target)
    const date = getToday()

    const data = structuredClone(gameData)

    data.currentStreak = getStreak(data)
    data.longestStreak = getLongestStreak(data)
    data.totalScore += score

    data.games[date] = { target, guesses, score, date }

    localStorage.setItem('hexleData', JSON.stringify(data))

    setGameOver(true)
    setGameData(data)
  }, [gameData, guesses])

  useEffect(() => {
    if (gameOver) return
    if (numGuessed === 4) {
      doEndGame()
    }
  }, [guesses, numGuessed, gameOver, doEndGame])

  function hasPlayedToday (): boolean {
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

  const target = getDailyTarget()

  return <div style={{ backgroundColor: `#${target}`, ...getCSSTints(target) }} className="w-screen h-screen flex flex-col items-center md:justify-center p-4 gap-4">
    <HexBox value={hex} invalid={invalid} disabled={gameOver || hasPlayedToday()} onUpdate={setHex} onKey={handleKey} onSubmit={handleGuess} />
    <GuessList guesses={guesses} />
    <div className="my-auto md:my-8"></div>
    <HelpButton onClick={() => setShowInstructions(true)}></HelpButton>
    <Keyboard onClick={handleVirtualKey} keySource={keySource} />
    {(gameOver || hasPlayedToday()) && <Scoreboard gameData={gameData} />}
    {(showInstructions) && <Instructions onClose={() => setShowInstructions(false)} />}
  </div>
}
