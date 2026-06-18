import { useState } from "react"
import Layout from "./components/layout/Layout"
import RoomGrid from "./modules/rooms/components/RoomGrid"
import ReservationsPage from "./pages/ReservationPage"
import StayViewPage from "./pages/StayviewPage"
import CheckinsPage from "./pages/CheckinsPage"
import FoodPage from "./pages/FoodPage"
import LedgerPage from "./pages/LedgerPage"
import InventoryPage from "./pages/InventoryPage"
import BIPage from "./pages/BIPage"
import ChannelManagerPage from "./pages/ChannelManagerPage"

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
            case "stay":
                return <StayViewPage />
            case "checkins":
                return <CheckinsPage />
            case "reservations":
                return (
                    <ReservationsPage
                        reservations={reservations}
                        addReservation={addReservation}
                    />
                )
            case "food":
                return <FoodPage />
            case "ledger":
                return <LedgerPage />
            case "inventory":
                return <InventoryPage />
            case "bi":
                return <BIPage />
            case "cm":
                return <ChannelManagerPage />
            default:
                return (
                    <div className="glass-panel p-10 rounded-3xl min-h-[400px] flex items-center justify-center">
                        <h1 className="text-xl font-black text-text-muted uppercase tracking-widest">
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
