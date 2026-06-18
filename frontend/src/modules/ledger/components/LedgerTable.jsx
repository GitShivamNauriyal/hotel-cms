import { motion } from "motion/react"
import { Waves } from "lucide-react"

export default function LedgerTable() {
    return (
        <div className="glass-panel p-8 rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-6 text-brand">
                <Waves size={32} />
            </div>
            <h2 className="text-xl font-bold text-text-main mb-2">
                Immutable Ledgers
            </h2>
            <p className="text-sm font-semibold text-text-muted max-w-md">
                Phase 4 will establish the double-entry accounting ledger here.
            </p>
        </div>
    )
}
