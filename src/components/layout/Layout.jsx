import Sidebar from "./Sidebar"
import TopNav from "./TopNav"

export default function Layout({
    children,
    currentView,
    activeId,
    setActiveId,
    isOpen,
    toggleSidebar,
}) {
    return (
        <div className="flex h-screen w-full bg-app-bg overflow-hidden transition-colors duration-300">
            <Sidebar
                isOpen={isOpen}
                toggleSidebar={toggleSidebar}
                activeId={activeId}
                setActiveId={setActiveId}
            />

            <div className="flex flex-col flex-1 min-w-0 h-full">
                <TopNav currentView={currentView} />
                <main className="flex-1 overflow-y-auto p-6 bg-app-bg">
                    {children}
                </main>
            </div>
        </div>
    )
}
