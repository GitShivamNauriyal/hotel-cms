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
import SuperAdminPage from "./pages/SuperAdminPage"

import LoginPage from "./pages/LoginPage"

import { MOCK_RESERVATIONS as initialData } from "./modules/stay-view/constants/mockData"

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userRole, setUserRole] = useState(null) // 'super_admin', 'root', 'staff'
    const [activeTab, setActiveTab] = useState("rooms")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const [reservations, setReservations] = useState(initialData)

    const [rooms, setRooms] = useState([
        { id: "101", type: "Deluxe", status: "available", guest: null },
        { id: "102", type: "Executive", status: "occupied", guest: "John Doe" },
        { id: "103", type: "Single", status: "dirty", guest: null },
        { id: "104", type: "Deluxe", status: "due-out", guest: "Jane Smith" },
        { id: "105", type: "Family", status: "maintenance", guest: null },
    ])

    const handleLogin = (email, password) => {
        // Mock authentication logic
        if (password !== "password123") return false

        if (email === "super@hotelcms.com") {
            setUserRole("super_admin")
            setActiveTab("super-admin")
        } else if (email === "root@hotel1.com" || email === "root@hotel2.com") {
            setUserRole("root")
            setActiveTab("rooms")
        } else if (email === "staff@hotel1.com") {
            setUserRole("staff")
            setActiveTab("rooms")
        } else {
            return false
        }

        setIsAuthenticated(true)
        return true
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        setUserRole(null)
    }

    const addReservation = (newRes) => {
        setReservations((prev) => [
            ...prev,
            {
                ...newRes,
                id: `RES-${Math.floor(Math.random() * 9000) + 1000}`,
            },
        ])
    }

    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />
    }

    if (userRole === "super_admin") {
        return <SuperAdminPage onLogout={handleLogout} />
    }

    const renderContent = () => {
        switch (activeTab) {
            case "rooms":
                return <RoomGrid userRole={userRole} rooms={rooms} setRooms={setRooms} />
            case "stay":
                return <StayViewPage userRole={userRole} />
            case "checkins":
                return <CheckinsPage userRole={userRole} reservations={reservations} setReservations={setReservations} />
            case "reservations":
                return (
                    <ReservationsPage
                        reservations={reservations}
                        addReservation={addReservation}
                        userRole={userRole}
                    />
                )
            case "food":
                return <FoodPage userRole={userRole} />
            case "ledger":
                return <LedgerPage userRole={userRole} />
            case "inventory":
                return <InventoryPage userRole={userRole} />
            case "bi":
                return <BIPage userRole={userRole} />
            case "cm":
                return <ChannelManagerPage userRole={userRole} />
            case "super-admin":
                return <SuperAdminPage />
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
            onLogout={handleLogout}
        >
            {renderContent()}
        </Layout>
    )
}
