import CheckinDashboard from "../modules/checkins/components/CheckinDashboard"

export default function CheckinsPage({ userRole, reservations, rooms, triggerSync, setActiveTab }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-text-main tracking-[-0.02em]">
                    All Checkins
                </h1>
            </div>
            <CheckinDashboard reservations={reservations} rooms={rooms} triggerSync={triggerSync} onNavigate={setActiveTab} />
        </div>
    )
}
