import { useState } from "react"
import { Search, Filter, Download } from "lucide-react"
import { motion } from "motion/react"
import { hapticWidgets } from "../../../lib/motion"

const CATEGORIES = ["Upcoming", "Checked-in", "History", "Cancelled"]

export default function ReservationFilters() {
    const [activeTab, setActiveTab] = useState("Upcoming")

    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card-bg p-4 rounded-3xl border border-border-subtle shadow-sm">
            {/* Category Tabs */}
            <div className="flex bg-app-bg p-1 rounded-2xl border border-border-subtle">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${activeTab === cat ? "bg-brand text-white shadow-md" : "text-text-muted hover:text-brand"}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                    />
                    <input
                        type="text"
                        placeholder="Search Guest or ID..."
                        className="w-full bg-app-bg pl-11 pr-4 py-3 rounded-2xl border border-border-subtle text-xs font-medium outline-none focus:border-brand transition-colors"
                    />
                </div>

                <motion.button
                    whileTap={hapticWidgets.tap}
                    className="p-3 bg-app-bg border border-border-subtle rounded-2xl text-text-muted hover:text-brand"
                >
                    <Filter size={18} />
                </motion.button>

                <motion.button
                    whileTap={hapticWidgets.tap}
                    className="p-3 bg-app-bg border border-border-subtle rounded-2xl text-text-muted hover:text-brand"
                >
                    <Download size={18} />
                </motion.button>
            </div>
        </div>
    )
}
