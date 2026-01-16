import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(
        localStorage.getItem("hotel-theme") === "dark"
    )

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

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 ring-brand transition-all"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    )
}
