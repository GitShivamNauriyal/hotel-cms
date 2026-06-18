import OTAGrid from "../modules/channel-manager/components/OTAGrid"

export default function ChannelManagerPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-text-main tracking-[-0.02em]">
                    Channel Manager
                </h1>
            </div>
            <OTAGrid />
        </div>
    )
}
