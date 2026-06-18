import { motion } from "motion/react"
import { Package } from "lucide-react"

export default function AssetGrid() {
    return (
        <div className="glass-panel p-8 rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-6 text-brand">
                <Package size={32} />
            </div>
            <h2 className="text-xl font-bold text-text-main mb-2">
                Room & Asset Inventory
            </h2>
            <p className="text-sm font-semibold text-text-muted max-w-md">
                Housekeeping and maintenance stock management will appear here.
            </p>
        </div>
    )
}
