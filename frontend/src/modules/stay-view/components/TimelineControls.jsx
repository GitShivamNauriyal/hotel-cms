import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { format, addDays, subDays } from "date-fns"

export default function TimelineControls({ 
    activeFilter, 
    setFilter, 
    roomTypes = [],
    timelineStartDate,
    setTimelineStartDate,
    viewDuration,
    setViewDuration
}) {
    const types = ["All Rooms", ...roomTypes]

    const handlePrevious = () => {
        setTimelineStartDate(prev => subDays(prev, viewDuration >= 30 ? 30 : 7))
    }

    const handleNext = () => {
        setTimelineStartDate(prev => addDays(prev, viewDuration >= 30 ? 30 : 7))
    }

    const handleToday = () => {
        const today = new Date();
        today.setHours(0,0,0,0);
        setTimelineStartDate(today);
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-card-bg p-4 rounded-3xl border border-border-subtle shadow-sm">
            <div className="flex items-center gap-4">
                <select
                    value={activeFilter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-app-bg text-text-main text-sm font-bold border border-border-subtle rounded-2xl px-4 py-2 focus:outline-none focus:border-brand appearance-none min-w-[150px]"
                >
                    {types.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                <select
                    value={viewDuration}
                    onChange={(e) => setViewDuration(Number(e.target.value))}
                    className="bg-app-bg text-text-main text-sm font-bold border border-border-subtle rounded-2xl px-4 py-2 focus:outline-none focus:border-brand appearance-none"
                >
                    <option value={7}>1 Week View</option>
                    <option value={14}>2 Weeks View</option>
                    <option value={30}>1 Month View</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <button 
                    onClick={handleToday}
                    className="flex items-center gap-2 px-4 py-2 mr-2 bg-brand/10 text-brand font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-brand/20 transition-colors"
                >
                    <CalendarDays size={16} /> Today
                </button>
                <button onClick={handlePrevious} className="p-3 bg-app-bg border border-border-subtle rounded-2xl text-text-muted hover:text-brand transition-colors">
                    <ChevronLeft size={18} />
                </button>
                <div className="px-5 py-2.5 bg-app-bg border border-border-subtle rounded-2xl text-sm font-black text-text-main min-w-[140px] text-center tracking-widest uppercase shadow-inner">
                    {format(timelineStartDate, "MMM yyyy")}
                </div>
                <button onClick={handleNext} className="p-3 bg-app-bg border border-border-subtle rounded-2xl text-text-muted hover:text-brand transition-colors">
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    )
}
