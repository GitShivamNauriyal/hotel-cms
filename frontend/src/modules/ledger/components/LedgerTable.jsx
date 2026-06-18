import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { DollarSign, Search, ArrowUpRight, ArrowDownRight, FileText } from "lucide-react"
import { api } from "../../../api"

export default function LedgerTable() {
    const [searchTerm, setSearchTerm] = useState("")
    const [ledger, setLedger] = useState([])

    useEffect(() => {
        api.getLedger()
           .then(data => setLedger(data))
           .catch(err => console.error(err))
    }, [])

    const filtered = ledger.filter(l => 
        l.folio_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalCharges = ledger.filter(l => l.type === 'CHARGE').reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
    const totalPayments = ledger.filter(l => l.type === 'PAYMENT').reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

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
                    <span><span className="text-red-500">↑</span> ${totalCharges.toFixed(2)} Charges</span>
                    <span><span className="text-emerald-500">↓</span> ${totalPayments.toFixed(2)} Payments</span>
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
                                <td className="p-4 font-bold text-text-main text-xs">{entry.id.split('-')[0]}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-brand/10 text-brand rounded-lg text-xs font-bold border border-brand/20">
                                        F-{entry.folio_id.split('-')[0]}
                                    </span>
                                </td>
                                <td className="p-4 text-xs font-semibold text-text-muted">{new Date(entry.created_at).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-text-muted" />
                                        <span className="text-sm font-semibold text-text-main">{entry.description}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className={`inline-flex items-center gap-1 font-black ${entry.type === 'CHARGE' ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {entry.type === 'CHARGE' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        ${parseFloat(entry.amount).toFixed(2)}
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`text-[10px] font-bold tracking-widest uppercase ${entry.folio_status === 'SETTLED' ? 'text-emerald-500' : 'text-yellow-500'}`}>
                                        {entry.folio_status}
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
