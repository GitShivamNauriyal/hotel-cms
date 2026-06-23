import { motion } from "motion/react"
import { hapticWidgets } from "../../../lib/motion"
import { User, Sparkles, Wrench, AlertCircle, Clock } from "lucide-react"

export default function RoomCard({ room, onClick, onQuickClean }) {
    const statusBg = {
        available: "var(--color-status-available-bg)",
        occupied: "var(--color-status-occupied-bg)",
        dirty: "var(--color-status-dirty-bg)",
        "due-out": "var(--color-status-due-out-bg)",
        maintenance: "var(--color-status-maintenance-bg)",
    }
    const statusText = {
        available: "var(--color-status-available-text)",
        occupied: "var(--color-status-occupied-text)",
        dirty: "var(--color-status-dirty-text)",
        "due-out": "var(--color-status-due-out-text)",
        maintenance: "var(--color-status-maintenance-text)",
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "occupied":
                return <User size={14} />
            case "dirty":
                return <Sparkles size={14} />
            case "maintenance":
                return <Wrench size={14} />
            case "due-out":
                return <Clock size={14} />
            default:
                return (
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: statusText[status] }}
                    />
                )
        }
    }

    return (
        <motion.div
            whileHover={hapticWidgets.hover}
            whileTap={hapticWidgets.tap}
            onClick={() => onClick && onClick(room)}
            className="bg-card-bg rounded-3xl border border-border-subtle p-5 shadow-sm cursor-pointer relative overflow-hidden group hover-lift"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-3xl text-text-main font-bold tracking-[-0.05em]">
                        {room.displayId || room.id}
                    </h3>
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.2em] mt-1">
                        {room.type}
                    </p>
                </div>
                <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm"
                    style={{
                        backgroundColor: statusBg[room.status],
                        color: statusText[room.status],
                    }}
                >
                    {getStatusIcon(room.status)}
                </div>
            </div>

            <div className="mt-8 flex items-end justify-between">
                <div>
                    <div
                        className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block"
                        style={{
                            backgroundColor: statusBg[room.status],
                            color: statusText[room.status],
                        }}
                    >
                        {room.status.replace("-", " ")}
                    </div>
                    <p className="text-[13px] mt-4 font-medium truncate max-w-[120px] text-text-secondary">
                        {room.guest || (
                            <span className="text-text-muted/40 italic">
                                Vacant
                            </span>
                        )}
                    </p>
                </div>
                {room.status === 'dirty' && onQuickClean && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onQuickClean(room); }}
                        className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-colors"
                        title="Quick Clean"
                    >
                        <Sparkles size={16} />
                    </button>
                )}
            </div>
        </motion.div>
    )
}
