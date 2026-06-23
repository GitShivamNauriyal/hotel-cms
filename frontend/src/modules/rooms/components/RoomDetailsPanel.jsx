import { motion, AnimatePresence } from "motion/react"
import { X, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { api } from "../../../api"
import InvoicePrintView from "../../ledger/components/InvoicePrintView"
import SettlePaymentModal from "../../ledger/components/SettlePaymentModal"

export default function RoomDetailsPanel({ room, activeRes, isOpen, onClose, onStatusChange, userRole }) {
    const [editMode, setEditMode] = useState(false);
    const [statusDraft, setStatusDraft] = useState("");

    const [invoiceViewOpen, setInvoiceViewOpen] = useState(false);
    const [settleModalOpen, setSettleModalOpen] = useState(false);
    const [activeFolio, setActiveFolio] = useState(null);

    useEffect(() => {
        if (room) {
            setStatusDraft(room.status);
            setEditMode(false);
        }
    }, [room, isOpen]);

    // Staff can only manually transition to these states. Root can do any.
    const housekeepingStates = ["dirty", "clean", "inspected"];
    const allStates = ["available", "occupied", "dirty", "due-out", "maintenance"];

    const allowedStates = userRole === 'root' ? allStates : housekeepingStates;

    const handleSave = () => {
        if (statusDraft !== room.status) {
            onStatusChange(room.id, statusDraft);
        }
        setEditMode(false);
    }

    const handleOpenInvoice = async () => {
        if (!activeRes) return;
        try {
            const data = await api.getFolio(activeRes.id);
            setActiveFolio(data);
            setInvoiceViewOpen(true);
        } catch (error) {
            alert("No folio found or error fetching folio.");
        }
    }

    const handleOpenSettle = async () => {
        if (!activeRes) return;
        try {
            const data = await api.getFolio(activeRes.id);
            setActiveFolio(data);
            setSettleModalOpen(true);
        } catch (error) {
            alert("No folio found or error fetching folio.");
        }
    }

    return (
        <AnimatePresence>
            {isOpen && room && (
                <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 right-0 w-[400px] bg-card-bg border-l border-border-subtle shadow-2xl z-50 flex flex-col"
                >
                {/* Header */}
                <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-app-bg">
                    <div>
                        <h2 className="text-2xl font-black text-text-main">Room {room.room_number}</h2>
                        <p className="text-sm font-bold text-text-muted">{room.type}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-card-bg-hover rounded-full transition-colors text-text-muted">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Status Section */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Current Status</h3>
                            {userRole === 'root' && !editMode && (
                                <button onClick={() => setEditMode(true)} className="text-xs font-bold text-brand hover:underline">
                                    Override State
                                </button>
                            )}
                            {userRole !== 'root' && !editMode && housekeepingStates.includes(room.status) && (
                                <button onClick={() => setEditMode(true)} className="text-xs font-bold text-brand hover:underline">
                                    Update Status
                                </button>
                            )}
                        </div>
                        
                        {editMode ? (
                            <div className="flex gap-2">
                                <select 
                                    className="flex-1 bg-app-bg border border-border-subtle rounded-xl px-4 py-2 text-sm font-bold text-text-main outline-none focus:border-brand"
                                    value={statusDraft}
                                    onChange={(e) => setStatusDraft(e.target.value)}
                                >
                                    {allowedStates.map(s => (
                                        <option key={s} value={s}>{s.replace('-', ' ').toUpperCase()}</option>
                                    ))}
                                </select>
                                <button onClick={handleSave} className="bg-brand text-[var(--brand-text)] p-2 rounded-xl hover:bg-brand-hover">
                                    <Save size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className={`px-4 py-3 rounded-xl border font-bold text-sm uppercase tracking-wider
                                ${room.status === 'available' ? 'bg-status-success-bg border-status-success-text/20 text-status-success-text' : ''}
                                ${room.status === 'occupied' ? 'bg-status-info-bg border-status-info-text/20 text-status-info-text' : ''}
                                ${room.status === 'dirty' ? 'bg-status-error-bg border-status-error-text/20 text-status-error-text' : ''}
                                ${room.status === 'due-out' ? 'bg-status-warning-bg border-status-warning-text/20 text-status-warning-text' : ''}
                                ${room.status === 'maintenance' ? 'bg-card-bg-hover border-border-subtle text-text-muted' : ''}
                                ${room.status === 'clean' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : ''}
                                ${room.status === 'inspected' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : ''}
                            `}>
                                {room.status.replace('-', ' ')}
                            </div>
                        )}

                        {userRole !== 'root' && room.status === 'occupied' && (
                            <p className="text-xs text-text-muted font-medium mt-2">
                                Occupied rooms automatically transition to dirty upon guest check-out. Manual override requires Manager privileges.
                            </p>
                        )}
                    </div>

                    {/* Guest Information */}
                    {room.guest && activeRes && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex justify-between">
                                Active Guest
                                <span className="text-brand font-black">{activeRes.id.split('-')[0].toUpperCase()}</span>
                            </h3>
                            <div className="bg-app-bg p-4 rounded-2xl border border-border-subtle">
                                <p className="text-lg font-black text-text-main mb-4">{room.guest}</p>
                                
                                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border-subtle">
                                    <button onClick={handleOpenInvoice} className="py-2 rounded-xl bg-card-bg border border-border-subtle font-bold text-[10px] uppercase hover:bg-border-subtle transition-colors text-text-main">
                                        Print Invoice
                                    </button>
                                    <button onClick={handleOpenSettle} className="py-2 rounded-xl bg-brand/10 text-brand font-bold text-[10px] uppercase hover:bg-brand/20 transition-colors">
                                        Settle Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Room Specs */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Specifications</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-app-bg p-3 rounded-xl border border-border-subtle">
                                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Max Occ</p>
                                <p className="text-sm font-bold text-text-main">{room.max_occupancy || 'N/A'}</p>
                            </div>
                            <div className="bg-app-bg p-3 rounded-xl border border-border-subtle">
                                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Floor</p>
                                <p className="text-sm font-bold text-text-main">{room.floor || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                </motion.div>
            )}

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
                    // Could trigger sync if needed
                }}
            />
        </AnimatePresence>
    )
}
