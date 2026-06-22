import { useState, useEffect } from "react"
import { Building2, Users, Mail, KeyRound, ShieldAlert, Trash2, Plus } from "lucide-react"
import { superApi } from "../api/superApi"
import EditUserModal from "../components/EditUserModal"
import { useParams } from "react-router-dom"

export default function SuperUserOrgDetails({ onLogout }) {
    const { id } = useParams();
    const [users, setUsers] = useState([])
    const [org, setOrg] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null)
    const [error, setError] = useState('')

    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)
    const [isDeleteStaffModalOpen, setIsDeleteStaffModalOpen] = useState(false)
    const [staffToDelete, setStaffToDelete] = useState(null)
    const [superPassword, setSuperPassword] = useState("")
    const [newStaff, setNewStaff] = useState({ full_name: "", email: "", password: "", staff_category: "GENERAL", super_password: "" })

    const fetchData = async () => {
        try {
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

    const handleAddStaff = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const token = sessionStorage.getItem("token")
            const res = await fetch(`http://localhost:4001/api/v1/superuser/organizations/${org.id}/staff`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newStaff)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to create staff")
            
            setIsAddStaffModalOpen(false)
            setNewStaff({ full_name: "", email: "", password: "", staff_category: "GENERAL", super_password: "" })
            fetchData()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleDeleteStaff = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const token = sessionStorage.getItem("token")
            const res = await fetch(`http://localhost:4001/api/v1/superuser/organizations/${org.id}/staff/${staffToDelete.id}`, {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ super_password: superPassword })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to delete staff")
            
            setIsDeleteStaffModalOpen(false)
            setStaffToDelete(null)
            setSuperPassword("")
            fetchData()
        } catch (err) {
            setError(err.message)
        }
    }

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-app-bg text-text-muted">Loading Tenant Details...</div>

    if (error && !org) return <div className="h-screen flex items-center justify-center bg-app-bg text-status-error-text">{error}</div>

    return (
        <div className="flex h-screen w-full bg-app-bg overflow-hidden text-text-main font-sans">
            <div className="flex flex-col flex-1 min-w-0 h-full">
                <header className="p-6 border-b border-border-subtle bg-card-bg flex items-center justify-between">
                    <h2 className="text-xl font-black text-text-main">Tenant Details: {org?.name}</h2>
                    <button onClick={onLogout} className="text-sm font-bold text-text-muted hover:text-text-main transition-colors">Sign Out</button>
                </header>
                <main className="flex-1 overflow-y-auto p-6 bg-app-bg">
                    <div className="space-y-6 max-w-7xl mx-auto">
                        
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

                        <div className="glass-panel p-8 rounded-3xl min-h-[400px] flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Users className="text-brand" />
                                    <h2 className="text-xl font-bold text-text-main">Tenant Users</h2>
                                </div>
                                <button 
                                    onClick={() => { setError(""); setIsAddStaffModalOpen(true); }}
                                    className="px-4 py-2 bg-brand text-[var(--brand-text)] text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-brand-hover transition-colors"
                                >
                                    <Plus size={16} /> Add Staff
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border-subtle">
                                            <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Name</th>
                                            <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Email Address</th>
                                            <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Role Type</th>
                                            <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Created</th>
                                            <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b border-border-subtle/50 hover:bg-card-bg/40 transition-colors">
                                                <td className="py-4 px-4 font-bold text-text-main">{user.full_name || 'N/A'}</td>
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
                                                            Staff: {user.staff_category || 'GENERAL'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-text-secondary text-sm">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-4">
                                                        <button 
                                                            onClick={() => setSelectedUser(user)}
                                                            className="text-sm font-bold text-brand hover:text-brand-hover hover:underline flex items-center gap-1"
                                                        >
                                                            <KeyRound size={16} /> Edit
                                                        </button>
                                                        {!user.is_root && (
                                                            <button 
                                                                onClick={() => { setError(""); setStaffToDelete(user); setIsDeleteStaffModalOpen(true); }}
                                                                className="text-sm font-bold text-status-error-text hover:underline flex items-center gap-1"
                                                            >
                                                                <Trash2 size={16} /> Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-text-muted">No users found.</td>
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

            {/* Add Staff Modal */}
            {isAddStaffModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-card-bg p-8 rounded-3xl w-[450px] border border-border-subtle shadow-2xl">
                        <h2 className="text-xl font-bold text-text-main mb-6">Create Staff Account</h2>
                        {error && <div className="mb-4 p-3 bg-status-error-bg text-status-error-text rounded-xl text-sm font-bold">{error}</div>}
                        <form onSubmit={handleAddStaff} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Full Name</label>
                                <input required className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-brand transition-colors"
                                    value={newStaff.full_name} onChange={(e) => setNewStaff({...newStaff, full_name: e.target.value})} placeholder="Jane Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Email Address</label>
                                <input required type="email" className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-brand transition-colors"
                                    value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} placeholder="jane@hotel.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">New Password</label>
                                <input required type="password" className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-brand transition-colors"
                                    value={newStaff.password} onChange={(e) => setNewStaff({...newStaff, password: e.target.value})} placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Category</label>
                                <select required className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-brand transition-colors appearance-none"
                                    value={newStaff.staff_category} onChange={(e) => setNewStaff({...newStaff, staff_category: e.target.value})}>
                                    <option value="GENERAL">General</option>
                                    <option value="FRONT_DESK">Front Desk</option>
                                    <option value="HOUSEKEEPING">Housekeeping</option>
                                    <option value="MANAGER">Manager</option>
                                </select>
                            </div>
                            <div className="pt-4 border-t border-border-subtle mt-6">
                                <label className="block text-xs font-bold text-status-error-text uppercase tracking-wider mb-2">Verify Super Admin Password</label>
                                <input required type="password" className="w-full bg-app-bg border border-status-error-text/30 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-status-error-text transition-colors"
                                    value={newStaff.super_password} onChange={(e) => setNewStaff({...newStaff, super_password: e.target.value})} placeholder="Enter your super admin password to confirm" />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsAddStaffModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-text-secondary hover:bg-card-bg-hover">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-brand text-[var(--brand-text)] hover:bg-brand-hover">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Staff Modal */}
            {isDeleteStaffModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-card-bg p-8 rounded-3xl w-[400px] border border-status-error-text/30 shadow-2xl">
                        <div className="flex items-center gap-3 text-status-error-text mb-6">
                            <ShieldAlert size={24} />
                            <h2 className="text-xl font-bold text-text-main">Revoke Access</h2>
                        </div>
                        <p className="text-text-secondary mb-6 leading-relaxed">
                            Are you sure you want to delete the staff account for <span className="font-bold text-text-main">{staffToDelete?.full_name || staffToDelete?.email}</span>? This action will prevent them from accessing the platform.
                        </p>
                        {error && <div className="mb-4 p-3 bg-status-error-bg text-status-error-text rounded-xl text-sm font-bold">{error}</div>}
                        <form onSubmit={handleDeleteStaff} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-status-error-text uppercase tracking-wider mb-2">Verify Super Admin Password</label>
                                <input required type="password" className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-status-error-text transition-colors"
                                    value={superPassword} onChange={(e) => setSuperPassword(e.target.value)} placeholder="Enter your super admin password to confirm" />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsDeleteStaffModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-text-secondary hover:bg-card-bg-hover">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-status-error-text text-app-bg hover:brightness-110 transition-all">Revoke Access</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
