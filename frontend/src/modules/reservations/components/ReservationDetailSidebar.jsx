import { motion, AnimatePresence } from "motion/react"
import { X, CreditCard, User, History, Receipt, Trash2 } from "lucide-react"
import { api } from "../../../api"
import { useState, useEffect } from "react"
import InvoicePrintView from "../../ledger/components/InvoicePrintView"
import SettlePaymentModal from "../../ledger/components/SettlePaymentModal"

export default function ReservationDetailSidebar({
    reservation,
    isOpen,
    onClose,
    userRole,
    triggerSync
}) {
    const [invoiceViewOpen, setInvoiceViewOpen] = useState(false)
    const [settleModalOpen, setSettleModalOpen] = useState(false)
    const [activeFolio, setActiveFolio] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        check_in_date: '',
        check_out_date: ''
    })

    // Reset edit form when reservation changes

    useEffect(() => {
        if (reservation) {
            setEditForm({
                guest_name: reservation.guest_name || reservation.guest || '',
                guest_email: reservation.guest_email || '',
                guest_phone: reservation.guest_phone || '',
                check_in_date: reservation.check_in_date ? new Date(reservation.check_in_date).toISOString().split('T')[0] : '',
                check_out_date: reservation.check_out_date ? new Date(reservation.check_out_date).toISOString().split('T')[0] : ''
            })
            setIsEditing(false)
        }
    }, [reservation])

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.updateReservationDetails(reservation.id, editForm)
            if (triggerSync) triggerSync()
            setIsEditing(false)
        } catch (error) {
            alert(error.message)
        }
    }


    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to cancel this reservation? It will be moved to the Cancelled tab.")) return;
        try {
            await api.updateReservationStatus(reservation.id, "CANCELLED");
            if (triggerSync) triggerSync();
            onClose();
        } catch (error) {
            alert(error.message);
        }
    }

    const handleOpenInvoice = async () => {
        try {
            const data = await api.getFolio(reservation.id);
            setActiveFolio(data);
            setInvoiceViewOpen(true);
        } catch (error) {
            alert("No folio found or error fetching folio.");
        }
    }

    const handleOpenSettle = async () => {
        try {
            const data = await api.getFolio(reservation.id);
            setActiveFolio(data);
            setSettleModalOpen(true);
        } catch (error) {
            alert("No folio found or error fetching folio.");
        }
    }

    const nights = Math.max(1, Math.ceil((new Date(reservation.check_out_date) - new Date(reservation.check_in_date)) / (1000 * 60 * 60 * 24)));
    const roomCharges = nights * (parseFloat(reservation.base_price_per_night) || 0);
    const ledgerBalance = parseFloat(reservation.ledger_balance) || 0;
    const totalBalance = roomCharges + ledgerBalance;

    return (
        <AnimatePresence>
            {isOpen && reservation && (
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
                                    {reservation.id.split('-')[0].toUpperCase()}
                                </span>
                                <h2 className="text-xl font-black text-text-main uppercase italic">
                                    {reservation.guest_name || reservation.guest || 'Unknown Guest'}
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                {userRole === 'root' && (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="p-2 hover:bg-brand/10 text-brand rounded-xl transition-colors font-bold text-xs"
                                        >
                                            {isEditing ? 'CANCEL' : 'EDIT'}
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"
                                            title="Delete Reservation"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-app-bg rounded-xl text-text-muted transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Quick Info Grid */}
                            {isEditing ? (
                                <form onSubmit={handleEditSubmit} className="bg-card-bg p-5 rounded-2xl border border-border-subtle shadow-inner space-y-4">
                                    <h3 className="text-xs font-black text-brand uppercase mb-2">Edit Reservation Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-text-muted uppercase">Check-in</label>
                                            <input type="date" value={editForm.check_in_date} onChange={e => setEditForm({...editForm, check_in_date: e.target.value})} className="w-full bg-app-bg border border-border-subtle p-2 rounded-xl text-sm outline-none focus:border-brand" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-text-muted uppercase">Check-out</label>
                                            <input type="date" value={editForm.check_out_date} onChange={e => setEditForm({...editForm, check_out_date: e.target.value})} className="w-full bg-app-bg border border-border-subtle p-2 rounded-xl text-sm outline-none focus:border-brand" />
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <label className="text-[10px] font-bold text-text-muted uppercase">Guest Name</label>
                                            <input type="text" value={editForm.guest_name} onChange={e => setEditForm({...editForm, guest_name: e.target.value})} className="w-full bg-app-bg border border-border-subtle p-2 rounded-xl text-sm outline-none focus:border-brand" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-text-muted uppercase">Email</label>
                                            <input type="email" value={editForm.guest_email} onChange={e => setEditForm({...editForm, guest_email: e.target.value})} className="w-full bg-app-bg border border-border-subtle p-2 rounded-xl text-sm outline-none focus:border-brand" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-text-muted uppercase">Phone</label>
                                            <input type="text" value={editForm.guest_phone} onChange={e => setEditForm({...editForm, guest_phone: e.target.value})} className="w-full bg-app-bg border border-border-subtle p-2 rounded-xl text-sm outline-none focus:border-brand" />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-brand text-[var(--brand-text)] py-3 rounded-xl font-black shadow-lg shadow-brand/20 mt-4 uppercase text-xs">
                                        Save Changes
                                    </button>
                                </form>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-app-bg p-4 rounded-2xl border border-border-subtle">
                                        <p className="text-[10px] font-bold text-text-muted uppercase">
                                            Check-in
                                        </p>
                                        <p className="font-bold text-text-main">
                                            {new Date(reservation.check_in_date || reservation.checkin).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="bg-app-bg p-4 rounded-2xl border border-border-subtle">
                                        <p className="text-[10px] font-bold text-text-muted uppercase">
                                            Check-out
                                        </p>
                                        <p className="font-bold text-text-main">
                                            {new Date(reservation.check_out_date || reservation.checkout).toLocaleDateString()}
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
                                    <div className="bg-app-bg p-4 rounded-2xl border border-border-subtle">
                                        <p className="text-[10px] font-bold text-text-muted uppercase">
                                            Room / Type
                                        </p>
                                        <span className="text-xs font-black text-text-main uppercase">
                                            {reservation.room_number ? `Rm ${reservation.room_number}` : (reservation.room_type_name || 'N/A')}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Folio / Financial Cluster */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                                    <Receipt size={14} /> Folio Balance
                                </h3>
                                <div className="bg-card-bg border border-border-subtle rounded-2xl p-5 shadow-inner">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-text-secondary font-medium">
                                            Room Charges ({nights} {nights === 1 ? 'Night' : 'Nights'})
                                        </span>
                                        <span className="text-text-main font-bold">
                                            ${roomCharges.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-text-secondary font-medium">
                                            Other Ledger Balance
                                        </span>
                                        <span className="text-text-main font-bold">
                                            ${ledgerBalance.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
                                        <span className="text-text-main font-black uppercase italic">
                                            Total Balance
                                        </span>
                                        <span className="text-xl font-black text-brand">
                                            ${totalBalance.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Guest Profile Cluster */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                                    <User size={14} /> Guest Details
                                </h3>
                                <div className="space-y-2 text-sm bg-card-bg border border-border-subtle rounded-2xl p-5 shadow-inner">
                                    <p className="text-text-secondary flex justify-between">
                                        <span className="font-bold text-text-main">Email:</span>
                                        <span className="text-text-main">{reservation.guest_email || 'Not provided'}</span>
                                    </p>
                                    <p className="text-text-secondary flex justify-between">
                                        <span className="font-bold text-text-main">Phone:</span>
                                        <span className="text-text-main">{reservation.guest_phone || 'Not provided'}</span>
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-border-subtle bg-app-bg/50 grid grid-cols-2 gap-4">
                            <button onClick={handleOpenInvoice} className="py-4 rounded-2xl border border-border-subtle font-black text-xs uppercase hover:bg-card-bg transition-colors text-text-main">
                                Print Invoice
                            </button>
                            <button onClick={handleOpenSettle} className="py-4 rounded-2xl bg-brand text-[var(--brand-text)] font-black text-xs uppercase hover:brightness-110 transition-all shadow-lg shadow-brand/20">
                                Settle Payment
                            </button>
                        </div>
                    </motion.div>

                    {invoiceViewOpen && activeFolio && (
                        <InvoicePrintView 
                            folio={activeFolio} 
                            onClose={() => setInvoiceViewOpen(false)} 
                        />
                    )}

                    <SettlePaymentModal 
                        isOpen={settleModalOpen}
                        onClose={() => setSettleModalOpen(false)}
                        folio={activeFolio}
                        onSuccess={() => {
                            if (triggerSync) triggerSync();
                        }}
                    />
                </>
            )}
        </AnimatePresence>
    )
}
