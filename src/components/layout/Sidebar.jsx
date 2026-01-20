import { motion, AnimatePresence } from "motion/react"
import { hapticWidgets, sidebarTransition } from "../../lib/motion"
import {
    LayoutGrid,
    CalendarDays,
    UserCheck,
    BookOpen,
    Menu,
    Utensils,
    Waves,
    Package,
    PieChart,
    Share2,
} from "lucide-react"

const navItems = [
    { id: "rooms", label: "ROOM VIEW", icon: LayoutGrid },
    { id: "stay", label: "STAY VIEW", icon: CalendarDays },
    { id: "checkins", label: "ALL CHECKINS", icon: UserCheck },
    { id: "reservations", label: "RESERVATIONS", icon: BookOpen },
    { id: "food", label: "FOOD", icon: Utensils },
    { id: "ledger", label: "LEDGER", icon: Waves },
    { id: "inventory", label: "INVENTORY", icon: Package },
    { id: "bi", label: "BI", icon: PieChart },
    { id: "cm", label: "CHANNEL MANAGER", icon: Share2 },
]

export default function Sidebar({
    isOpen,
    toggleSidebar,
    activeId,
    setActiveId,
}) {
    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? 280 : 70 }}
            transition={sidebarTransition}
            className="h-screen bg-sidebar-bg border-r border-border-subtle flex flex-col z-20 shrink-0"
        >
            <div className="p-4 h-16 flex items-center border-b border-border-subtle overflow-hidden">
                <motion.button
                    whileTap={hapticWidgets.tap}
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-app-bg rounded-lg text-text-main shrink-0"
                >
                    <Menu size={24} />
                </motion.button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-black text-xl ml-4 tracking-tighter text-brand whitespace-nowrap"
                        >
                            GUEST-OS
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <nav className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-hide">
                {navItems.map((item) => (
                    <motion.div
                        key={item.id}
                        whileTap={hapticWidgets.tap}
                        onClick={() => setActiveId(item.id)}
                        className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 group
              ${
                  activeId === item.id
                      ? "bg-brand text-white shadow-lg shadow-brand/20"
                      : "hover:bg-brand/10 text-text-muted hover:text-brand"
              }`}
                    >
                        <item.icon size={22} className="shrink-0" />
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="ml-4 font-bold text-xs tracking-widest whitespace-nowrap"
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
