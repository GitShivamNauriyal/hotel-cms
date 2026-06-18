import { useState } from "react"
import TimelineGrid from "../modules/stay-view/components/TimelineGrid"
import TimelineControls from "../modules/stay-view/components/TimelineControls"
import ReservationBar from "../modules/stay-view/components/ReservationBar"
import { calculateBarPosition } from "../modules/stay-view/utils/timelineHelpers"

export default function StayViewPage({ rooms = [], reservations = [] }) {
    const [filter, setFilter] = useState("All Rooms")
    const timelineStart = new Date()

    const filteredResources = filter === "All Rooms" 
        ? rooms 
        : rooms.filter(r => r.type === filter);

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tight text-text-main uppercase">
                    Stay Timeline
                </h1>
            </div>

            <TimelineControls activeFilter={filter} setFilter={setFilter} />

            <div className="flex-1 relative min-h-0">
                <TimelineGrid resources={filteredResources}>
                    {reservations.map((res) => {
                        const pos = calculateBarPosition(
                            res.checkIn,
                            res.checkOut,
                            timelineStart,
                        )

                        // Calculate rowIndex dynamically from filteredResources
                        const rowIndex = filteredResources.findIndex(
                            (r) => r.id === res.roomId,
                        )
                        if (rowIndex === -1) return null

                        const rowHeight = 64
                        const headerHeight = 64

                        return (
                            <ReservationBar
                                key={res.id}
                                reservation={res}
                                position={{
                                    ...pos,
                                    top:
                                        headerHeight +
                                        rowIndex * rowHeight +
                                        10,
                                }}
                            />
                        )
                    })}
                </TimelineGrid>
            </div>
        </div>
    )
}
