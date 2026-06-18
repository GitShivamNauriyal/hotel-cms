import { useMemo } from "react"
import { generateTimelineDates } from "../utils/dateHelpers"

export default function TimelineGrid({ children, resources, startDate, daysCount = 14 }) {
    const dates = useMemo(() => generateTimelineDates(startDate, daysCount), [startDate, daysCount])

    return (
        <div className="h-full flex flex-col glass-panel rounded-3xl overflow-hidden transition-colors duration-500">
            <div className="flex-1 overflow-auto relative">
                <div className="inline-flex flex-col min-w-full relative">
                    {/* Overlaying the Reservation Bars */}
                    {children}

                    {/* Timeline Header */}
                    <div className="flex sticky top-0 z-20 bg-sidebar-bg/90 backdrop-blur-md border-b border-border-subtle transition-colors">
                        <div className="w-32 shrink-0 sticky left-0 z-30 bg-sidebar-bg/90 backdrop-blur-md border-r border-border-subtle p-4 font-black text-[10px] tracking-[0.2em] text-text-muted uppercase flex items-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                            ROOMS
                        </div>
                        {dates.map((d) => (
                            <div
                                key={d.formattedDate}
                                className={`w-24 shrink-0 p-2 text-center border-r border-border-subtle flex flex-col items-center justify-center transition-colors relative
                                ${d.isToday ? "bg-brand/10 border-b-2 border-b-brand" : ""} ${d.isWeekend ? "bg-app-bg/50" : ""}`}
                            >
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${d.isToday ? "text-brand" : "text-text-muted"}`}>
                                    {d.formattedDay}
                                </span>
                                <span
                                    className={`text-[13px] font-black mt-0.5 ${d.isToday ? "text-brand" : "text-text-main"}`}
                                >
                                    {d.formattedDate}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Timeline Body - Room Rows */}
                    {resources.map((room) => (
                        <div
                            key={room.id}
                            className="flex border-b border-border-subtle hover:bg-card-bg transition-colors h-16 group"
                        >
                            {/* Sticky Room Label */}
                            <div className="w-32 shrink-0 sticky left-0 z-10 border-r border-border-subtle bg-sidebar-bg/90 backdrop-blur-md p-4 transition-colors group-hover:bg-card-bg shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                                <span className="font-bold text-sm text-text-main tracking-[-0.02em]">
                                    {room.displayId || room.id}
                                </span>
                                <p className="text-[9px] font-semibold text-text-muted uppercase tracking-[0.1em] mt-0.5">
                                    {room.type}
                                </p>
                            </div>

                            {/* Day Cells */}
                            {dates.map((d) => (
                                <div
                                    key={`${room.id}-${d.formattedDate}`}
                                    className={`w-24 shrink-0 h-full border-r border-border-subtle/40 transition-colors relative
                                    ${d.isToday ? "bg-brand/5 border-l border-r border-brand/20" : ""} ${d.isWeekend ? "bg-app-bg/10" : ""}`}
                                >
                                    {/* Indicator line for 'Today' */}
                                    {d.isToday && <div className="absolute top-0 bottom-0 left-1/2 w-px bg-brand/30 -translate-x-1/2 pointer-events-none" />}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
