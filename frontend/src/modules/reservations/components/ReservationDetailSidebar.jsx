import { motion, AnimatePresence } from "motion/react"
import { X, CreditCard, User, History, Receipt } from "lucide-react"

export default function ReservationDetailSidebar({
    reservation,
    isOpen,
    onClose,
}) {
    if (!reservation) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed right-0 top-0 h-full w-full max-w-lg bg-sidebar-bg border-l border-border-subtle z-50 shadow-2xl flex flex-col transition-colors duration-300"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border-subtle flex justify-between items-center">
                            <div>
                                <span className="text-brand font-black text-xs tracking-widest">
                                    {reservation.id}
                                </span>
                                <h2 className="text-xl font-black text-text-main uppercase italic">
                                    {reservation.guest}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-app-bg rounded-xl text-text-muted"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Quick Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-app-bg p-4 rounded-2xl border border-border-subtle">
                                    <p className="text-[10px] font-bold text-text-muted uppercase">
                                        Check-in
                                    </p>
                                    <p className="font-bold text-text-main">
                                        {reservation.checkin}
                                    </p>
                                </div>
                                <div className="bg-app-bg p-4 rounded-2xl border border-border-subtle">
                                    <p className="text-[10px] font-bold text-text-muted uppercase">
                                        Status
                                    </p>
                                    <span className="text-xs font-black text-brand uppercase">
                                        {reservation.status}
                                    </span>
                                </div>
                            </div>

                            {/* Folio / Financial Cluster */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                                    <Receipt size={14} /> Folio Balance
                                </h3>
                                <div className="bg-card-bg border border-border-subtle rounded-2xl p-5 shadow-inner">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-text-secondary font-medium">
                                            Room Charges
                                        </span>
                                        <span className="text-text-main font-bold">
                                            $450.00
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-text-secondary font-medium">
                                            Food & Beverage
                                        </span>
                                        <span className="text-text-main font-bold">
                                            $85.00
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
                                        <span className="text-text-main font-black uppercase italic">
                                            Total Balance
                                        </span>
                                        <span className="text-xl font-black text-brand">
                                            $535.00
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Guest Profile Cluster */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                                    <User size={14} /> Guest Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <p className="text-text-secondary">
                                        <span className="font-bold text-text-main">
                                            Email:
                                        </span>{" "}
                                        guest@example.com
                                    </p>
                                    <p className="text-text-secondary">
                                        <span className="font-bold text-text-main">
                                            Phone:
                                        </span>{" "}
                                        +1 234 567 890
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-border-subtle bg-app-bg/50 grid grid-cols-2 gap-4">
                            <button className="py-4 rounded-2xl border border-border-subtle font-black text-xs uppercase hover:bg-card-bg transition-colors">
                                Print Invoice
                            </button>
                            <button className="py-4 rounded-2xl bg-brand text-white font-black text-xs uppercase hover:brightness-110 transition-all shadow-lg shadow-brand/20">
                                Settle Payment
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
