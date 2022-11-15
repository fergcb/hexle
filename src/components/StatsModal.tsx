import { ReactElement, useState } from 'react'
import HistoryTab from './HistoryTab'
import StatsTab from './StatsTab'

export interface StatsModalProps {
  onClose: () => void
}

export default function StatsModal ({ onClose }: StatsModalProps): ReactElement {
  const [currentTab, setCurrentTab] = useState<'stats' | 'history'>('stats')

  return <div className="absolute t-0 l-0 w-screen h-screen -mt-4 md:mt-0 font-mono text-zinc-300 bg-zinc-800 flex justify-center sm:items-center pt-8 sm:p-0">
    <button onClick={onClose} className="absolute md:hidden top-1 right-1 sm:top-4 sm:right-4 flex justify-center items-center rounded-full fill-zinc-500 hover:bg-zinc-700 hover:fill-zinc-400 transition-colors duration-200 w-10 h-10 sm:w-14 sm:h-14">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-10 h-10 sm:w-12 sm:h-12">
        <path d="m24 27.2-9.9 9.9q-.7.7-1.625.7t-1.575-.7q-.7-.65-.7-1.575 0-.925.7-1.575L20.8 24l-9.9-9.9q-.65-.65-.65-1.6 0-.95.65-1.6.6-.65 1.55-.65.95 0 1.65.65l9.9 9.95 9.95-10q.65-.65 1.575-.65.925 0 1.625.65.65.7.65 1.625t-.65 1.575l-9.95 9.9 9.9 9.95q.7.7.7 1.625t-.7 1.575q-.65.7-1.6.7-.95 0-1.55-.7Z"/>
      </svg>
    </button>
    <div className="max-h-full p-2 md:p-0 flex flex-col items-flex-start w-full max-w-[60ch] relative">
      <button onClick={onClose} className="z-10 absolute -top-14 -right-14 hidden md:flex justify-center items-center rounded-full fill-zinc-500 hover:bg-zinc-700 hover:fill-zinc-400 transition-colors duration-200 w-14 h-14">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-12 h-12">
          <path d="m24 27.2-9.9 9.9q-.7.7-1.625.7t-1.575-.7q-.7-.65-.7-1.575 0-.925.7-1.575L20.8 24l-9.9-9.9q-.65-.65-.65-1.6 0-.95.65-1.6.6-.65 1.55-.65.95 0 1.65.65l9.9 9.95 9.95-10q.65-.65 1.575-.65.925 0 1.625.65.65.7.65 1.625t-.65 1.575l-9.95 9.9 9.9 9.95q.7.7.7 1.625t-.7 1.575q-.65.7-1.6.7-.95 0-1.55-.7Z"/>
        </svg>
      </button>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setCurrentTab('stats')} className={`flex gap-2 items-center justify-center fill-zinc-300 text-zinc-300 inline-block rounded px-2 py-1 transition-colors ${currentTab === 'stats' ? 'bg-zinc-800' : 'bg-zinc-900 hover:bg-zinc-700'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-7 h-7">
            <path d="M5.55 42.75q-1.05 0-1.675-.625T3.25 40.45V19.5q0-1 .625-1.65.625-.65 1.675-.65h6.1q1 0 1.65.65.65.65.65 1.65v20.95q0 1.05-.65 1.675t-1.65.625Zm15.3 0q-1.05 0-1.675-.625t-.625-1.675V7.5q0-1 .625-1.65.625-.65 1.675-.65h6.35q1 0 1.65.65.65.65.65 1.65v32.95q0 1.05-.65 1.675t-1.65.625Zm15.55 0q-1.05 0-1.675-.625T34.1 40.45V23.5q0-1 .625-1.65.625-.65 1.675-.65h6.1q1 0 1.65.65.65.65.65 1.65v16.95q0 1.05-.65 1.675t-1.65.625Z"/>
          </svg>
          Stats
        </button>
        <button onClick={() => setCurrentTab('history')} className={`flex gap-2 items-center justify-center fill-zinc-300 text-zinc-300 inline-block rounded px-2 py-1 transition-colors ${currentTab === 'history' ? 'bg-zinc-800' : 'bg-zinc-900 hover:bg-zinc-700'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 48 48' className="w-7 h-7">
            <path d="M23.75 43.05q-8.05 0-13.525-5.6T4.85 23.95H9.4q.05 6.05 4.2 10.3 4.15 4.25 10.15 4.25 6.05 0 10.375-4.3t4.325-10.4q0-6.05-4.35-10.175Q29.75 9.5 23.75 9.5q-3 0-5.65 1.2-2.65 1.2-4.65 3.25h4.15v3.5H6.45V6.4H9.8v4.7q2.7-2.85 6.3-4.525Q19.7 4.9 23.75 4.9q3.95 0 7.45 1.525t6.1 4.075q2.6 2.55 4.125 5.975T42.95 23.9q0 4-1.525 7.475Q39.9 34.85 37.3 37.45t-6.1 4.1q-3.5 1.5-7.45 1.5Zm6.35-10.7-7.65-7.55V13.95h3.4v9.4l6.7 6.5Z"/>
          </svg>
          History
        </button>
      </div>

      { currentTab === 'stats' && <StatsTab /> }
      { currentTab === 'history' && <HistoryTab /> }
    </div>
  </div>
}
