import { useState } from "react"
import RoomCard from "./RoomCard"
import { motion } from "motion/react"

// Mock Data for Prototype
const MOCK_ROOMS = [
    { id: "101", type: "Deluxe", status: "available", guest: null },
    { id: "102", type: "Executive", status: "occupied", guest: "John Doe" },
    { id: "103", type: "Single", status: "dirty", guest: null },
    { id: "104", type: "Deluxe", status: "due-out", guest: "Jane Smith" },
    { id: "105", type: "Family", status: "maintenance", guest: null },
]

const FILTERS = [
    "All",
    "Available",
    "Occupied",
    "Dirty",
    "Due Out",
    "Maintenance",
]

export default function RoomGrid() {
    const [filter, setFilter] = useState("All")

    return (
        <div className="space-y-6">
            {/* Header with Quick Info */}
            <div className="flex justify-between items-center glass-panel p-3 rounded-2xl">
                <div className="flex gap-2">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all tracking-wider
               ${
                   filter === f
                       ? "bg-brand text-app-bg shadow-md"
                       : "bg-transparent text-text-muted hover:text-brand hover:bg-card-bg"
               }`}
                        >
                            {f.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid of Rooms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {MOCK_ROOMS.map((room) => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>
        </div>
    )
}
