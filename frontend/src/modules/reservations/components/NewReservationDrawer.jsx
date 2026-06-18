import { motion, AnimatePresence } from "motion/react"
import { X, User, Calendar, CreditCard, MapPin } from "lucide-react"

export default function NewReservationDrawer({
    isOpen,
    onClose,
    addReservation,
}) {
    const handleSubmit = (e) => {
        e.preventDefault()
        const fd = new FormData(e.target)

        addReservation({
            guest: fd.get("guest"),
            checkin: fd.get("checkin"),
            checkout: fd.get("checkout"),
            status: "Upcoming",
            source: fd.get("source") || "Direct",
            email: fd.get("email"),
            phone: fd.get("phone"),
        })
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed right-0 top-0 h-full w-full max-w-lg bg-sidebar-bg border-l border-border-subtle z-50 p-8 shadow-2xl overflow-y-auto transition-colors"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-black italic uppercase text-text-main tracking-tighter">
                                New Reservation
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-text-muted hover:bg-app-bg rounded-full"
                            >
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <section className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black text-brand uppercase tracking-[0.2em]">
                                    <User size={14} /> Guest Identity
                                </label>
                                <input
                                    name="guest"
                                    required
                                    placeholder="Full Legal Name"
                                    className="w-full bg-app-bg border border-border-subtle p-4 rounded-2xl text-text-main focus:border-brand outline-none"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        className="bg-app-bg border border-border-subtle p-4 rounded-2xl text-text-main focus:border-brand outline-none"
                                    />
                                    <input
                                        name="phone"
                                        placeholder="Phone Number"
                                        className="bg-app-bg border border-border-subtle p-4 rounded-2xl text-text-main focus:border-brand outline-none"
                                    />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black text-brand uppercase tracking-[0.2em]">
                                    <Calendar size={14} /> Stay Configuration
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-text-muted ml-2">
                                            CHECK-IN
                                        </span>
                                        <input
                                            name="checkin"
                                            type="date"
                                            required
                                            className="w-full bg-app-bg border border-border-subtle p-4 rounded-2xl text-text-main focus:border-brand outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-text-muted ml-2">
                                            CHECK-OUT
                                        </span>
                                        <input
                                            name="checkout"
                                            type="date"
                                            required
                                            className="w-full bg-app-bg border border-border-subtle p-4 rounded-2xl text-text-main focus:border-brand outline-none"
                                        />
                                    </div>
                                </div>
                            </section>

                            <button
                                type="submit"
                                className="w-full bg-brand text-app-bg py-5 rounded-2xl font-black shadow-xl shadow-brand/30 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest"
                            >
                                Finalize & Create Folio
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
