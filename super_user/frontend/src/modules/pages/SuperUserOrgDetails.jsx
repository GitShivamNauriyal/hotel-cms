import { useState, useEffect } from "react"
import { Building2, Users, Mail, KeyRound, ShieldAlert } from "lucide-react"
import { superApi } from "../api/superApi"
import EditUserModal from "../components/EditUserModal"
import { useParams } from "react-router-dom"
// TopNav removed for Control Plane standalone

export default function SuperUserOrgDetails({ onLogout }) {
    const { id } = useParams();
    const [users, setUsers] = useState([])
    const [org, setOrg] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null)
    const [error, setError] = useState('')

    const fetchData = async () => {
        try {
            // Ideally we'd have a GET /org/:id endpoint, but we can just fetch all and filter for now to save backend time
            const orgs = await superApi.getOrganizations()
            const currentOrg = orgs.find(o => o.subdomain === id)
            if (!currentOrg) throw new Error('Organization not found')
            setOrg(currentOrg)

            const usersData = await superApi.getOrganizationUsers(currentOrg.id)
            setUsers(usersData)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [id])

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-app-bg text-text-muted">Loading Tenant Details...</div>

    if (error) return <div className="h-screen flex items-center justify-center bg-app-bg text-status-error-text">{error}</div>

    return (
        <div className="flex h-screen w-full bg-app-bg overflow-hidden text-text-main font-sans">
            <div className="flex flex-col flex-1 min-w-0 h-full">
                <header className="p-6 border-b border-border-subtle bg-card-bg flex items-center justify-between">
                    <h2 className="text-xl font-black text-text-main">Tenant Details: {org?.name}</h2>
                    <button onClick={onLogout} className="text-sm font-bold text-text-muted hover:text-text-main transition-colors">Sign Out</button>
                </header>
                <main className="flex-1 overflow-y-auto p-6 bg-app-bg">
                    <div className="space-y-6 max-w-7xl mx-auto">
                        
                        {/* Header Stats */}
                        <div className="glass-panel p-8 rounded-3xl flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                                    <Building2 size={32} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-text-main">{org.name}</h1>
                                    <p className="text-text-secondary">{org.subdomain}.hotelcms.com</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-1">Billing Status</p>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${org.billing_status === 'active' ? 'bg-status-available-bg text-status-available-text' : 'bg-status-error-bg text-status-error-text'}`}>
                                    {org.billing_status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="glass-panel p-8 rounded-3xl min-h-[400px] flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <Users className="text-brand" />
                                <h2 className="text-xl font-bold text-text-main">Tenant Users</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border-subtle">
                                            <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Email Address</th>
                                            <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Role Type</th>
                                            <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Created</th>
                                            <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b border-border-subtle/50 hover:bg-card-bg/40 transition-colors">
                                                <td className="py-4 px-4 font-bold text-text-main flex items-center gap-2">
                                                    <Mail size={16} className="text-text-muted" />
                                                    {user.email}
                                                </td>
                                                <td className="py-4 px-4">
                                                    {user.is_root ? (
                                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand/10 text-brand border border-brand/20 flex items-center gap-1 w-max">
                                                            <ShieldAlert size={12} /> Root Admin
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-card-bg text-text-secondary border border-border-subtle w-max">
                                                            Staff User
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-text-secondary text-sm">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <button 
                                                        onClick={() => setSelectedUser(user)}
                                                        className="text-sm font-bold text-brand hover:text-brand-hover hover:underline flex items-center gap-1 justify-end ml-auto"
                                                    >
                                                        <KeyRound size={16} /> Edit Credentials
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center text-text-muted">No users found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <EditUserModal 
                isOpen={!!selectedUser} 
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onSuccess={fetchData}
            />
        </div>
    )
}
