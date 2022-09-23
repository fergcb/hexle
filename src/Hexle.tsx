/* Types */

export type Hex = string
export type RGB = [number, number, number]
export type LAB = [number, number, number]

export interface Outcome {
  target: string
  guesses: string[]
  score: number
  date: string
}

export interface GameData {
  games: { [key: string]: Outcome }
  currentStreak: number
  longestStreak: number
  totalScore: number
  unlimitedGames: Outcome[]
}

/* TARGETS */

const a = (): number => parseInt(getToday().replaceAll('-', ''))
const b = (a: number): number => Math.sin(a * 524287 / 8191)
const c = (b: number): number => Math.floor((b - Math.floor(b)) * 16777215)
const d = (c: number): string => c.toString(16).padStart(6, '0')

export function getDailyTarget (): string {
  return d(c(b(a())))
}

export function getRandomTarget (): string {
  return d(Math.floor(Math.random() * 16777215))
}

/* COLOURS & SCORING */

export function isValidHex (hex: string): boolean {
  return hex.length === 6
}

export function HexToRGB (hex: Hex): RGB {
  const hn = parseInt(hex, 16)
  return [
    hn >> 16,
    (hn >> 8) & 0xff,
    hn & 0xff,
  ]
}

export function RGBtoLAB (rgb: RGB): LAB {
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

export function luma (c: Hex): number {
  const [r, g, b] = HexToRGB(c)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function isColourDark (c: Hex): boolean {
  return luma(c) < 40
}

export function getCSSTints (c: Hex): object {
  const v = isColourDark(c) ? '255' : '0'
  return Object.fromEntries(
    Array.from(Array(20).keys())
      .map(n => (n + 1) * 5)
      .map(n => [`--tint-${n.toString().padStart(2, '0')}`, `rgba(${v}, ${v}, ${v}, ${n / 100})`]),
  )
}

export function delta (a: Hex, b: Hex): number {
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

export function calculateScore (guess: Hex, target: Hex): number {
  return Math.round((100 - delta(guess, target)) * 50)
}

export function scoreMessage (score: number): string {
  if (score === 5000) return 'Exact match!'
  if (score >= 4950) return 'Imperceptibly close!'
  if (score >= 4900) return 'Perceptibly different, given a close look.'
  if (score >= 4500) return 'Perceptibly different, at a glance.'
  if (score >= 2550) return 'More similar than different.'
  if (score > 0) return 'More different than similar.'
  return 'Exact opposites.'
}

/* Data Persistence */

export function loadData (): GameData {
  const defaultData = {
    games: {},
    currentStreak: 0,
    longestStreak: 0,
    totalScore: 0,
    unlimitedGames: [],
  }

  const json = localStorage.getItem('hexleData')
  if (json === null) {
    return defaultData
  }
  const data = JSON.parse(json) as GameData
  data.currentStreak = checkStreak(data)
  return { ...defaultData, ...data }
}

export function getToday (): string {
  const date = new Date()
  const y = date.getFullYear().toString()
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getLastGame (data: GameData): Outcome | undefined {
  const lastDateString = Object.keys(data.games).sort().reverse()[0]
  return data.games[lastDateString]
}

const oneDay = 86400000

export function checkStreak (data: GameData): number {
  const lastGame = getLastGame(data)
  if (lastGame === undefined) return 0
  const lastGameDate = new Date(lastGame.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const delta = today.getTime() - lastGameDate.getTime()
  if (delta <= oneDay) return data.currentStreak
  return 0
}

export function getStreak (data: GameData): number {
  return data.currentStreak + 1
}

export function getLongestStreak (data: GameData): number {
  return Math.max(data.currentStreak, data.longestStreak)
}
