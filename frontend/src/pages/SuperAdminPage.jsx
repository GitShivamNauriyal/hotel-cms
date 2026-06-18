import GlobalDashboard from "../modules/super-admin/components/GlobalDashboard"
import TopNav from "../components/layout/TopNav"

export default function SuperAdminPage({ onLogout }) {
    return (
        <div className="flex h-screen w-full bg-app-bg overflow-hidden text-text-main font-sans">
            <div className="flex flex-col flex-1 min-w-0 h-full">
                <TopNav currentView="System Administration" onLogout={onLogout} />
                <main className="flex-1 overflow-y-auto p-6 bg-app-bg">
                    <div className="space-y-6">
                        <GlobalDashboard />
                    </div>
                </main>
            </div>
        </div>
    )
}
