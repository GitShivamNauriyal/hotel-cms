import { motion } from "motion/react"
import { hapticWidgets } from "../../../lib/motion"

export default function ReservationBar({ reservation, position }) {
    const getStatusTheme = (status) => {
        switch (status) {
            case "Checked-in":
                return { bg: "var(--color-status-occupied-bg)", text: "var(--color-status-occupied-text)" }
            case "Confirmed":
                return { bg: "var(--color-status-available-bg)", text: "var(--color-status-available-text)" }
            case "Due Out":
                return { bg: "var(--color-status-due-out-bg)", text: "var(--color-status-due-out-text)" }
            default:
                return { bg: "var(--color-status-maintenance-bg)", text: "var(--color-status-maintenance-text)" }
        }
    }

    const theme = getStatusTheme(reservation.status)

    return (
        <motion.div
            whileHover={hapticWidgets.hover}
            whileTap={hapticWidgets.tap}
            style={{
                left: `${position.left + 128}px`, // +128px to account for the Room ID column
                width: `${position.width}px`,
                top: `${position.top}px`,
                backgroundColor: theme.bg,
                color: theme.text,
            }}
            className="absolute h-[44px] mt-[10px] rounded-2xl shadow-sm z-10 cursor-pointer p-3 flex items-center border border-border-subtle/30 overflow-hidden hover-lift"
        >
            <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-bold truncate uppercase tracking-widest">
                    {reservation.guestName}
                </span>
                <span className="text-[9px] opacity-80 font-semibold tracking-wide">
                    {reservation.id} • {reservation.status}
                </span>
            </div>
        </motion.div>
    )
}
