import AnalyticsDashboard from "../modules/bi/components/AnalyticsDashboard"

export default function BIPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-text-main tracking-[-0.02em]">
                    Business Intelligence
                </h1>
            </div>
            <AnalyticsDashboard />
        </div>
    )
}
