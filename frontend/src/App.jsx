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
import { api } from "./api"

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => JSON.parse(sessionStorage.getItem('isAuthenticated') || 'false'))
    const [userRole, setUserRole] = useState(() => sessionStorage.getItem('userRole') || null) 
    const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('activeTab') || "rooms")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    
    // Dynamic Global Data
    const [profile, setProfile] = useState(null)
    const [reservations, setReservations] = useState([])
    const [rooms, setRooms] = useState([])
    const [roomTypes, setRoomTypes] = useState([])
    const [isLoadingData, setIsLoadingData] = useState(false)

    // Data Sync Trigger (bump this to refetch)
    const [syncTick, setSyncTick] = useState(0)
    const triggerSync = () => setSyncTick(prev => prev + 1)

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
    }, [isAuthenticated, userRole, activeTab])

    useEffect(() => {
        if (isAuthenticated) {
            setIsLoadingData(true)
            Promise.all([
                api.getProfile().catch(() => null),
                api.getReservations().catch(() => []),
                api.getRooms().catch(() => []),
                api.getRoomTypes().catch(() => [])
            ]).then(([profData, resData, roomData, typeData]) => {
                if (profData) setProfile(profData);
                if (resData) setReservations(resData);
                if (roomData) setRooms(roomData);
                if (typeData) setRoomTypes(typeData);
            }).finally(() => {
                setIsLoadingData(false)
            });
        }
    }, [isAuthenticated, syncTick])

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
        setProfile(null);
        setReservations([]);
        setRooms([]);
    }

    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />
    }

    const renderContent = () => {
        if (isLoadingData && !profile) {
            return <div className="h-full flex items-center justify-center font-bold text-text-muted">Loading Engine...</div>
        }

        switch (activeTab) {
            case "rooms":
                return <RoomGrid userRole={userRole} rooms={rooms} roomTypes={roomTypes} reservations={reservations} triggerSync={triggerSync} />
            case "stay":
                return <StayViewPage userRole={userRole} rooms={rooms} reservations={reservations} triggerSync={triggerSync} />
            case "checkins":
                return <CheckinsPage userRole={userRole} reservations={reservations} rooms={rooms} triggerSync={triggerSync} />
            case "reservations":
                return (
                    <ReservationsPage
                        reservations={reservations}
                        roomTypes={roomTypes}
                        userRole={userRole}
                        triggerSync={triggerSync}
                    />
                )
            case "food":
                return <FoodPage userRole={userRole} reservations={reservations} triggerSync={triggerSync} />
            case "ledger":
                return <LedgerPage userRole={userRole} reservations={reservations} triggerSync={triggerSync} />
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
            profile={profile}
        >
            {renderContent()}
        </Layout>
    )
}
