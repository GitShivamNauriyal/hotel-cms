import { useMemo } from "react"
import { generateTimelineDates } from "../utils/dateHelpers"
import { MOCK_RESOURCES } from "../constants/mockData" // Ensure exact casing here

export default function TimelineGrid({ children }) {
    const dates = useMemo(() => generateTimelineDates(21), [])

    return (
        <div className="h-full flex flex-col bg-card-bg border border-border-subtle rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <div className="flex-1 overflow-auto scrollbar-hide relative">
                <div className="inline-flex flex-col min-w-full relative">
                    {/* Overlaying the Reservation Bars */}
                    {children}

                    {/* Timeline Header - Dark Mode Optimized */}
                    <div className="flex sticky top-0 z-20 bg-sidebar-bg border-b border-border-subtle transition-colors">
                        <div className="w-32 shrink-0 border-r border-border-subtle bg-sidebar-bg p-4 font-black text-[10px] tracking-widest text-text-muted uppercase">
                            ROOMS
                        </div>
                        {dates.map((d) => (
                            <div
                                key={d.formattedDate}
                                className={`w-24 shrink-0 p-2 text-center border-r border-border-subtle flex flex-col items-center justify-center transition-colors
                ${d.isToday ? "bg-brand/10" : ""} ${d.isWeekend ? "bg-app-bg/50" : ""}`}
                            >
                                <span className="text-[10px] font-bold text-text-muted uppercase">
                                    {d.formattedDay}
                                </span>
                                <span
                                    className={`text-xs font-black ${d.isToday ? "text-brand" : "text-text-main"}`}
                                >
                                    {d.formattedDate}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Timeline Body - Room Rows */}
                    {MOCK_RESOURCES.map((room) => (
                        <div
                            key={room.id}
                            className="flex border-b border-border-subtle hover:bg-app-bg/30 transition-colors h-16"
                        >
                            {/* Sticky Room Label */}
                            <div className="w-32 shrink-0 sticky left-0 z-10 border-r border-border-subtle bg-sidebar-bg p-4 transition-colors">
                                <span className="font-black text-sm text-text-main">
                                    {room.id}
                                </span>
                                <p className="text-[8px] font-bold text-text-secondary uppercase tracking-tighter">
                                    {room.type}
                                </p>
                            </div>

                            {/* Day Cells */}
                            {dates.map((d) => (
                                <div
                                    key={`${room.id}-${d.formattedDate}`}
                                    className={`w-24 shrink-0 h-full border-r border-border-subtle/30 transition-colors
                  ${d.isToday ? "bg-brand/5" : ""} ${d.isWeekend ? "bg-app-bg/10" : ""}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
