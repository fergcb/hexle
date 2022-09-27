import { ReactElement, useState } from 'react'
import Tooltip from './Tooltip'

export interface IconButtonProps {
  icon: ReactElement
  value: string
  onSelect: (value: string) => void
}

export function ThemeButton ({ icon, value, onSelect }: IconButtonProps): ReactElement {
  return <Tooltip content={`Use ${value} theme.`}>
    <button className="flex items-center justify-center" onClick={() => onSelect(value)}>
      {icon}
      <span className="sr-only">Use {value} theme.</span>
    </button>
  </Tooltip>
}

export interface ContrastButtonProps {
  pressed: boolean
  onClick: () => void
}

export function ContrastButton ({ pressed, onClick }: ContrastButtonProps): ReactElement {
  const borderClassName = pressed
    ? 'border-t-zinc-600 border-l-zinc-600 border-r-zinc-800 border-b-zinc-800'
    : 'border-t-zinc-800 border-l-zinc-800 border-r-zinc-600 border-b-zinc-600'

  return <Tooltip content={'Toggle high contrast mode.'}>
    <button className={'fill-zinc-300 bg-zinc-700 p-[3px] rounded-md border-4 ' + borderClassName} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className='w-6 w-6'><path d="M24 45.05q-4.3 0-8.175-1.65-3.875-1.65-6.725-4.5-2.85-2.85-4.5-6.725Q2.95 28.3 2.95 24q0-4.3 1.65-8.175Q6.25 11.95 9.1 9.1q2.85-2.85 6.725-4.525Q19.7 2.9 24 2.9q4.3 0 8.175 1.675Q36.05 6.25 38.9 9.1q2.85 2.85 4.525 6.725Q45.1 19.7 45.1 24q0 4.3-1.675 8.175Q41.75 36.05 38.9 38.9q-2.85 2.85-6.725 4.5Q28.3 45.05 24 45.05Zm1.5-4.65q6.4-.55 10.7-5.1 4.3-4.55 4.3-11.3 0-6.65-4.3-11.225Q31.9 8.2 25.5 7.55Z"/></svg>
      <span className="sr-only">Toggle high contrast mode</span>
    </button>
  </Tooltip>
}

export interface ThemeSelectorProps {
  onChangeTheme: (value: string) => void
  onChangeHighContrast: (value: boolean) => void
}

export default function ThemeSelector ({ onChangeTheme, onChangeHighContrast }: ThemeSelectorProps): ReactElement {
  const [selectedTheme, setSelectedTheme] = useState('auto')
  const [highContrast, setHighContrast] = useState(localStorage.getItem('hexle-highContrast') === 'true')

  const toggleContrast = (): void => {
    setHighContrast(!highContrast)
    onChangeHighContrast(!highContrast)
  }

  const setTheme = (value: string): void => {
    setSelectedTheme(value)
    onChangeTheme(value)
  }

  return <div className="flex gap-2 items-center">
    <div className="flex gap-3 rounded-full bg-zinc-700 p-1.5 px-1.5 relative">
      <ThemeButton value="auto" onSelect={ value => setTheme(value) } icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-6 h-6 fill-zinc-300"><path d="M7.25 43.05q-1 0-1.65-.65-.65-.65-.65-1.65v-6.8q0-.35.175-.775.175-.425.525-.825l17.5-17.5L21.3 13q-.7-.75-.675-1.8.025-1.05.825-1.85.75-.7 1.85-.7t1.9.7l2.8 2.8 6.15-6.25q1-.95 2.075-.925Q37.3 5 38.3 5.95l3.75 3.8q.95.95 1 2.075.05 1.125-.9 2.075l-6.3 6.2 2.8 2.85q.7.7.725 1.775.025 1.075-.725 1.825-.75.8-1.825.825Q35.75 27.4 35 26.6l-1.85-1.75-17.5 17.5q-.4.35-.825.525-.425.175-.775.175ZM9.5 38.5h3.7l17.25-17.25-3.7-3.7L9.5 34.8Z"/></svg>} />
      <ThemeButton value="light" onSelect={ value => setTheme(value) } icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-6 h-6 fill-zinc-300"><path d="M24 33.9q-4.1 0-7-2.9-2.9-2.9-2.9-7t2.9-7.025q2.9-2.925 7-2.925t7.025 2.925Q33.95 19.9 33.95 24q0 4.1-2.925 7Q28.1 33.9 24 33.9ZM3.5 26.25q-.9 0-1.575-.675Q1.25 24.9 1.25 24q0-.95.675-1.625T3.5 21.7h5q.95 0 1.625.675T10.8 24q0 .95-.675 1.6-.675.65-1.625.65Zm36 0q-.9 0-1.575-.675Q37.25 24.9 37.25 24q0-.95.675-1.625T39.5 21.7h5q.95 0 1.625.675T46.8 24q0 .95-.675 1.6-.675.65-1.625.65ZM24 10.75q-.95 0-1.6-.675-.65-.675-.65-1.575v-5q0-.95.675-1.625T24 1.2q.95 0 1.625.675T26.3 3.5v5q0 .9-.675 1.575-.675.675-1.625.675Zm0 36q-.95 0-1.6-.675-.65-.675-.65-1.575v-5q0-.95.675-1.625T24 37.2q.95 0 1.625.675T26.3 39.5v5q0 .9-.675 1.575-.675.675-1.625.675Zm-12.5-32.1-2.85-2.8q-.7-.6-.7-1.575t.7-1.675q.6-.65 1.55-.65.95 0 1.65.65l2.85 2.85q.65.65.65 1.6 0 .95-.65 1.55-.65.7-1.625.75-.975.05-1.575-.7Zm24.7 24.7-2.85-2.85q-.7-.6-.7-1.525 0-.925.75-1.625.55-.65 1.525-.65.975 0 1.625.65l2.85 2.75q.65.65.65 1.625t-.65 1.625q-.65.7-1.6.7-.95 0-1.6-.7Zm-2.8-24.7q-.7-.65-.7-1.6 0-.95.7-1.6l2.75-2.85q.6-.65 1.575-.65t1.675.65q.65.65.65 1.6 0 .95-.65 1.6l-2.85 2.85q-.65.7-1.575.7-.925 0-1.575-.7ZM8.65 39.35q-.7-.6-.7-1.55 0-.95.7-1.65l2.85-2.85q.6-.65 1.525-.675.925-.025 1.575.675.7.65.7 1.625t-.65 1.575l-2.75 2.85q-.65.7-1.625.7t-1.625-.7Z"/></svg>} />
      <ThemeButton value="dark" onSelect={ value => setTheme(value) } icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-6 h-6 fill-zinc-300"><path d="M24 42.45q-7.75 0-13.1-5.35T5.55 24q0-7.75 5.35-13.15T24 5.45q.35 0 .675.025Q25 5.5 25.7 5.55q-1.4 1.75-2.175 3.875-.775 2.125-.775 4.475 0 4.85 3.35 8.125 3.35 3.275 8.05 3.275 2.3 0 4.475-.65t3.925-2V23.95q0 7.75-5.4 13.125T24 42.45Z"/></svg>}/>
      <div className={"pointer-events-none w-9 h-9 top-0 left-0 transition-transform border-4 border-t-zinc-200 border-l-zinc-200 border-r-zinc-300 border-b-zinc-300 absolute rounded-full after:block after:relative after:content-[''] after:w-8 after:h-8 after:border-2 after:border-t-zinc-300 after:border-l-zinc-300 after:border-r-zinc-200 after:border-b-zinc-200 after:rounded-full after:-top-0.5 after:-left-0.5 " + (selectedTheme === 'dark' ? 'translate-x-[72px]' : (selectedTheme === 'light' ? 'translate-x-9' : ''))}></div>
    </div>
    <div>
      <ContrastButton pressed={!highContrast} onClick={ () => toggleContrast() } />
    </div>
  </div>
}
