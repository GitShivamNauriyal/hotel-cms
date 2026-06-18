import { motion } from "motion/react"
import { Share2, Globe, Activity, Settings2, RefreshCw } from "lucide-react"

const CHANNELS = [
    { name: "Booking.com", active: true, sync: "2 mins ago", share: "45%" },
    { name: "Expedia", active: true, sync: "5 mins ago", share: "30%" },
    { name: "Airbnb", active: false, sync: "Paused", share: "0%" },
    { name: "Agoda", active: true, sync: "1 min ago", share: "20%" },
    { name: "Direct", active: true, sync: "Real-time", share: "5%" },
]

export default function OTAGrid() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card-bg p-4 rounded-3xl border border-border-subtle shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-text-main">Master Sync Status</h2>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">All Systems Operational</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-app-bg border border-border-subtle rounded-xl text-xs font-bold hover:text-brand transition-colors">
                    <RefreshCw size={14} /> Force Sync
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {CHANNELS.map((channel, i) => (
                    <motion.div
                        key={channel.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel p-6 rounded-3xl relative overflow-hidden group hover:border-brand/30 transition-all"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-app-bg flex items-center justify-center shadow-sm border border-border-subtle">
                                <Globe size={20} className={channel.active ? "text-brand" : "text-text-muted"} />
                            </div>
                            <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${channel.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {channel.active ? 'Live' : 'Paused'}
                            </div>
                        </div>

                        <h3 className="text-lg font-black text-text-main tracking-tight">{channel.name}</h3>
                        
                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-text-muted">Last Sync</span>
                                <span className="font-semibold text-text-main">{channel.sync}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-text-muted">Revenue Share</span>
                                <span className="font-semibold text-text-main">{channel.share}</span>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-3 bg-app-bg border border-border-subtle rounded-xl text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-brand hover:border-brand/30 transition-all">
                            Configure Map
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
