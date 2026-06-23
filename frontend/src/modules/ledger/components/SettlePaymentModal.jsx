import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { CreditCard } from "lucide-react"
import { api } from "../../../api"

export default function SettlePaymentModal({ isOpen, onClose, folio, onSuccess }) {
    const [paymentAmount, setPaymentAmount] = useState(folio ? folio.balance : "")
    const [paymentMethod, setPaymentMethod] = useState("Credit Card")
    const [checkOutGuest, setCheckOutGuest] = useState(false)

    // Sync state when folio changes
    useState(() => {
        if (folio) {
            setPaymentAmount(folio.balance);
            setPaymentMethod("Credit Card");
            setCheckOutGuest(false);
        }
    }, [folio])

    const handleSettleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.addLedgerEntry(folio.id, {
                type: 'PAYMENT',
                amount: parseFloat(paymentAmount),
                description: `Payment - ${paymentMethod}`,
                checkOutGuest
            });
            if (onSuccess) onSuccess();
            onClose();
        } catch(error) {
            alert(error.message);
        }
    }

    if (!isOpen || !folio) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md bg-app-bg border border-border-subtle rounded-3xl p-6 shadow-2xl"
            >
                <h2 className="text-xl font-black text-text-main mb-6 flex items-center gap-2">
                    <CreditCard className="text-brand" /> Settle Folio {folio.id.split('-')[0]}
                </h2>

                <form onSubmit={handleSettleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Balance Due</label>
                        <div className="text-2xl font-black text-brand">${Math.max(0, folio.balance).toFixed(2)}</div>
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
                            onClick={onClose} 
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
    )
}
