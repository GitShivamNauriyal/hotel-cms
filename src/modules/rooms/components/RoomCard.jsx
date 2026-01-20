import { motion } from "motion/react"
import { hapticWidgets } from "../../../lib/motion"
// Fixed imports: Clean -> Sparkles, Hammer -> Wrench
import { User, Sparkles, Wrench, AlertCircle, Clock } from "lucide-react"

export default function RoomCard({ room }) {
    const statusColors = {
        available: "var(--color-status-available)",
        occupied: "var(--color-status-occupied)",
        dirty: "var(--color-status-dirty)",
        "due-out": "var(--color-status-due-out)",
        maintenance: "var(--color-status-maintenance)",
    }

    // Helper function to return the right icon based on status
    const getStatusIcon = (status) => {
        switch (status) {
            case "occupied":
                return <User size={16} />
            case "dirty":
                return <Sparkles size={16} />
            case "maintenance":
                return <Wrench size={16} />
            case "due-out":
                return <Clock size={16} />
            default:
                return (
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: statusColors[status] }}
                    />
                )
        }
    }

    return (
        <motion.div
            whileHover={hapticWidgets.hover}
            whileTap={hapticWidgets.tap}
            className="bg-card-bg rounded-2xl border border-border-subtle p-5 shadow-sm cursor-pointer relative overflow-hidden group"
        >
            <div
                className="absolute top-0 left-0 w-full h-1.5"
                style={{ backgroundColor: statusColors[room.status] }}
            />

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl text-text-secondary font-black tracking-tighter">
                        {room.id}
                    </h3>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        {room.type}
                    </p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-app-bg text-text-muted group-hover:bg-brand group-hover:text-white transition-colors">
                    {/* Now using the icons correctly */}
                    {getStatusIcon(room.status)}
                </div>
            </div>

            <div className="mt-8">
                <span
                    className="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter"
                    style={{
                        backgroundColor: `${statusColors[room.status]}20`,
                        color: statusColors[room.status],
                    }}
                >
                    {room.status}
                </span>
                <p className="text-xs mt-2 font-medium truncate h-4">
                    {room.guest || (
                        <span className="text-text-muted/30 italic">
                            No Guest
                        </span>
                    )}
                </p>
            </div>
        </motion.div>
    )
}
