import GlobalDashboard from "../modules/super-admin/components/GlobalDashboard"

export default function SuperAdminPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-text-main tracking-[-0.02em]">
                    System Administration
                </h1>
            </div>
            <GlobalDashboard />
        </div>
    )
}
