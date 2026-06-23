import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Trash2, Edit2, Plus } from "lucide-react"
import { api } from "../../../api"

export default function FoodManagementModal({ isOpen, onClose, triggerSync, menuItems = [] }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "Breakfast",
        price: "",
        is_available: true
    })

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            category: "Breakfast",
            price: "",
            is_available: true
        })
        setIsEditing(false)
        setEditingId(null)
    }

    // Reset when modal opens/closes
    useEffect(() => {
        if (!isOpen) resetForm()
    }, [isOpen])

    const handleEditClick = (item) => {
        setFormData({
            name: item.name,
            description: item.description || "",
            category: item.category,
            price: item.price,
            is_available: item.is_available
        })
        setEditingId(item.id)
        setIsEditing(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this menu item?")) return
        try {
            await api.deleteFoodItem(id)
            if (triggerSync) triggerSync()
        } catch (error) {
            alert("Error deleting item: " + error.message)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingId) {
                await api.updateFoodItem(editingId, formData)
            } else {
                await api.createFoodItem(formData)
            }
            if (triggerSync) triggerSync()
            resetForm()
        } catch (error) {
            alert("Error saving item: " + error.message)
        }
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
                        className="fixed right-0 top-0 h-full w-full max-w-lg bg-sidebar-bg border-l border-border-subtle z-50 p-8 shadow-2xl overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black italic uppercase text-text-main tracking-tighter">
                                Menu Management
                            </h2>
                            <button onClick={onClose} className="p-2 text-text-muted hover:bg-app-bg rounded-full">
                                <X />
                            </button>
                        </div>

                        {/* Form Section */}
                        <div className="mb-8 bg-card-bg p-6 rounded-3xl border border-border-subtle shadow-inner">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-black text-brand uppercase tracking-widest">
                                    {isEditing ? "Edit Item" : "Create New Item"}
                                </h3>
                                {isEditing && (
                                    <button onClick={resetForm} className="text-[10px] font-bold uppercase text-text-muted hover:text-brand">
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Item Name</label>
                                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-app-bg border border-border-subtle p-3 rounded-xl text-sm focus:border-brand outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Description</label>
                                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-app-bg border border-border-subtle p-3 rounded-xl text-sm focus:border-brand outline-none min-h-[80px]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Price</label>
                                        <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-app-bg border border-border-subtle p-3 rounded-xl text-sm focus:border-brand outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Category</label>
                                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-app-bg border border-border-subtle p-3 rounded-xl text-sm focus:border-brand outline-none">
                                            <option value="Breakfast">Breakfast</option>
                                            <option value="Lunch">Lunch</option>
                                            <option value="Dinner">Dinner</option>
                                            <option value="Beverage">Beverage</option>
                                            <option value="Dessert">Dessert</option>
                                            <option value="General">General</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <input type="checkbox" id="is_available" checked={formData.is_available} onChange={e => setFormData({...formData, is_available: e.target.checked})} className="accent-brand w-4 h-4" />
                                    <label htmlFor="is_available" className="text-xs font-bold text-text-main cursor-pointer">Available for Order</label>
                                </div>

                                <button type="submit" className="w-full bg-brand text-[var(--brand-text)] py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand/20 hover:brightness-110 active:scale-[0.98] transition-all mt-4">
                                    {isEditing ? "Save Changes" : "Create Item"}
                                </button>
                            </form>
                        </div>

                        {/* Existing Items List */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-text-muted uppercase tracking-widest border-b border-border-subtle pb-2">
                                Existing Menu Items
                            </h3>
                            <div className="space-y-3">
                                {menuItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between bg-app-bg p-4 rounded-2xl border border-border-subtle hover:border-brand/30 transition-colors">
                                        <div>
                                            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
                                                {item.name}
                                                {!item.is_available && <span className="text-[9px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full uppercase tracking-widest">Out of Stock</span>}
                                            </h4>
                                            <p className="text-xs text-text-muted mt-1">{item.category} • <span className="text-brand font-black">${parseFloat(item.price).toFixed(2)}</span></p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditClick(item)} className="p-2 hover:bg-brand/10 text-brand rounded-xl transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {menuItems.length === 0 && (
                                    <p className="text-xs font-bold text-text-muted text-center py-4">No items defined.</p>
                                )}
                            </div>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
