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
            className="h-screen bg-sidebar-bg border-r border-border-subtle flex flex-col z-20 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
        >
            <div className="p-4 h-16 flex items-center border-b border-border-subtle overflow-hidden">
                <motion.button
                    whileTap={hapticWidgets.tap}
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-app-bg rounded-xl text-text-main shrink-0 transition-colors"
                >
                    <Menu size={24} strokeWidth={1.5} />
                </motion.button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-black text-lg ml-4 tracking-[-0.05em] text-brand whitespace-nowrap"
                        >
                            GUEST-OS
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto scrollbar-hide">
                {navItems.map((item) => (
                    <motion.div
                        key={item.id}
                        whileTap={hapticWidgets.tap}
                        onClick={() => setActiveId(item.id)}
                        className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 group
              ${
                  activeId === item.id
                      ? "bg-brand text-app-bg shadow-md"
                      : "hover:bg-card-bg text-text-muted hover:text-brand hover:shadow-sm border border-transparent hover:border-border-subtle"
              }`}
                    >
                        <item.icon size={20} strokeWidth={activeId === item.id ? 2 : 1.5} className="shrink-0" />
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`ml-4 font-semibold text-xs tracking-widest whitespace-nowrap ${
                                    activeId === item.id ? "" : "opacity-80"
                                }`}
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
