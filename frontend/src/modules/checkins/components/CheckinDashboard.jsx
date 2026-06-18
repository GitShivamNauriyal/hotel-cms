import { motion } from "motion/react"
import { UserCheck } from "lucide-react"

export default function CheckinDashboard() {
    return (
        <div className="glass-panel p-8 rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-6 text-brand">
                <UserCheck size={32} />
            </div>
            <h2 className="text-xl font-bold text-text-main mb-2">
                Checkins Module Active
            </h2>
            <p className="text-sm font-semibold text-text-muted max-w-md">
                The biometric and rapid check-in flows will be integrated here during Phase 3.
            </p>
        </div>
    )
}
