import { useState } from "react"
import RoomCard from "./RoomCard"
import { motion } from "motion/react"

const FILTERS = [
    "All",
    "Available",
    "Occupied",
    "Dirty",
    "Due Out",
    "Maintenance",
]

export default function RoomGrid({ userRole, rooms = [], setRooms }) {
    const [filter, setFilter] = useState("All")

    const filteredRooms = rooms.filter(room => {
        if (filter === "All") return true;
        return room.status.toLowerCase() === filter.toLowerCase().replace(" ", "-");
    });

    const handleStatusChange = (id, newStatus) => {
        if (!setRooms) return;
        setRooms(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    }

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
                
                {userRole === "root" && (
                    <button className="px-4 py-2 bg-brand text-app-bg text-xs font-bold rounded-xl hover:bg-brand/90 transition-colors shadow-sm">
                        + Add Room
                    </button>
                )}
            </div>

            {/* Grid of Rooms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filteredRooms.map((room) => (
                    <RoomCard key={room.id} room={room} onStatusChange={handleStatusChange} />
                ))}
            </div>
        </div>
    )
}
