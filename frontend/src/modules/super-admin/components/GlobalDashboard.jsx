import { motion } from "motion/react"
import { Globe, Building2, Users } from "lucide-react"

export default function GlobalDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-muted">Total Hotels</p>
                        <p className="text-2xl font-black text-text-main">14</p>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-muted">Active Users</p>
                        <p className="text-2xl font-black text-text-main">1,204</p>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                        <Globe size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-muted">System Status</p>
                        <p className="text-2xl font-black text-status-available-text">Online</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl min-h-[400px] flex flex-col">
                <h2 className="text-xl font-bold text-text-main mb-6">Organizations (Tenants)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-subtle">
                                <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Hotel Name</th>
                                <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Subdomain</th>
                                <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Status</th>
                                <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mock Data */}
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="border-b border-border-subtle/50 hover:bg-card-bg/40 transition-colors">
                                    <td className="py-4 px-4 font-bold text-text-main">Grand Plaza Hotel {i}</td>
                                    <td className="py-4 px-4 text-text-secondary">grandplaza{i}.hotelcms.com</td>
                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-status-available-bg text-status-available-text">
                                            ACTIVE
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="text-sm font-bold text-brand hover:underline">Assume Tenant</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
