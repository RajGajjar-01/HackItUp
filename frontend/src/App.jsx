import { useState } from 'react'
import { ModeToggle } from './components/mode-toggler'
import { ThemeProvider } from './components/theme-provider'
import Routerr from './components/Routerr'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ModeToggle />
      <div className="flex flex-col items-center justify-center gap-8 min-h-svh">
        <Routerr/>
      </div>
    </ThemeProvider>
  )
}

export default App
