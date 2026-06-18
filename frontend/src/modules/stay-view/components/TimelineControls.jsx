import { ChevronLeft, ChevronRight, Filter } from "lucide-react"

export default function TimelineControls({ activeFilter, setFilter }) {
    const types = ["All Rooms", "Family", "Deluxe", "Executive"]

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-card-bg p-4 rounded-3xl border border-border-subtle shadow-sm">
            <div className="flex bg-app-bg p-1 rounded-2xl border border-border-subtle">
                {types.map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${activeFilter === t ? "bg-brand text-app-bg shadow-md" : "text-text-muted hover:text-brand"}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <button className="p-3 bg-app-bg border border-border-subtle rounded-2xl text-text-muted hover:text-brand">
                    <ChevronLeft size={18} />
                </button>
                <div className="px-4 py-2 bg-app-bg border border-border-subtle rounded-2xl text-xs font-black">
                    JAN 2026
                </div>
                <button className="p-3 bg-app-bg border border-border-subtle rounded-2xl text-text-muted hover:text-brand">
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    )
}
