import { motion } from "motion/react"
import { hapticWidgets } from "../../../lib/motion"

export default function ReservationBar({ reservation, position }) {
    const getStatusColor = (status) => {
        switch (status) {
            case "Checked-in":
                return "var(--color-status-available)"
            case "Confirmed":
                return "var(--color-status-reservation)"
            case "Due Out":
                return "var(--color-status-due-out)"
            default:
                return "var(--color-brand)"
        }
    }

    return (
        <motion.div
            whileHover={{ y: -1, scaleY: 1.02 }}
            whileTap={hapticWidgets.tap}
            style={{
                left: `${position.left + 128}px`, // +128px to account for the Room ID column
                width: `${position.width}px`,
                top: `${position.top}px`,
                backgroundColor: getStatusColor(reservation.status),
            }}
            className="absolute h-12 rounded-xl shadow-lg z-10 cursor-pointer p-3 flex items-center border border-white/10 overflow-hidden"
        >
            <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-black text-white truncate uppercase tracking-tight">
                    {reservation.guestName}
                </span>
                <span className="text-[9px] text-white/70 font-bold tracking-tighter">
                    {reservation.id} • {reservation.status}
                </span>
            </div>
        </motion.div>
    )
}
