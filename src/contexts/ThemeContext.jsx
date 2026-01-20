import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage or system preference
        const stored = localStorage.getItem("hotel-theme")
        if (stored) return stored === "dark"
        return window.matchMedia("(prefers-color-scheme: dark)").matches
    })

    useEffect(() => {
        const root = window.document.documentElement
        if (isDark) {
            root.classList.add("dark")
            localStorage.setItem("hotel-theme", "dark")
        } else {
            root.classList.remove("dark")
            localStorage.setItem("hotel-theme", "light")
        }
    }, [isDark])

    const toggleTheme = () => setIsDark((prev) => !prev)

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
