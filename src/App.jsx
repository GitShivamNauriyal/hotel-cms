import { useState } from "react"
import "./App.css"
import ThemeToggle from "./contexts/ThemeContext"

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <h1 className="bg-amber-700">Vite + React</h1>
            <ThemeToggle />
        </>
    )
}

export default App
