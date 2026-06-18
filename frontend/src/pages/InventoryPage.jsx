import AssetGrid from "../modules/inventory/components/AssetGrid"

export default function InventoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-text-main tracking-[-0.02em]">
                    Inventory Management
                </h1>
            </div>
            <AssetGrid />
        </div>
    )
}
