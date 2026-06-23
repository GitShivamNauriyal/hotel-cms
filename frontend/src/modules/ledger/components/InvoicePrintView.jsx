import { useEffect } from "react"
import { motion } from "motion/react"
import { Printer, X } from "lucide-react"

export default function InvoicePrintView({ folio, onClose, hotelName = "Grand Continental Hotel" }) {
    useEffect(() => {
        // Add a class to body to handle print styles if needed
        document.body.classList.add("print-mode")
        return () => document.body.classList.remove("print-mode")
    }, [])

    const handlePrint = () => {
        window.print()
    }

    if (!folio) return null

    const balance = parseFloat(folio.balance) || 0;
    
    return (
        <div className="fixed inset-0 z-[100] bg-app-bg overflow-y-auto flex justify-center">
            {/* Non-printable controls */}
            <div className="fixed top-6 right-6 flex gap-4 print:hidden">
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 bg-brand text-[var(--brand-text)] font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
                >
                    <Printer size={16} /> Print / Save PDF
                </button>
                <button 
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-3 bg-card-bg border border-border-subtle text-text-main font-bold rounded-2xl hover:bg-border-subtle transition-colors"
                >
                    <X size={16} /> Close
                </button>
            </div>

            {/* Printable Invoice Container */}
            <div className="printable-invoice w-full max-w-[800px] bg-white text-black min-h-screen p-12 shadow-2xl print:shadow-none print:p-0 my-12 print:my-0">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-gray-200 pb-8 mb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">{hotelName}</h1>
                        <p className="text-sm text-gray-500 font-medium mt-1">123 Luxury Avenue, Metropolis, NY 10001</p>
                        <p className="text-sm text-gray-500 font-medium">Phone: +1 (555) 123-4567 • Email: billing@hotelcms.com</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-light text-gray-400 uppercase tracking-widest mb-2">Invoice</h2>
                        <div className="text-sm font-bold text-gray-800">Folio No: <span className="font-mono text-gray-600">F-{folio.id.split('-')[0].toUpperCase()}</span></div>
                        <div className="text-sm font-bold text-gray-800">Date: <span className="font-mono text-gray-600">{new Date().toLocaleDateString()}</span></div>
                    </div>
                </div>

                {/* Guest Details */}
                <div className="mb-10 p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Billed To</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-bold text-gray-500">Reservation ID</p>
                            <p className="text-lg font-black text-gray-800 font-mono tracking-tight">{folio.reservation_id.split('-')[0].toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-500">Status</p>
                            <p className={`text-sm font-black uppercase tracking-widest ${folio.status === 'SETTLED' ? 'text-emerald-600' : 'text-yellow-600'}`}>
                                {folio.status}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <table className="w-full text-left mb-10 border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-3 text-xs font-black uppercase tracking-widest text-gray-400">Date</th>
                            <th className="py-3 text-xs font-black uppercase tracking-widest text-gray-400">Description</th>
                            <th className="py-3 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {folio.entries && folio.entries.map((entry, idx) => (
                            <tr key={idx} className="border-b border-gray-100">
                                <td className="py-4 font-mono text-gray-500">{new Date(entry.created_at || Date.now()).toLocaleDateString()}</td>
                                <td className="py-4 font-bold text-gray-800">
                                    {entry.description || (entry.type === 'CHARGE' ? 'Room Charge' : 'Payment')}
                                </td>
                                <td className="py-4 text-right font-mono font-bold">
                                    {entry.type === 'CHARGE' ? '' : '-'} ${parseFloat(entry.amount || entry.total || 0).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        {(!folio.entries || folio.entries.length === 0) && (
                            <tr>
                                <td colSpan="3" className="py-8 text-center text-gray-400 font-bold italic">No entries found for this folio.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-1/2 bg-gray-50 p-6 rounded-xl space-y-3">
                        <div className="flex justify-between text-sm font-bold text-gray-600">
                            <span>Total Charges</span>
                            <span className="font-mono">
                                ${folio.summary ? folio.summary.filter(e => e.type === 'CHARGE').reduce((acc, curr) => acc + parseFloat(curr.amount || curr.total), 0).toFixed(2) : "0.00"}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-gray-600">
                            <span>Total Payments</span>
                            <span className="font-mono text-emerald-600">
                                -${folio.summary ? folio.summary.filter(e => e.type === 'PAYMENT').reduce((acc, curr) => acc + parseFloat(curr.amount || curr.total), 0).toFixed(2) : "0.00"}
                            </span>
                        </div>
                        <div className="border-t-2 border-gray-200 pt-3 flex justify-between items-center">
                            <span className="text-sm font-black uppercase tracking-widest text-gray-800">Balance Due</span>
                            <span className={`text-2xl font-black font-mono tracking-tight ${balance <= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                ${Math.max(0, balance).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-20 pt-8 border-t border-gray-200 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <p>Thank you for choosing {hotelName}</p>
                    <p className="mt-1 opacity-70">Generated electronically by Antigravity PMS</p>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body > *:not(.printable-invoice-container) {
                        display: none !important;
                    }
                    .printable-invoice-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:p-0 {
                        padding: 0 !important;
                    }
                    .print\\:my-0 {
                        margin: 0 !important;
                    }
                }
            `}} />
        </div>
    )
}
