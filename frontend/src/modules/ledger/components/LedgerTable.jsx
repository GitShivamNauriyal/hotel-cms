import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { DollarSign, Search, ArrowUpRight, ArrowDownRight, FileText, CreditCard, Printer } from "lucide-react"
import { api } from "../../../api"
import InvoicePrintView from "./InvoicePrintView"

export default function LedgerTable() {
    const [searchTerm, setSearchTerm] = useState("")
    const [ledger, setLedger] = useState([])
    const [settleModalOpen, setSettleModalOpen] = useState(false)
    const [invoiceViewOpen, setInvoiceViewOpen] = useState(false)
    const [activeFolio, setActiveFolio] = useState(null)
    const [paymentAmount, setPaymentAmount] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("Credit Card")
    const [checkOutGuest, setCheckOutGuest] = useState(false)

    const fetchLedger = () => {
        api.getLedger()
           .then(data => setLedger(data))
           .catch(err => console.error(err))
    }

    useEffect(() => {
        fetchLedger()
    }, [])

    const openSettleModal = async (folioId) => {
        try {
            // First we need the reservation ID... wait, api.getFolio requires reservationId?
            // Actually getFolio is by reservationId in finance.js: /folios/:reservationId
            // But we only have folio_id here. 
            // Wait, we modified getLedger to return reservation_id in finance.js!
            // Let's use it.
            const folioEntry = ledger.find(l => l.folio_id === folioId);
            if (!folioEntry || !folioEntry.reservation_id) return;

            const data = await api.getFolio(folioEntry.reservation_id);
            setActiveFolio(data);
            setPaymentAmount(data.balance);
            setCheckOutGuest(false);
            setPaymentMethod("Credit Card");
            setSettleModalOpen(true);
        } catch(error) {
            alert(error.message);
        }
    }

    const openInvoiceView = async (folioId) => {
        try {
            const folioEntry = ledger.find(l => l.folio_id === folioId);
            if (!folioEntry || !folioEntry.reservation_id) return;
            const data = await api.getFolio(folioEntry.reservation_id);
            setActiveFolio(data);
            setInvoiceViewOpen(true);
        } catch(error) {
            alert(error.message);
        }
    }

    const handleSettleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.addLedgerEntry(activeFolio.id, {
                type: 'PAYMENT',
                amount: parseFloat(paymentAmount),
                description: `Payment - ${paymentMethod}`,
                checkOutGuest
            });
            setSettleModalOpen(false);
            fetchLedger();
        } catch(error) {
            alert(error.message);
        }
    }

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
                            <th className="p-4 text-right">Actions</th>
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
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => openInvoiceView(entry.folio_id)}
                                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1"
                                            title="Print Invoice"
                                        >
                                            <Printer size={14} /> Print
                                        </button>
                                        {entry.folio_status !== 'SETTLED' && (
                                            <button 
                                                onClick={() => openSettleModal(entry.folio_id)}
                                                className="px-3 py-1 bg-brand/10 text-brand rounded-lg text-xs font-bold hover:bg-brand/20 transition-colors"
                                            >
                                                Settle
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="p-10 text-center text-text-muted font-bold">No entries found.</div>
                )}
            </div>

            <AnimatePresence>
                {settleModalOpen && activeFolio && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md bg-app-bg border border-border-subtle rounded-3xl p-6 shadow-2xl"
                        >
                            <h2 className="text-xl font-black text-text-main mb-6 flex items-center gap-2">
                                <CreditCard className="text-brand" /> Settle Folio {activeFolio.id.split('-')[0]}
                            </h2>

                            <form onSubmit={handleSettleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Balance Due</label>
                                    <div className="text-2xl font-black text-brand">${activeFolio.balance}</div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Payment Method</label>
                                        <select 
                                            value={paymentMethod}
                                            onChange={e => setPaymentMethod(e.target.value)}
                                            className="w-full bg-card-bg border border-border-subtle rounded-xl px-4 py-3 text-sm font-bold focus:border-brand outline-none"
                                        >
                                            <option>Credit Card</option>
                                            <option>Cash</option>
                                            <option>Bank Transfer</option>
                                            <option>OTA Virtual Card</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Payment Amount</label>
                                        <input 
                                            type="number" 
                                            step="0.01" 
                                            required 
                                            value={paymentAmount} 
                                            onChange={e => setPaymentAmount(e.target.value)} 
                                            className="w-full bg-card-bg border border-border-subtle rounded-xl px-4 py-3 text-lg font-bold focus:border-brand outline-none" 
                                        />
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 p-3 bg-card-bg rounded-xl border border-border-subtle cursor-pointer hover:border-brand/50 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={checkOutGuest} 
                                        onChange={e => setCheckOutGuest(e.target.checked)} 
                                        className="w-5 h-5 accent-brand"
                                    />
                                    <div>
                                        <div className="text-sm font-bold text-text-main">Check Out Guest</div>
                                        <div className="text-xs text-text-muted">Automatically change reservation & room status</div>
                                    </div>
                                </label>

                                <div className="flex gap-4 mt-6 pt-6 border-t border-border-subtle">
                                    <button 
                                        type="button" 
                                        onClick={() => setSettleModalOpen(false)} 
                                        className="flex-1 px-4 py-3 bg-card-bg text-text-main rounded-xl font-bold hover:bg-border-subtle transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 px-4 py-3 bg-brand text-[var(--brand-text)] rounded-xl font-bold shadow-lg shadow-brand/20 hover:brightness-110 active:scale-[0.98] transition-all"
                                    >
                                        Process Payment
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {invoiceViewOpen && activeFolio && (
                <InvoicePrintView 
                    folio={activeFolio} 
                    onClose={() => setInvoiceViewOpen(false)} 
                />
            )}
        </div>
    )
}
