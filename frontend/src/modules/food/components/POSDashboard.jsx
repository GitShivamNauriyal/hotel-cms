import { motion } from "motion/react"
import { Utensils, Coffee, Wine, Plus } from "lucide-react"

const MENU_ITEMS = [
    { id: 1, name: "Avocado Toast", price: 14, icon: <Utensils size={20}/>, category: "Breakfast" },
    { id: 2, name: "Espresso", price: 5, icon: <Coffee size={20}/>, category: "Beverage" },
    { id: 3, name: "Club Sandwich", price: 18, icon: <Utensils size={20}/>, category: "Lunch" },
    { id: 4, name: "House Red Wine", price: 12, icon: <Wine size={20}/>, category: "Dinner" },
]

export default function POSDashboard() {
    return (
        <div className="flex gap-6 h-[600px]">
            <div className="flex-1 glass-panel rounded-3xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-text-main">Menu</h2>
                    <div className="flex gap-2">
                        {["All", "Breakfast", "Lunch", "Dinner"].map(cat => (
                            <button key={cat} className="px-4 py-2 rounded-xl text-xs font-bold bg-app-bg border border-border-subtle hover:text-brand transition-colors">
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                    {MENU_ITEMS.map((item, i) => (
                        <motion.div 
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-app-bg p-4 rounded-2xl border border-border-subtle cursor-pointer hover:border-brand/30 transition-all flex flex-col items-center text-center gap-3"
                        >
                            <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-text-main">{item.name}</h3>
                                <p className="text-xs text-brand font-black mt-1">${item.price.toFixed(2)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="w-80 glass-panel rounded-3xl p-6 flex flex-col">
                <h2 className="text-lg font-black text-text-main mb-4 border-b border-border-subtle pb-4">Current Order</h2>
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                    <Utensils size={32} className="mb-2 text-text-muted" />
                    <p className="text-sm font-bold text-text-muted">Tap items to add</p>
                </div>
                <div className="border-t border-border-subtle pt-4 mt-auto">
                    <div className="flex justify-between font-bold text-sm mb-4">
                        <span className="text-text-muted">Total</span>
                        <span className="text-text-main">$0.00</span>
                    </div>
                    <button className="w-full py-4 bg-brand text-app-bg rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand/20 hover:brightness-110 active:scale-95 transition-all">
                        Post to Folio
                    </button>
                </div>
            </div>
        </div>
    )
}
