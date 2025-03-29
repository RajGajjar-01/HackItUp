import { useState } from 'react'
import { ModeToggle } from './components/mode-toggler'
import { ThemeProvider } from './components/theme-provider'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col items-center justify-center gap-8 min-h-svh">
        <ModeToggle />
      </div>
    </ThemeProvider>
  )
}

export default App
