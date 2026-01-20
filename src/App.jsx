import { useState } from "react"
import Layout from "./components/layout/Layout"
import RoomGrid from "./modules/rooms/components/RoomGrid"

export default function App() {
    const [activeTab, setActiveTab] = useState("rooms")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const renderContent = () => {
        switch (activeTab) {
            case "rooms":
                return <RoomGrid />
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
