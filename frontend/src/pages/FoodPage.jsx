import POSDashboard from "../modules/food/components/POSDashboard"

export default function FoodPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-text-main tracking-[-0.02em]">
                    Food & Beverage
                </h1>
            </div>
            <POSDashboard />
        </div>
    )
}
