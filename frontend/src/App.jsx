import { useState, useEffect } from "react"
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
import LoginPage from "./pages/LoginPage"

import { MOCK_RESERVATIONS as initialData } from "./modules/stay-view/constants/mockData"

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => JSON.parse(sessionStorage.getItem('isAuthenticated') || 'false'))
    const [userRole, setUserRole] = useState(() => sessionStorage.getItem('userRole') || null) 
    const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('activeTab') || "rooms")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const [reservations, setReservations] = useState(() => {
        const saved = sessionStorage.getItem('reservations');
        return saved ? JSON.parse(saved) : initialData;
    })

    const [rooms, setRooms] = useState(() => {
        const saved = sessionStorage.getItem('rooms');
        return saved ? JSON.parse(saved) : [
            { id: "101", type: "Deluxe", status: "available", guest: null },
            { id: "102", type: "Executive", status: "occupied", guest: "John Doe" },
            { id: "103", type: "Single", status: "dirty", guest: null },
            { id: "104", type: "Deluxe", status: "due-out", guest: "Jane Smith" },
            { id: "105", type: "Family", status: "maintenance", guest: null },
        ];
    })

    useEffect(() => {
        if (userRole === 'super_admin') {
            sessionStorage.clear()
            window.location.reload()
            return
        }

        sessionStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated))
        if (userRole) sessionStorage.setItem('userRole', userRole)
        else sessionStorage.removeItem('userRole')
        sessionStorage.setItem('activeTab', activeTab)
        sessionStorage.setItem('reservations', JSON.stringify(reservations))
        sessionStorage.setItem('rooms', JSON.stringify(rooms))
    }, [isAuthenticated, userRole, activeTab, reservations, rooms])

    const handleLogin = async (email, password) => {
        try {
            const res = await fetch("http://localhost:4000/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) return false;

            const data = await res.json();
            sessionStorage.setItem("token", data.token);

            // Parse JWT payload natively
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            
            let role = "staff";
            if (payload.is_root) role = "root";

            setUserRole(role);
            setActiveTab("rooms");
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    }

    const handleLogout = () => {
        sessionStorage.clear();
        setIsAuthenticated(false);
        setUserRole(null);
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
    const renderContent = () => {
        switch (activeTab) {
            case "rooms":
                return <RoomGrid userRole={userRole} rooms={rooms} setRooms={setRooms} />
            case "stay":
                return <StayViewPage userRole={userRole} rooms={rooms} reservations={reservations} />
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
