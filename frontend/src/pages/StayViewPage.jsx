import { useState } from "react"
import TimelineGrid from "../modules/stay-view/components/TimelineGrid"
import TimelineControls from "../modules/stay-view/components/TimelineControls"
import ReservationBar from "../modules/stay-view/components/ReservationBar"
import { calculateBarPosition } from "../modules/stay-view/utils/timelineHelpers"

export default function StayViewPage({ rooms = [], reservations = [] }) {
    const [filter, setFilter] = useState("All Rooms")
    
    // Timeline State
    const [timelineStartDate, setTimelineStartDate] = useState(() => {
        const d = new Date();
        d.setHours(0,0,0,0);
        return d;
    });
    const [viewDuration, setViewDuration] = useState(14); // 14 days default

    const uniqueRoomTypes = Array.from(new Set(rooms.map(r => r.room_type_name))).filter(Boolean);

    const mappedRooms = rooms.map(r => ({
        ...r,
        id: r.id,
        displayId: r.room_number,
        type: r.room_type_name
    }));

    const mappedReservations = reservations.map(res => ({
        ...res,
        id: res.id,
        roomId: res.room_id,
        checkIn: res.check_in_date || res.checkin || new Date().toISOString(),
        checkOut: res.check_out_date || res.checkout || new Date().toISOString(),
        guest: res.guest_name || res.guest || "Unknown",
        status: res.status
    }));

    const filteredResources = filter === "All Rooms" 
        ? mappedRooms 
        : mappedRooms.filter(r => r.type === filter);

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tight text-text-main uppercase">
                    Stay Timeline
                </h1>
            </div>

            <TimelineControls 
                activeFilter={filter} 
                setFilter={setFilter} 
                roomTypes={uniqueRoomTypes}
                timelineStartDate={timelineStartDate}
                setTimelineStartDate={setTimelineStartDate}
                viewDuration={viewDuration}
                setViewDuration={setViewDuration}
            />

            <div className="flex-1 relative min-h-0">
                <TimelineGrid 
                    resources={filteredResources}
                    startDate={timelineStartDate}
                    daysCount={viewDuration}
                >
                    {mappedReservations.map((res) => {
                        const pos = calculateBarPosition(
                            res.checkIn,
                            res.checkOut,
                            timelineStartDate,
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
