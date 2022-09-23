import { ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Game from './components/Game'

export default function App (): ReactElement {
  return (
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="unlimited" element={<Game unlimited />} />
      </Routes>
    </BrowserRouter>
  )
}
