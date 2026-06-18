import { useTheme } from "../../contexts/ThemeContext"
import { Sun, Moon, Bell } from "lucide-react"
import { motion } from "motion/react"
import { hapticWidgets } from "../../lib/motion"

export default function TopNav({ currentView }) {
    const { isDark, toggleTheme } = useTheme()

    return (
        <header className="h-16 bg-sidebar-bg/80 backdrop-blur-xl border-b border-border-subtle flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-text-main opacity-80">
                {currentView.replace("-", " ")}
            </h2>

            <div className="flex items-center gap-4">
                {/* THEME TOGGLE BUTTON */}
                <motion.button
                    whileTap={hapticWidgets.tap}
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full bg-card-bg text-text-main border border-border-subtle shadow-sm hover-lift"
                    title={
                        isDark ? "Switch to Light Mode" : "Switch to Dark Mode"
                    }
                >
                    {isDark ? (
                        <Sun size={16} className="text-yellow-400" />
                    ) : (
                        <Moon size={16} className="text-brand" />
                    )}
                </motion.button>

                <motion.button
                    whileTap={hapticWidgets.tap}
                    className="p-2.5 rounded-full bg-card-bg text-text-main border border-border-subtle shadow-sm hover-lift relative"
                >
                    <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-brand-accent rounded-full border border-card-bg"></div>
                    <Bell size={16} />
                </motion.button>
            </div>
        </header>
    )
}
