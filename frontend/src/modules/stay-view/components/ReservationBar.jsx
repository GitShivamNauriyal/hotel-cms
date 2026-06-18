import { motion } from "motion/react"
import { hapticWidgets } from "../../../lib/motion"

export default function ReservationBar({ reservation, position }) {
    const getStatusTheme = (status) => {
        switch (status) {
            case "CHECKED_IN":
                return { bg: "bg-green-500/20 border-green-500/40", text: "text-green-700 dark:text-green-300" }
            case "UPCOMING":
                return { bg: "bg-brand/20 border-brand/40", text: "text-brand" }
            case "CHECKED_OUT":
                return { bg: "bg-gray-500/20 border-gray-500/40", text: "text-gray-700 dark:text-gray-300" }
            case "CANCELLED":
                return { bg: "bg-red-500/20 border-red-500/40", text: "text-red-700 dark:text-red-300" }
            default:
                return { bg: "bg-yellow-500/20 border-yellow-500/40", text: "text-yellow-700 dark:text-yellow-300" }
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
            }}
            title={`${reservation.guestName || reservation.guest} (${reservation.status}) - In: ${new Date(reservation.checkIn).toLocaleDateString()} Out: ${new Date(reservation.checkOut).toLocaleDateString()}`}
            className={`absolute h-[44px] mt-[10px] rounded-2xl shadow-sm z-10 cursor-pointer p-3 flex items-center border overflow-hidden hover-lift ${theme.bg} ${theme.text}`}
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
