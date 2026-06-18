import AssetGrid from "../modules/inventory/components/AssetGrid"

export default function InventoryPage({ userRole }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-text-main tracking-[-0.02em]">
                    Inventory Management
                </h1>
                {userRole === "root" && (
                    <button className="px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand/90 transition-colors shadow-md">
                        + Add Configuration
                    </button>
                )}
            </div>
            <AssetGrid />
        </div>
    )
}
