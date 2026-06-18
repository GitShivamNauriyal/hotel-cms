import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { UserCheck, Search, ChevronRight, CheckCircle2 } from "lucide-react"
import { api } from "../../../api"

export default function CheckinDashboard({ reservations = [], rooms = [], triggerSync }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRooms, setSelectedRooms] = useState({})

    // Filter for upcoming arriving guests
    const upcoming = reservations.filter(
        (res) => res.status === "UPCOMING"
    )

    const filtered = upcoming.filter(
        (res) =>
            (res.guest_name || res.guest || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCheckIn = async (res) => {
        const roomIdToAssign = res.room_id || selectedRooms[res.id];
        
        if (!roomIdToAssign) {
            alert("Please select a physical room to assign before checking in.");
            return;
        }

        try {
            await api.updateReservationStatus(res.id, "CHECKED_IN", roomIdToAssign);
            if (triggerSync) triggerSync();
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card-bg p-4 rounded-3xl border border-border-subtle shadow-sm">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search arrivals by name or confirmation number..."
                        className="w-full pl-11 pr-4 py-3 bg-app-bg border border-border-subtle rounded-2xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent transition-all"
                    />
                </div>
                <div className="text-sm font-bold text-text-muted bg-app-bg px-4 py-3 rounded-2xl border border-border-subtle">
                    {upcoming.length} Arriving Today
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filtered.map((res) => {
                        const availableRooms = rooms.filter(
                            r => r.room_type_id === res.room_type_id && r.housekeeping_status === 'AVAILABLE'
                        );

                        return (
                        <motion.div
                            key={res.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className="glass-panel p-6 rounded-3xl hover:border-brand/30 transition-all flex flex-col justify-between"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-black text-text-main">
                                            {res.guest_name || res.guest || "Unknown Guest"}
                                        </h3>
                                        <p className="text-xs font-bold text-text-muted tracking-widest uppercase">
                                            {res.id.split('-')[0].toUpperCase()}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-bold rounded-xl border border-yellow-500/20">
                                        ARRIVAL
                                    </span>
                                </div>
                                <div className="bg-app-bg p-3 rounded-2xl border border-border-subtle flex justify-between items-center">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Room Type</p>
                                        <p className="text-sm font-semibold text-text-main">{res.room_type_name}</p>
                                    </div>
                                    <div className="w-px h-8 bg-border-subtle" />
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Check In</p>
                                        <p className="text-sm font-semibold text-text-main">{new Date(res.check_in_date || res.checkin).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {!res.room_id && (
                                    <div className="pt-2">
                                        <label className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-1 block">Assign Physical Room</label>
                                        <select 
                                            className="w-full bg-card-bg border border-border-subtle p-3 rounded-xl text-text-main text-sm focus:border-brand outline-none appearance-none"
                                            value={selectedRooms[res.id] || ''}
                                            onChange={(e) => setSelectedRooms(prev => ({...prev, [res.id]: e.target.value}))}
                                        >
                                            <option value="" className="bg-app-bg text-text-main">-- Select Available Room --</option>
                                            {availableRooms.map(r => (
                                                <option key={r.id} value={r.id} className="bg-app-bg text-text-main">
                                                    Room {r.room_number}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {res.room_id && (
                                    <div className="pt-2 flex justify-between items-center bg-card-bg p-3 rounded-xl border border-border-subtle">
                                        <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Assigned Room</span>
                                        <span className="text-sm font-black text-brand">Rm {res.room_number}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => handleCheckIn(res)}
                                disabled={!res.room_id && !selectedRooms[res.id]}
                                className="mt-6 w-full py-4 bg-brand text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-brand/20 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckCircle2 size={16} />
                                Complete Check-In
                            </button>
                        </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filtered.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-brand/5 flex items-center justify-center mb-4 border border-brand/10">
                            <UserCheck size={32} className="text-text-muted" />
                        </div>
                        <h3 className="text-lg font-black text-text-main">No pending arrivals</h3>
                        <p className="text-sm text-text-muted font-medium mt-1">All guests for today have been checked in or none match search.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
