import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Utensils, X } from "lucide-react"
import { api } from "../../../api"

import FoodManagementModal from "./FoodManagementModal"

export default function POSDashboard({ userRole, reservations = [], triggerSync }) {
    const [menuItems, setMenuItems] = useState([])
    const [cart, setCart] = useState([])
    const [selectedReservation, setSelectedReservation] = useState("")
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)

    const activeReservations = reservations.filter(r => r.status === "CHECKED_IN")

    const fetchMenu = async () => {
        try {
            const items = await api.getFoodItems()
            setMenuItems(items)
        } catch (error) {
            console.error("Failed to load menu", error)
        }
    }

    useEffect(() => {
        fetchMenu()
    }, [])

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id)
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
            }
            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(i => i.id !== id))
    }

    const total = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0)

    const handlePostOrder = async () => {
        if (!selectedReservation) return alert("Select an active reservation to charge.")
        if (cart.length === 0) return alert("Cart is empty.")
        
        try {
            const folio = await api.getFolio(selectedReservation)
            
            const itemsPayload = cart.map(item => ({
                food_item_id: item.id,
                quantity: item.quantity
            }))

            await api.createFoodOrder({
                reservation_id: selectedReservation,
                folio_id: folio.id,
                items: itemsPayload
            })

            setCart([])
            alert("Order posted successfully!")
            if (triggerSync) triggerSync()
        } catch (error) {
            alert("Failed to post order: " + error.message)
        }
    }

    return (
        <div className="flex gap-6 h-[600px]">
            {/* Left: Menu Items */}
            <div className="flex-1 glass-panel rounded-3xl p-6 flex flex-col relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-text-main">Menu Engine</h2>
                    {userRole === "root" && (
                        <button onClick={() => setIsMenuModalOpen(true)} className="px-4 py-2 bg-brand text-[var(--brand-text)] rounded-xl text-xs font-bold hover:bg-brand-hover">
                            Manage Menu
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-10">
                    {menuItems.map((item) => (
                        <motion.div 
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => addToCart(item)}
                            className="bg-app-bg p-4 rounded-2xl border border-border-subtle cursor-pointer hover:border-brand/30 transition-all flex flex-col items-center text-center gap-3 relative"
                        >
                            <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                                <Utensils size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-text-main leading-tight">{item.name}</h3>
                                <p className="text-xs text-brand font-black mt-1">${parseFloat(item.price).toFixed(2)}</p>
                            </div>
                        </motion.div>
                    ))}
                    {menuItems.length === 0 && (
                        <div className="col-span-full py-10 text-center text-text-muted">No menu items defined.</div>
                    )}
                </div>
            </div>

            {/* Right: Active Order Cart */}
            <div className="w-80 glass-panel rounded-3xl p-6 flex flex-col">
                <h2 className="text-lg font-black text-text-main mb-4 border-b border-border-subtle pb-4">Terminal</h2>
                
                <div className="mb-4 space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Charge To Room</label>
                    <select 
                        value={selectedReservation} 
                        onChange={e => setSelectedReservation(e.target.value)}
                        className="w-full bg-app-bg border border-border-subtle rounded-xl px-3 py-2 text-sm focus:border-brand outline-none text-text-main"
                    >
                        <option value="">Select In-House Guest...</option>
                        {activeReservations.map(r => (
                            <option key={r.id} value={r.id}>{r.room_number ? `Room ${r.room_number}` : 'No Room'} - {r.guest_name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 border-t border-border-subtle pt-4">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-app-bg p-3 rounded-xl border border-border-subtle">
                            <div>
                                <p className="text-sm font-bold text-text-main">{item.name}</p>
                                <p className="text-xs text-text-muted">{item.quantity} x ${parseFloat(item.price).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-brand">${(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
                                <button onClick={() => removeFromCart(item.id)} className="text-text-muted hover:text-red-500 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                            <Utensils size={32} className="mb-2 text-text-muted" />
                            <p className="text-sm font-bold text-text-muted">Tap items to add</p>
                        </div>
                    )}
                </div>

                <div className="border-t border-border-subtle pt-4 mt-auto space-y-4">
                    <div className="flex justify-between font-bold text-lg">
                        <span className="text-text-muted">Total</span>
                        <span className="text-brand font-black">${total.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handlePostOrder}
                        className="w-full py-4 bg-brand text-[var(--brand-text)] rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand/20 hover:brightness-110 active:scale-[0.98] transition-all"
                    >
                        Post to Folio
                    </button>
                </div>
            </div>

            <FoodManagementModal 
                isOpen={isMenuModalOpen}
                onClose={() => setIsMenuModalOpen(false)}
                triggerSync={fetchMenu}
                menuItems={menuItems}
            />
        </div>
    )
}
