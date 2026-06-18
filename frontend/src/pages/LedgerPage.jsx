import LedgerTable from "../modules/ledger/components/LedgerTable"

export default function LedgerPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-text-main tracking-[-0.02em]">
                    Financial Ledger
                </h1>
            </div>
            <LedgerTable />
        </div>
    )
}
