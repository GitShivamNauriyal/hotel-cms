import { useState, useEffect } from "react"
import { Search, Filter, Download } from "lucide-react"
import { motion } from "motion/react"
import { hapticWidgets } from "../../../lib/motion"

const CATEGORIES = ["All", "Upcoming", "Checked-in", "History", "Cancelled"]

export default function ReservationFilters({ data, setFilteredData }) {
    const [activeTab, setActiveTab] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")

    // Handle filtering logic locally with real API data
    useEffect(() => {
        let result = data

        // 1. Filter by Tab Category
        if (activeTab !== "All") {
            const apiStatusMap = {
                "Upcoming": "UPCOMING",
                "Checked-in": "CHECKED_IN",
                "History": "CHECKED_OUT",
                "Cancelled": "CANCELLED"
            };
            result = result.filter((res) => res.status === apiStatusMap[activeTab]);
        }

        // 2. Filter by Search Query (ID or Guest Name)
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter((res) => {
                const guestName = res.guest_name || res.guest || ""
                const resId = res.id || ""
                return (
                    guestName.toLowerCase().includes(query) ||
                    resId.toLowerCase().includes(query)
                )
            })
        }

        setFilteredData(result)
    }, [activeTab, searchQuery, data, setFilteredData])

    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card-bg p-4 rounded-3xl border border-border-subtle shadow-sm transition-colors duration-300">
            {/* Category Tabs */}
            <div className="flex bg-app-bg p-1 rounded-2xl border border-border-subtle overflow-x-auto scrollbar-hide">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                        ${
                            activeTab === cat
                                ? "bg-brand text-white shadow-md"
                                : "text-text-muted hover:text-brand"
                        }`}
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Guest or ID..."
                        className="w-full bg-app-bg pl-11 pr-4 py-3 rounded-2xl border border-border-subtle text-xs font-medium outline-none focus:border-brand text-text-main placeholder:text-text-muted transition-colors"
                    />
                </div>

                <motion.button
                    whileTap={hapticWidgets.tap}
                    className="p-3 bg-app-bg border border-border-subtle rounded-2xl text-text-secondary hover:text-brand hover:border-brand transition-all"
                >
                    <Filter size={18} />
                </motion.button>

                <motion.button
                    whileTap={hapticWidgets.tap}
                    className="p-3 bg-app-bg border border-border-subtle rounded-2xl text-text-secondary hover:text-brand hover:border-brand transition-all"
                >
                    <Download size={18} />
                </motion.button>
            </div>
        </div>
    )
}
