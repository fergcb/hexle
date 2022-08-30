import { ReactElement, useState, useEffect } from 'react'
import Observable from '../Observable'
import GuessList from './GuessList'
import HexBox from './HexBox'
import Keyboard from './Keyboard'
import Scoreboard from './Scoreboard'

function isValidHex (hex: string): boolean {
  return hex.length === 6
}

type Hex = string
type RGB = [number, number, number]
type LAB = [number, number, number]

function HexToRGB (hex: Hex): RGB {
  const hn = parseInt(hex, 16)
  return [
    hn >> 16,
    (hn >> 8) & 0xff,
    hn & 0xff,
  ]
}

function RGBtoLAB (rgb: RGB): LAB {
  let r = rgb[0] / 255
  let g = rgb[1] / 255
  let b = rgb[2] / 255

  let x, y, z

  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883

  x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116
  y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116
  z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116

  return [
    (116 * y) - 16,
    500 * (x - y),
    200 * (y - z),
  ]
}

function delta (a: Hex, b: Hex): number {
  const rgbA = HexToRGB(a)
  const rgbB = HexToRGB(b)
  const labA = RGBtoLAB(rgbA)
  const labB = RGBtoLAB(rgbB)

  const deltaL = labA[0] - labB[0]
  const deltaA = labA[1] - labB[1]
  const deltaB = labA[2] - labB[2]

  const c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2])
  const c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2])

  const deltaC = c1 - c2

  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH)

  const sc = 1.0 + 0.045 * c1
  const sh = 1.0 + 0.015 * c1
  const deltaLKlsl = deltaL / (1.0)
  const deltaCkcsc = deltaC / (sc)
  const deltaHkhsh = deltaH / (sh)

  const i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh

  return i < 0 ? 0 : Math.sqrt(i)
}

function calculateScore (guess: Hex, target: Hex): number {
  return Math.round((100 - delta(guess, target)) * 50)
}

interface Outcome {
  target: string
  guesses: string[]
  score: number
  date: string
}

interface GameData {
  games: Outcome[]
  currentStreak: number
  longestStreak: number
  totalScore: number
}

function loadData (): GameData {
  const json = localStorage.getItem('hexleData')
  if (json === null) {
    return {
      games: [],
      currentStreak: 0,
      longestStreak: 0,
      totalScore: 0,
    }
  }
  const data = JSON.parse(json)
  console.log(data)
  return data
}

export default function Game (): ReactElement {
  const target = 'ef4444'

  const [gameData, setGameData] = useState(loadData)
  const [numGuessed, setNumGuessed] = useState(0)
  const [guesses, setGuesses] = useState<string[]>(['', '', '', ''])
  const [hex, setHex] = useState<string>('')
  const [invalid, setInvalid] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const keySource = new Observable<string>()

  useEffect(() => {
    localStorage.setItem('hexleData', JSON.stringify(gameData))
  }, [gameData])

  function handleUpdate (value: string): void {
    setHex(value)
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
    if (numGuessed === 3) {
      doEndGame()
    }
  }

  function handleKey (key: string): void {
    keySource.broadcast(key)
  }

  function handleVirtualKey (value: string): void {
    if (value === 'backspace') setHex(hex.substring(0, hex.length - 1))
    else if (value === 'enter') handleGuess()
    else if (hex.length < 6) setHex(hex + value)
  }

  function doEndGame (): void {
    const score = calculateScore(hex, target)
    setScore(score)
    setGameOver(true)
    const lastGame = gameData.games[gameData.games.length - 1]

    gameData.games.push({
      target, guesses, score, date: new Date().toISOString(),
    })

    gameData.totalScore += score

    if (lastGame !== undefined) {
      const lastGameDay = new Date(lastGame.date).getTime() / 86400000
      const today = new Date().getTime() / 86400000
      gameData.currentStreak = (today - lastGameDay) < 2
        ? gameData.currentStreak + 1
        : 1
    } else {
      gameData.currentStreak = 1
    }

    if (gameData.currentStreak > gameData.longestStreak) gameData.longestStreak = gameData.currentStreak

    setGameData(gameData)
  }

  return <div className="w-screen h-screen bg-red-500 flex flex-col items-center md:justify-center p-4 gap-4">
    <HexBox value={hex} invalid={invalid} onUpdate={handleUpdate} onKey={handleKey} onSubmit={handleGuess} />
    <GuessList guesses={guesses} />
    <Keyboard onClick={handleVirtualKey} keySource={keySource} />
    {gameOver && <Scoreboard guesses={guesses} target={target} score={score} />}
  </div>
}
