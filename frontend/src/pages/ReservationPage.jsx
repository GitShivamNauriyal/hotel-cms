import { useState, useEffect } from "react"
import ReservationFilters from "../modules/reservations/components/ReservationFilters"
import ReservationList from "../modules/reservations/components/ReservationList"
import NewReservationDrawer from "../modules/reservations/components/NewReservationDrawer"
import ReservationDetailSidebar from "../modules/reservations/components/ReservationDetailSidebar"
import { Plus } from "lucide-react"
import { motion } from "motion/react"
import { hapticWidgets } from "../lib/motion"

export default function ReservationsPage({ reservations, roomTypes = [], triggerSync, userRole }) {
    const [filteredData, setFilteredData] = useState(reservations)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedReservation, setSelectedReservation] = useState(null)

    // Ensure the list updates when the master data or filters change
    useEffect(() => {
        setFilteredData(reservations)
    }, [reservations])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black text-text-main tracking-tight uppercase italic">
                    Reservations
                </h1>
                <motion.button
                    whileTap={hapticWidgets.tap}
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex items-center gap-2 bg-brand text-[var(--brand-text)] px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand/20 transition-transform hover:scale-105"
                >
                    <Plus size={20} />
                    ADD NEW RESERVATION
                </motion.button>
            </div>

            <ReservationFilters
                data={reservations}
                setFilteredData={setFilteredData}
            />

            <ReservationList
                data={filteredData}
                onRowClick={(res) => setSelectedReservation(res)}
            />

            <NewReservationDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                roomTypes={roomTypes}
                triggerSync={triggerSync}
            />

            <ReservationDetailSidebar
                reservation={selectedReservation}
                isOpen={!!selectedReservation}
                onClose={() => setSelectedReservation(null)}
                userRole={userRole}
                triggerSync={triggerSync}
            />
        </div>
    )
}
