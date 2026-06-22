import { useState } from "react"
import RoomCard from "./RoomCard"
import RoomDetailsPanel from "./RoomDetailsPanel"
import { api } from "../../../api"

const FILTERS = [
    "All",
    "Available",
    "Occupied",
    "Dirty",
    "Due Out",
    "Maintenance",
]

const statusMap = {
    "AVAILABLE": "available",
    "OCCUPIED": "occupied",
    "DIRTY": "dirty",
    "DUE_OUT": "due-out",
    "MAINTENANCE": "maintenance"
}

const reverseStatusMap = {
    "available": "AVAILABLE",
    "occupied": "OCCUPIED",
    "dirty": "DIRTY",
    "due-out": "DUE_OUT",
    "maintenance": "MAINTENANCE"
}

export default function RoomGrid({ userRole, rooms = [], roomTypes = [], reservations = [], triggerSync }) {
    const [filter, setFilter] = useState("All")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isCreateTypeModalOpen, setIsCreateTypeModalOpen] = useState(false)
    const [newRoom, setNewRoom] = useState({ room_number: "", room_type_id: "" })
    const [newRoomType, setNewRoomType] = useState({ name: "", base_price_per_night: "", max_occupancy: "" })
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [isPanelOpen, setIsPanelOpen] = useState(false)

    const today = new Date();
    today.setHours(0,0,0,0);

    const mappedRooms = rooms.map(r => {
        let statusStr = statusMap[r.housekeeping_status] || "available";

        // Find active reservation for this room
        const activeRes = reservations.find(res => res.room_id === r.id && res.status === 'CHECKED_IN');
        let displayGuest = null;

        if (activeRes) {
            displayGuest = activeRes.guest_name || activeRes.guest;
            const checkOutDate = new Date(activeRes.check_out_date);
            checkOutDate.setHours(0,0,0,0);
            
            // If checking out today or earlier, mark as due-out
            if (checkOutDate <= today) {
                statusStr = "due-out";
            }
        }

        return {
            ...r,
            displayId: r.room_number,
            type: r.room_type_name,
            status: statusStr,
            guest: displayGuest
        };
    })

    const filteredRooms = mappedRooms.filter(room => {
        if (filter === "All") return true;
        return room.status.toLowerCase() === filter.toLowerCase().replace(" ", "-");
    });

    const handleStatusChange = async (id, newStatusFrontend) => {
        const newStatusBackend = reverseStatusMap[newStatusFrontend];
        if (!newStatusBackend) return;
        try {
            await api.updateRoomStatus(id, newStatusBackend);
            triggerSync();
        } catch (error) {
            alert(error.message);
        }
    }

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            await api.createRoom(newRoom);
            setIsCreateModalOpen(false);
            setNewRoom({ room_number: "", room_type_id: "" });
            triggerSync();
        } catch (error) {
            alert(error.message);
        }
    }

    const handleCreateRoomType = async (e) => {
        e.preventDefault();
        try {
            await api.createRoomType(newRoomType);
            setIsCreateTypeModalOpen(false);
            setNewRoomType({ name: "", base_price_per_night: "", max_occupancy: "" });
            triggerSync();
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header with Quick Info */}
            <div className="flex justify-between items-center glass-panel p-3 rounded-2xl">
                <div className="flex gap-2 border-r border-border-subtle pr-4 mr-2">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all tracking-wider
               ${
                   filter === f
                       ? "bg-brand text-[var(--brand-text)] shadow-md"
                       : "bg-transparent text-text-muted hover:text-brand hover:bg-card-bg"
               }`}
                        >
                            {f.toUpperCase()}
                        </button>
                    ))}
                </div>
                
                {userRole === "root" && (
                    <div className="flex gap-3">
                        <button onClick={() => setIsCreateTypeModalOpen(true)} className="px-4 py-2 bg-card-bg border border-border-subtle text-text-main text-xs font-bold rounded-xl hover:text-brand transition-colors shadow-sm">
                            + Add Type
                        </button>
                        <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-brand text-[var(--brand-text)] text-xs font-bold rounded-xl hover:bg-brand/90 transition-colors shadow-sm">
                            + Add Room
                        </button>
                    </div>
                )}
            </div>

            {/* Grid of Rooms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filteredRooms.map((room) => (
                    <RoomCard 
                        key={room.id} 
                        room={room} 
                        onClick={(r) => { setSelectedRoom(r); setIsPanelOpen(true); }} 
                    />
                ))}
                {filteredRooms.length === 0 && (
                    <div className="col-span-full py-20 text-center text-text-muted font-bold text-lg">
                        No rooms configured yet.
                    </div>
                )}
            </div>

            {/* Create Room Type Modal */}
            {isCreateTypeModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-card-bg p-8 rounded-3xl w-[400px] border border-border-subtle shadow-2xl">
                        <h2 className="text-xl font-bold text-text-main mb-6">Deploy Room Type</h2>
                        <form onSubmit={handleCreateRoomType} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Type Name</label>
                                <input
                                    required
                                    className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-brand transition-colors"
                                    value={newRoomType.name}
                                    onChange={(e) => setNewRoomType({...newRoomType, name: e.target.value})}
                                    placeholder="e.g. Deluxe King"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Base Price</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-brand transition-colors"
                                        value={newRoomType.base_price_per_night}
                                        onChange={(e) => setNewRoomType({...newRoomType, base_price_per_night: e.target.value})}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Max Occ</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-brand transition-colors"
                                        value={newRoomType.max_occupancy}
                                        onChange={(e) => setNewRoomType({...newRoomType, max_occupancy: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsCreateTypeModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-text-secondary hover:bg-card-bg-hover">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-brand text-[var(--brand-text)] hover:bg-brand-hover">Deploy Type</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Room Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-card-bg p-8 rounded-3xl w-[400px] border border-border-subtle shadow-2xl">
                        <h2 className="text-xl font-bold text-text-main mb-6">Deploy New Room</h2>
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Room Number</label>
                                <input
                                    required
                                    className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-brand transition-colors"
                                    value={newRoom.room_number}
                                    onChange={(e) => setNewRoom({...newRoom, room_number: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Room Type</label>
                                {roomTypes.length === 0 ? (
                                    <div className="p-4 bg-app-bg text-text-muted text-sm font-bold rounded-xl border border-border-subtle text-center">
                                        Please deploy a Room Type first.
                                    </div>
                                ) : (
                                    <select 
                                        required
                                        className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-brand transition-colors appearance-none"
                                        value={newRoom.room_type_id}
                                        onChange={(e) => setNewRoom({...newRoom, room_type_id: e.target.value})}
                                    >
                                        <option value="" className="bg-app-bg text-text-main">Select Type...</option>
                                        {roomTypes.map(rt => <option key={rt.id} value={rt.id} className="bg-app-bg text-text-main">{rt.name}</option>)}
                                    </select>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-text-secondary hover:bg-card-bg-hover">Cancel</button>
                                <button type="submit" disabled={roomTypes.length === 0} className="px-5 py-2.5 rounded-xl font-bold bg-brand text-[var(--brand-text)] hover:bg-brand-hover disabled:opacity-50">Deploy Room</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <RoomDetailsPanel 
                room={selectedRoom}
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onStatusChange={handleStatusChange}
                userRole={userRole}
            />
        </div>
    )
}
