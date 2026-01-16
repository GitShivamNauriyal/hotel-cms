// src/components/layout/Sidebar.jsx
import { motion } from "framer-motion"
import { useTheme } from "../../contexts/ThemeContext"
import { hapticWidgets, sidebarTransition } from "../../lib/motion"
import {
    LayoutGrid,
    CalendarDays,
    UserCheck,
    BookOpen,
    ChevronRight,
    Menu,
} from "lucide-react"

const navItems = [
    { id: "rooms", label: "ROOM VIEW", icon: LayoutGrid },
    { id: "stay", label: "STAY VIEW", icon: CalendarDays },
    { id: "checkins", label: "ALL CHECKINS", icon: UserCheck },
    { id: "reservations", label: "RESERVATIONS", icon: BookOpen },
]

export default function Sidebar({ isOpen, toggleSidebar }) {
    const { isDark } = useTheme()

    return (
        <motion.aside
            animate={{ width: isOpen ? 260 : 80 }}
            transition={sidebarTransition}
            className="h-screen bg-sidebar-bg border-r border-border-subtle flex flex-col overflow-hidden"
        >
            {/* Header / Logo Section */}
            <div className="p-4 h-16 flex items-center gap-4 border-b border-border-subtle">
                <motion.button
                    whileTap={hapticWidgets.tap}
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-app-bg rounded-lg text-text-main"
                >
                    <Menu size={24} />
                </motion.button>
                {isOpen && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-bold text-lg whitespace-nowrap"
                    >
                        GUEST-OS
                    </motion.span>
                )}
            </div>

            {/* Navigation items */}
            <nav className="flex-1 p-3 space-y-2">
                {navItems.map((item) => (
                    <motion.div
                        key={item.id}
                        whileTap={hapticWidgets.tap}
                        className="flex items-center p-3 rounded-xl cursor-pointer hover:bg-brand/10 hover:text-brand transition-colors group"
                    >
                        <item.icon size={22} className="min-w-5.5" />
                        {isOpen && (
                            <motion.span
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="ml-3 font-medium text-sm whitespace-nowrap"
                            >
                                {item.label}
                            </motion.span>
                        )}
                    </motion.div>
                ))}
            </nav>
        </motion.aside>
    )
}
