import { ReactElement, FormEventHandler, useState, useRef, KeyboardEvent, ChangeEvent, useEffect } from 'react'

export interface HexBoxProps {
  value: string
  invalid: boolean
  onUpdate: (value: string) => void
  onSubmit: (value: string) => void
  onKey: (key: string) => void
}

export default function HexBox ({ value: parentValue, invalid, onUpdate, onSubmit, onKey }: HexBoxProps): ReactElement {
  const [value, setValue] = useState(parentValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(parentValue)
  }, [parentValue])

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    onSubmit(value)
    setValue('')
  }

  function handleChange (e: ChangeEvent<HTMLInputElement>): void {
    setValue(e.target.value)
    onUpdate(e.target.value)
  }

  function handleKeyPress (evt: KeyboardEvent<HTMLInputElement>): void {
    const key = evt.key.toLowerCase()
    const chars = '0123456789abcdef'
    if (key !== 'enter' && key !== 'backspace' && !chars.includes(key)) {
      evt.preventDefault()
      return
    }

    onKey(key)
  }

  const refocus = (): void => {
    setTimeout(() => {
      if (inputRef?.current === null) return
      inputRef.current.focus()
    }, 200)
  }

  const invalidStyles = invalid
    ? {
        animation: 'shake 500ms linear',
      }
    : {}

  return <form onSubmit={handleSubmit} className="flex items-center" style={invalidStyles}>
    <span className="font-mono font-bold text-6xl sm:text-7xl md:text-9xl bg-black/10 text-black/25 leading-[1.25em] sm:leading-[1.25em] md:leading-[1.25em] pl-2">#</span>
    <input autoFocus ref={inputRef} type="text" maxLength={6} value={value} onBlur={refocus} onKeyDown={handleKeyPress} onChange={handleChange} className="font-mono font-bold text-6xl sm:text-7xl md:text-9xl bg-black/10 h-[1.25em] pr-2 text-black/50 border-none focus:ring-0 focus:outline-none w-full md:w-[calc(6ch+0.2em)]" />
    <button className="sr-only">Submit</button>
  </form>
}
