import { useState } from "react"
import Layout from "./components/layout/Layout"
import RoomGrid from "./modules/rooms/components/RoomGrid"
import ReservationsPage from "./pages/ReservationPage"
import StayViewPage from "./pages/StayviewPage"
import { MOCK_RESERVATIONS as initialData } from "./modules/stay-view/constants/mockData"

export default function App() {
    const [activeTab, setActiveTab] = useState("rooms")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const [reservations, setReservations] = useState(initialData)

    const addReservation = (newRes) => {
        setReservations((prev) => [
            ...prev,
            {
                ...newRes,
                id: `RES-${Math.floor(Math.random() * 9000) + 1000}`,
            },
        ])
    }

    const renderContent = () => {
        switch (activeTab) {
            case "rooms":
                return <RoomGrid />
            case "reservations":
                return (
                    <ReservationsPage
                        reservations={reservations}
                        addReservation={addReservation}
                    />
                )
            case "stay":
                return <StayViewPage />
            default:
                return (
                    <div className="p-10 bg-card-bg rounded-3xl border border-border-subtle">
                        <h1 className="text-xl font-black opacity-50 uppercase tracking-widest">
                            {activeTab} Coming Soon
                        </h1>
                    </div>
                )
        }
    }

    return (
        <Layout
            currentView={activeTab}
            activeId={activeTab}
            setActiveId={setActiveTab}
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        >
            {renderContent()}
        </Layout>
    )
}
