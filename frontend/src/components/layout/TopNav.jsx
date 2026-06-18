import { useTheme } from "../../contexts/ThemeContext"
import { Sun, Moon, Bell, Search, LogOut } from "lucide-react"
import { motion } from "motion/react"
import { hapticWidgets } from "../../lib/motion"

export default function TopNav({ currentView, onLogout, profile }) {
    const { isDark, toggleTheme } = useTheme()

    return (
        <header className="h-20 border-b border-border-subtle bg-app-bg/80 backdrop-blur-xl flex items-center px-8 justify-between z-10 sticky top-0">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold tracking-tight capitalize text-text-main">
                    {currentView.replace("-", " ")}
                </h2>
            </div>
            
            <div className="flex items-center gap-4">
                {/* THEME TOGGLE BUTTON */}
                <motion.button
                    whileTap={hapticWidgets.tap}
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-xl bg-card-bg border border-border-subtle flex items-center justify-center text-text-secondary hover:text-brand hover:border-brand/30 transition-all shadow-sm"
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDark ? (
                        <Sun size={18} className="text-yellow-400" />
                    ) : (
                        <Moon size={18} className="text-brand" />
                    )}
                </motion.button>

                <button className="w-10 h-10 rounded-xl bg-card-bg border border-border-subtle flex items-center justify-center text-text-secondary hover:text-brand hover:border-brand/30 transition-all shadow-sm">
                    <Search size={18} />
                </button>
                
                <button className="w-10 h-10 rounded-xl bg-card-bg border border-border-subtle flex items-center justify-center text-text-secondary hover:text-brand hover:border-brand/30 transition-all shadow-sm relative">
                    <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-card-bg"></div>
                    <Bell size={18} />
                </button>

                <button 
                    onClick={onLogout}
                    className="w-10 h-10 rounded-xl bg-card-bg border border-border-subtle flex items-center justify-center text-text-secondary hover:text-red-500 hover:border-red-500/30 transition-all shadow-sm"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>

                {profile && (
                    <div className="flex flex-col items-end justify-center ml-2 mr-2">
                        <span className="text-sm font-bold text-text-main leading-tight">{profile.org_name}</span>
                        <span className="text-xs font-semibold text-brand tracking-wider uppercase">{profile.is_root ? 'Root Admin' : 'Staff'}</span>
                    </div>
                )}
                
                <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold shadow-sm uppercase">
                    {profile?.org_name?.substring(0, 2) || 'JS'}
                </div>
            </div>
        </header>
    )
}
