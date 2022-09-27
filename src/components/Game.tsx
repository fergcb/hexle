import { ReactElement, useState, useEffect, useCallback } from 'react'
import { calculateScore, getCSSTints, getDailyTarget, getToday, getLastGame, getLongestStreak, getStreak, isValidHex, loadData, getRandomTarget, isColourDark } from '../Hexle'
import Observable from '../Observable'
import GuessList from './GuessList'
import HelpButton from './HelpButton'
import HexBox from './HexBox'
import Instructions from './Instructions'
import Keyboard from './Keyboard'
import Scoreboard from './Scoreboard'
import UnlimitedModal from './UnlimitedModal'

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
  const [modalContent, setModalContent] = useState<ReactElement | null>(null)
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

  function showUnlimitedAd (): void {
    localStorage.setItem('seen-unlimited-ad', 'true')
    setModalContent(<UnlimitedModal onClose={() => setModalContent(null)} />)
  }

  function seenUnlimitedAd (): boolean {
    return localStorage.getItem('seen-unlimited-ad') === 'true'
  }

  return <div style={{ backgroundColor: `#${target}`, ...tints }} className="w-screen h-screen flex flex-col items-center md:justify-center p-4 gap-4">
    <HexBox value={hex} invalid={invalid} disabled={gameOver || hasPlayedToday()} onUpdate={setHex} onKey={handleKey} onSubmit={handleGuess} />
    <GuessList guesses={guesses} />
    <div className="mt-auto md:my-4"></div>
    <div className="flex gap-4">
      <HelpButton onClick={() => setShowInstructions(true)}></HelpButton>
      { (!unlimited) && <>
        <button onClick={showUnlimitedAd} className={'relative block w-12 h-12 min-h-[48px]' + (!seenUnlimitedAd() ? ' animate-pulse' : '')}>
          {!seenUnlimitedAd() && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-16 h-16 absolute -top-2 -left-2 fill-tint/20 animate-ping"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg> }
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[52px] h-[52px] absolute -top-0.5 -left-0.5 fill-tint/30 "><path d="M22.42 11.34l-1.86-2.12.26-2.81c.05-.5-.29-.96-.77-1.07l-2.76-.63-1.44-2.43c-.26-.43-.79-.61-1.25-.41L12 3 9.41 1.89c-.46-.2-1-.02-1.25.41L6.71 4.72l-2.75.62c-.49.11-.83.56-.78 1.07l.26 2.8-1.86 2.13c-.33.38-.33.94 0 1.32l1.86 2.12-.26 2.82c-.05.5.29.96.77 1.07l2.76.63 1.44 2.42c.26.43.79.61 1.26.41L12 21l2.59 1.11c.46.2 1 .02 1.25-.41l1.44-2.43 2.76-.63c.49-.11.82-.57.77-1.07l-.26-2.81 1.86-2.12c.34-.36.34-.92.01-1.3zM13 17h-2v-2h2v2zm-1-4c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1z"/></svg>
        </button>
      </> }
    </div>
    <Keyboard onClick={handleVirtualKey} keySource={keySource} onChangeTheme={value => setTheme(value)} onChangeHighContrast={handleChangeHighContrast} />
    {(gameOver || (!unlimited && hasPlayedToday())) && <Scoreboard {...{ gameData, unlimited }} />}
    {(showInstructions) && <Instructions onClose={() => setShowInstructions(false)} />}
    { (modalContent !== null && !showInstructions && !gameOver) && modalContent }
  </div>
}
