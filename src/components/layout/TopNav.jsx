import { useTheme } from "../../contexts/ThemeContext"
import { Sun, Moon, Bell } from "lucide-react"
import { motion } from "motion/react"
import { hapticWidgets } from "../../lib/motion"

export default function TopNav({ currentView }) {
    const { isDark, toggleTheme } = useTheme()

    return (
        <header className="h-16 bg-sidebar-bg border-b border-border-subtle flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-300">
            <h2 className="text-sm font-black uppercase tracking-widest text-text-main">
                {currentView.replace("-", " ")}
            </h2>

            <div className="flex items-center gap-4">
                {/* THEME TOGGLE BUTTON */}
                <motion.button
                    whileTap={hapticWidgets.tap}
                    onClick={toggleTheme} // This must be the function from Context
                    className="p-2.5 rounded-xl bg-app-bg text-text-main border border-border-subtle shadow-sm hover:border-brand transition-all"
                    title={
                        isDark ? "Switch to Light Mode" : "Switch to Dark Mode"
                    }
                >
                    {isDark ? (
                        <Sun size={18} className="text-yellow-400" />
                    ) : (
                        <Moon size={18} className="text-blue-600" />
                    )}
                </motion.button>

                <motion.button
                    whileTap={hapticWidgets.tap}
                    className="p-2.5 rounded-xl bg-brand/10 text-brand border border-brand/20"
                >
                    <Bell size={18} />
                </motion.button>
            </div>
        </header>
    )
}
