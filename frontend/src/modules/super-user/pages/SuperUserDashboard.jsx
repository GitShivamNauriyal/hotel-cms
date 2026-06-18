import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Globe, Building2, Users, Plus, Power, PowerOff } from "lucide-react"
import { superApi } from "../api/superApi"
import CreateHotelModal from "../components/CreateHotelModal"

export default function SuperUserDashboard() {
    const [organizations, setOrganizations] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [error, setError] = useState('')

    const fetchOrganizations = async () => {
        try {
            const data = await superApi.getOrganizations()
            setOrganizations(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrganizations()
    }, [])

    const handleToggleStatus = async (e, org) => {
        e.stopPropagation()
        const newStatus = org.billing_status === 'active' ? 'deactivated' : 'active'
        const confirmMsg = newStatus === 'deactivated' 
            ? `Are you sure you want to DEACTIVATE ${org.name}? All users for this hotel will be locked out immediately.`
            : `Are you sure you want to ACTIVATE ${org.name}?`
            
        if (!window.confirm(confirmMsg)) return

        try {
            await superApi.updateOrganizationStatus(org.id, newStatus)
            fetchOrganizations() // Refresh
        } catch (err) {
            alert("Failed to toggle status: " + err.message)
        }
    }

    const openOrgDetails = (orgId) => {
        window.open(`/super/org/${orgId}`, '_blank')
    }

    if (isLoading) return <div className="p-8 text-center text-text-muted font-bold">Loading Global Infrastructure...</div>

    const activeCount = organizations.filter(o => o.billing_status === 'active').length

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-text-main tracking-tight">Global Infrastructure</h1>
                    <p className="text-text-secondary mt-1">Manage tenants, master accounts, and system health.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-sm flex items-center gap-2"
                >
                    <Plus size={20} />
                    Deploy New Hotel
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-muted">Total Hotels</p>
                        <p className="text-2xl font-black text-text-main">{organizations.length}</p>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-status-available-bg flex items-center justify-center text-status-available-text">
                        <Globe size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-muted">Active Tenants</p>
                        <p className="text-2xl font-black text-text-main">{activeCount}</p>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-status-error-bg flex items-center justify-center text-status-error-text">
                        <PowerOff size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-muted">Deactivated</p>
                        <p className="text-2xl font-black text-text-main">{organizations.length - activeCount}</p>
                    </div>
                </div>
            </div>

            {error && <div className="p-4 bg-status-error-bg text-status-error-text rounded-2xl">{error}</div>}

            <div className="glass-panel p-8 rounded-3xl min-h-[400px] flex flex-col">
                <h2 className="text-xl font-bold text-text-main mb-6">Organizations (Tenants)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-subtle">
                                <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Hotel Name</th>
                                <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Subdomain</th>
                                <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Created</th>
                                <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Status</th>
                                <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {organizations.map((org) => {
                                const isActive = org.billing_status === 'active'
                                return (
                                    <tr 
                                        key={org.id} 
                                        onClick={() => openOrgDetails(org.id)}
                                        className="border-b border-border-subtle/50 hover:bg-card-bg/40 transition-colors cursor-pointer group"
                                    >
                                        <td className="py-4 px-4 font-bold text-text-main">{org.name}</td>
                                        <td className="py-4 px-4 text-text-secondary">{org.subdomain}.hotelcms.com</td>
                                        <td className="py-4 px-4 text-text-secondary text-sm">
                                            {new Date(org.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isActive ? 'bg-status-available-bg text-status-available-text' : 'bg-status-error-bg text-status-error-text'}`}>
                                                {isActive ? 'ACTIVE' : 'DEACTIVATED'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <button 
                                                onClick={(e) => handleToggleStatus(e, org)}
                                                className={`p-2 rounded-xl transition-colors ${isActive ? 'text-status-error-text hover:bg-status-error-bg' : 'text-status-available-text hover:bg-status-available-bg'}`}
                                                title={isActive ? "Deactivate Hotel" : "Activate Hotel"}
                                            >
                                                {isActive ? <PowerOff size={18} /> : <Power size={18} />}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {organizations.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-text-muted">No organizations found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateHotelModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchOrganizations}
            />
        </div>
    )
}
