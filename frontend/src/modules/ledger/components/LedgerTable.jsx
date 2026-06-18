import { useState } from "react"
import { motion } from "motion/react"
import { DollarSign, Search, ArrowUpRight, ArrowDownRight, FileText } from "lucide-react"

const MOCK_LEDGER = [
    { id: "L-001", folio: "F-9021", type: "CHARGE", amount: 150.00, desc: "Room Rate - Night 1", date: "2026-06-18", status: "POSTED" },
    { id: "L-002", folio: "F-9021", type: "CHARGE", amount: 45.00, desc: "Room Service - Breakfast", date: "2026-06-19", status: "POSTED" },
    { id: "L-003", folio: "F-9021", type: "PAYMENT", amount: 195.00, desc: "Visa ending in 4242", date: "2026-06-19", status: "SETTLED" },
    { id: "L-004", folio: "F-8810", type: "CHARGE", amount: 300.00, desc: "Room Rate - Night 1 & 2", date: "2026-06-18", status: "POSTED" },
]

export default function LedgerTable() {
    const [searchTerm, setSearchTerm] = useState("")

    const filtered = MOCK_LEDGER.filter(l => 
        l.folio.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card-bg p-4 rounded-3xl border border-border-subtle shadow-sm">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by folio or description..."
                        className="w-full pl-11 pr-4 py-3 bg-app-bg border border-border-subtle rounded-2xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                    />
                </div>
                <div className="text-sm font-bold text-text-muted bg-app-bg px-4 py-3 rounded-2xl border border-border-subtle flex gap-4">
                    <span><span className="text-red-500">↑</span> $495.00 Charges</span>
                    <span><span className="text-emerald-500">↓</span> $195.00 Payments</span>
                </div>
            </div>

            <div className="glass-panel rounded-3xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border-subtle bg-sidebar-bg/50 text-[10px] uppercase tracking-widest text-text-muted font-black">
                            <th className="p-4">Entry ID</th>
                            <th className="p-4">Folio</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Description</th>
                            <th className="p-4 text-right">Amount</th>
                            <th className="p-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((entry, idx) => (
                            <motion.tr 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={entry.id} 
                                className="border-b border-border-subtle/50 hover:bg-card-bg transition-colors"
                            >
                                <td className="p-4 font-bold text-text-main text-xs">{entry.id}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-brand/10 text-brand rounded-lg text-xs font-bold border border-brand/20">
                                        {entry.folio}
                                    </span>
                                </td>
                                <td className="p-4 text-xs font-semibold text-text-muted">{entry.date}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-text-muted" />
                                        <span className="text-sm font-semibold text-text-main">{entry.desc}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className={`inline-flex items-center gap-1 font-black ${entry.type === 'CHARGE' ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {entry.type === 'CHARGE' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        ${entry.amount.toFixed(2)}
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`text-[10px] font-bold tracking-widest uppercase ${entry.status === 'SETTLED' ? 'text-emerald-500' : 'text-yellow-500'}`}>
                                        {entry.status}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="p-10 text-center text-text-muted font-bold">No entries found.</div>
                )}
            </div>
        </div>
    )
}
