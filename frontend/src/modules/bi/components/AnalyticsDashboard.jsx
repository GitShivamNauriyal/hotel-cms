import { motion } from "motion/react"
import { PieChart, TrendingUp, Users, DollarSign, Activity } from "lucide-react"

const METRICS = [
    { label: "RevPAR", value: "$184.50", trend: "+12.5%", icon: <TrendingUp size={20} /> },
    { label: "ADR", value: "$210.00", trend: "+5.2%", icon: <DollarSign size={20} /> },
    { label: "Occupancy", value: "87.8%", trend: "+2.1%", icon: <Users size={20} /> },
    { label: "Total Revenue", value: "$45,210", trend: "+18.4%", icon: <Activity size={20} /> },
]

export default function AnalyticsDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {METRICS.map((m, i) => (
                    <motion.div 
                        key={m.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel p-6 rounded-3xl"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                                {m.icon}
                            </div>
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black">{m.trend}</span>
                        </div>
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest">{m.label}</h3>
                        <p className="text-3xl font-black text-text-main mt-1">{m.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-6 rounded-3xl min-h-[400px] flex flex-col justify-center items-center">
                    <PieChart size={48} className="text-brand/20 mb-4" />
                    <h3 className="text-lg font-black text-text-main">Revenue Pipeline Chart</h3>
                    <p className="text-sm text-text-muted mt-2">D3.js integration pending for Phase 7 final polish.</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center items-center">
                    <h3 className="text-lg font-black text-text-main mb-6">Channel Mix</h3>
                    <div className="space-y-4 w-full">
                        {['Booking.com', 'Expedia', 'Direct'].map((ch, i) => (
                            <div key={ch}>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-text-main">{ch}</span>
                                    <span className="text-brand">{70 - (i*20)}%</span>
                                </div>
                                <div className="h-2 w-full bg-app-bg rounded-full overflow-hidden">
                                    <div className="h-full bg-brand rounded-full" style={{ width: `${70 - (i*20)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
