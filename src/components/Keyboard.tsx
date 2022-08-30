import { ReactElement, useState } from 'react'
import Observable from '../Observable'

export interface KeyObserver {
  keySource: Observable<string>
}

export interface Clickable {
  onClick: (value: string) => void
}

export interface KeyProps extends KeyObserver, Clickable {
  children: ReactElement | string
  name: string
}

export interface CharKeyProps extends KeyObserver, Clickable {
  char: string
}

export interface UtilityKeyProps extends KeyObserver, Clickable {}
export interface KeyboardProps extends KeyObserver, Clickable {}

export function Key ({ name, onClick, keySource, children }: KeyProps): ReactElement {
  const [active, setActive] = useState(false)

  const activeClasses = active
    ? 'bg-zinc-600 border-t-zinc-700 border-l-zinc-700 border-b-zinc-500 border-r-zinc-500'
    : 'bg-zinc-700 border-t-zinc-600 border-l-zinc-600 border-b-zinc-800 border-r-zinc-800'

  keySource.subscribe(name, key => {
    if (name === key) doPress()
  })

  function doPress (): void {
    setActive(true)
    setTimeout(() => setActive(false), 100)
  }

  return <button onClick={() => onClick(name)} className={`flex items-center justify-center font-mono font-bold rounded-md w-12 h-12 border-4 text-zinc-300 fill-zinc-300 hover:bg-zinc-600 hover:border-t-zinc-500 hover:border-l-zinc-500 hover:border-b-zinc-700 hover:border-r-zinc-700 transition-colors duration-50 ${activeClasses}`}>
    {children}
  </button>
}

export function CharKey ({ char, onClick, keySource }: CharKeyProps): ReactElement {
  return <Key name={char} onClick={onClick} keySource={keySource}>{char}</Key>
}

export function Backspace ({ onClick, keySource }: UtilityKeyProps): ReactElement {
  return <Key name={'backspace'} onClick={onClick} keySource={keySource}>
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 48 48"><path d="M18.5 39.1q-1.55 0-2.8-.725-1.25-.725-2.05-1.975l-7-9.75q-.9-1.15-.85-2.625.05-1.475.85-2.725l7-9.7q.8-1.25 2.05-2 1.25-.75 2.8-.75h20.15q1.85 0 3.225 1.375t1.375 3.225v21.1q0 1.85-1.375 3.2T38.65 39.1Zm2.7-8.4q.55.6 1.35.6t1.35-.6l4.15-4.05 4.15 4.1q.5.6 1.275.6.775 0 1.375-.6.45-.5.45-1.3t-.45-1.4L30.65 24l4.15-4.1q.45-.55.45-1.325 0-.775-.45-1.325-.6-.55-1.4-.55-.8 0-1.3.55l-4.05 4.1-4.2-4.15q-.55-.55-1.325-.55-.775 0-1.325.55-.55.55-.55 1.325 0 .775.55 1.325L25.4 24l-4.2 4.05q-.55.6-.55 1.375t.55 1.275Z"/></svg>
  </Key>
}

export function Enter ({ onClick, keySource }: UtilityKeyProps): ReactElement {
  return <Key name={'enter'} onClick={onClick} keySource={keySource}>
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 48 48"><path d="m16.55 35.45-9.8-9.85q-.35-.25-.5-.675-.15-.425-.15-.875t.15-.875q.15-.425.5-.725l9.75-9.75q.65-.6 1.675-.675 1.025-.075 1.675.575.65.7.65 1.65t-.65 1.6l-5.95 6h24.45V15.5q0-.95.65-1.6.65-.65 1.65-.65 1 0 1.625.65t.625 1.6v8.55q0 .95-.65 1.625t-1.6.675h-26.7l5.85 5.85q.65.65.675 1.625.025.975-.625 1.625-.65.6-1.65.6-1 0-1.65-.6Z"/></svg>
  </Key>
}

export function Break (): ReactElement {
  return <div className="basis-full h-0"></div>
}

export default function Keyboard ({ onClick, keySource }: KeyboardProps): ReactElement {
  return <div className="grid grid-cols-6 gap-1 mt-auto mb-16 md:mt-8 justify-center max-w-32">
    <CharKey char="0" onClick={onClick} keySource={keySource} />
    <CharKey char="1" onClick={onClick} keySource={keySource} />
    <CharKey char="2" onClick={onClick} keySource={keySource} />
    <CharKey char="3" onClick={onClick} keySource={keySource} />
    <CharKey char="4" onClick={onClick} keySource={keySource} />
    <Backspace onClick={onClick} keySource={keySource} />

    <CharKey char="5" onClick={onClick} keySource={keySource} />
    <CharKey char="6" onClick={onClick} keySource={keySource} />
    <CharKey char="7" onClick={onClick} keySource={keySource} />
    <CharKey char="8" onClick={onClick} keySource={keySource} />
    <CharKey char="9" onClick={onClick} keySource={keySource} />
    <Enter onClick={onClick} keySource={keySource} />

    <CharKey char="a" onClick={onClick} keySource={keySource} />
    <CharKey char="b" onClick={onClick} keySource={keySource} />
    <CharKey char="c" onClick={onClick} keySource={keySource} />
    <CharKey char="d" onClick={onClick} keySource={keySource} />
    <CharKey char="e" onClick={onClick} keySource={keySource} />
    <CharKey char="f" onClick={onClick} keySource={keySource} />
  </div>
}
