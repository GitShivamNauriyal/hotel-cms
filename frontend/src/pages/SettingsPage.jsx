import { useState, useEffect } from "react"
import { api } from "../api"
import { Users, Mail, Settings as SettingsIcon, ShieldAlert, Trash2, KeyRound } from "lucide-react"

export default function SettingsPage({ userRole }) {
    if (userRole !== 'root') {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="glass-panel p-10 rounded-3xl text-center">
                    <ShieldAlert size={48} className="text-status-error-text mx-auto mb-4" />
                    <h2 className="text-xl font-black text-text-main">Access Denied</h2>
                    <p className="text-text-muted mt-2">Only the Root user can access tenant settings.</p>
                </div>
            </div>
        )
    }

    const [staff, setStaff] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState(null)
    const [error, setError] = useState("")

    const [newStaff, setNewStaff] = useState({ full_name: "", email: "", password: "", staff_category: "GENERAL", root_password: "" })
    const [editStaffData, setEditStaffData] = useState({ full_name: "", email: "", password: "", staff_category: "GENERAL", root_password: "" })
    const [deletePassword, setDeletePassword] = useState("")

    const fetchStaff = async () => {
        try {
            setIsLoading(true)
            const token = sessionStorage.getItem("token")
            const res = await fetch("http://localhost:4000/api/v1/staff", {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) throw new Error("Failed to fetch staff")
            const data = await res.json()
            setStaff(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStaff()
    }, [])

    const handleAddStaff = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const token = sessionStorage.getItem("token")
            const res = await fetch("http://localhost:4000/api/v1/staff", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newStaff)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to create staff")
            
            setIsAddModalOpen(false)
            setNewStaff({ full_name: "", email: "", password: "", staff_category: "GENERAL", root_password: "" })
            fetchStaff()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleEditStaff = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const token = sessionStorage.getItem("token")
            // Send only changed fields plus root_password
            const payload = { root_password: editStaffData.root_password }
            if (editStaffData.full_name !== selectedStaff.full_name) payload.full_name = editStaffData.full_name
            if (editStaffData.email !== selectedStaff.email) payload.email = editStaffData.email
            if (editStaffData.staff_category !== selectedStaff.staff_category) payload.staff_category = editStaffData.staff_category
            if (editStaffData.password) payload.password = editStaffData.password

            if (Object.keys(payload).length === 1) throw new Error("No fields were changed")

            const res = await fetch(`http://localhost:4000/api/v1/staff/${selectedStaff.id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to update staff")
            
            setIsEditModalOpen(false)
            setSelectedStaff(null)
            setEditStaffData({ full_name: "", email: "", password: "", staff_category: "GENERAL", root_password: "" })
            fetchStaff()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleDeleteStaff = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const token = sessionStorage.getItem("token")
            const res = await fetch(`http://localhost:4000/api/v1/staff/${selectedStaff.id}`, {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ root_password: deletePassword })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to delete staff")
            
            setIsDeleteModalOpen(false)
            setSelectedStaff(null)
            setDeletePassword("")
            fetchStaff()
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-text-main tracking-[-0.02em]">Settings & Staff</h1>
                <button 
                    onClick={() => { setError(""); setIsAddModalOpen(true); }}
                    className="px-5 py-2.5 bg-brand text-[var(--brand-text)] text-sm font-bold rounded-xl hover:bg-brand/90 transition-colors shadow-md"
                >
                    + Add Staff
                </button>
            </div>

            <div className="glass-panel p-8 rounded-3xl min-h-[400px] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <Users className="text-brand" />
                    <h2 className="text-xl font-bold text-text-main">Tenant Users</h2>
                </div>

                {isLoading ? (
                    <div className="py-10 text-center text-text-muted font-bold">Loading Staff...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-subtle">
                                    <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Name</th>
                                    <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Email Address</th>
                                    <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider">Role Type</th>
                                    <th className="py-3 px-4 text-sm font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map((user) => (
                                    <tr key={user.id} className="border-b border-border-subtle/50 hover:bg-card-bg/40 transition-colors">
                                        <td className="py-4 px-4 font-bold text-text-main">{user.full_name || 'N/A'}</td>
                                        <td className="py-4 px-4 text-text-secondary flex items-center gap-2">
                                            <Mail size={16} className="text-text-muted" />
                                            {user.email}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-card-bg text-text-secondary border border-border-subtle w-max">
                                                {user.staff_category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                <button 
                                                    onClick={() => { 
                                                        setError(""); 
                                                        setSelectedStaff(user); 
                                                        setEditStaffData({ 
                                                            full_name: user.full_name || "", 
                                                            email: user.email, 
                                                            password: "", 
                                                            staff_category: user.staff_category || "GENERAL", 
                                                            root_password: "" 
                                                        });
                                                        setIsEditModalOpen(true); 
                                                    }}
                                                    className="text-sm font-bold text-brand hover:text-brand-hover hover:underline flex items-center gap-1"
                                                >
                                                    <KeyRound size={16} /> Edit
                                                </button>
                                                <button 
                                                    onClick={() => { setError(""); setSelectedStaff(user); setIsDeleteModalOpen(true); }}
                                                    className="text-sm font-bold text-status-error-text hover:underline flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} /> Remove
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {staff.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-text-muted">No staff accounts found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Staff Modal */}
            {isAddModalOpen && (
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
                                <label className="block text-xs font-bold text-status-error-text uppercase tracking-wider mb-2">Verify Root Password</label>
                                <input required type="password" className="w-full bg-app-bg border border-status-error-text/30 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-status-error-text transition-colors"
                                    value={newStaff.root_password} onChange={(e) => setNewStaff({...newStaff, root_password: e.target.value})} placeholder="Enter your root password to confirm" />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-text-secondary hover:bg-card-bg-hover">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-brand text-[var(--brand-text)] hover:bg-brand-hover">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Staff Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-card-bg p-8 rounded-3xl w-[450px] border border-border-subtle shadow-2xl">
                        <h2 className="text-xl font-bold text-text-main mb-6">Edit Staff Account</h2>
                        {error && <div className="mb-4 p-3 bg-status-error-bg text-status-error-text rounded-xl text-sm font-bold">{error}</div>}
                        <form onSubmit={handleEditStaff} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Full Name</label>
                                <input required className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-brand transition-colors"
                                    value={editStaffData.full_name} onChange={(e) => setEditStaffData({...editStaffData, full_name: e.target.value})} placeholder="Jane Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Email Address</label>
                                <input required type="email" className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-brand transition-colors"
                                    value={editStaffData.email} onChange={(e) => setEditStaffData({...editStaffData, email: e.target.value})} placeholder="jane@hotel.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">New Password (Optional)</label>
                                <input type="password" className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-brand transition-colors"
                                    value={editStaffData.password} onChange={(e) => setEditStaffData({...editStaffData, password: e.target.value})} placeholder="Leave blank to keep current" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Category</label>
                                <select required className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-brand transition-colors appearance-none"
                                    value={editStaffData.staff_category} onChange={(e) => setEditStaffData({...editStaffData, staff_category: e.target.value})}>
                                    <option value="GENERAL">General</option>
                                    <option value="FRONT_DESK">Front Desk</option>
                                    <option value="HOUSEKEEPING">Housekeeping</option>
                                    <option value="MANAGER">Manager</option>
                                </select>
                            </div>
                            <div className="pt-4 border-t border-border-subtle mt-6">
                                <label className="block text-xs font-bold text-status-error-text uppercase tracking-wider mb-2">Verify Root Password</label>
                                <input required type="password" className="w-full bg-app-bg border border-status-error-text/30 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-status-error-text transition-colors"
                                    value={editStaffData.root_password} onChange={(e) => setEditStaffData({...editStaffData, root_password: e.target.value})} placeholder="Enter your root password to confirm" />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-text-secondary hover:bg-card-bg-hover">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-brand text-[var(--brand-text)] hover:bg-brand-hover">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Staff Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-card-bg p-8 rounded-3xl w-[400px] border border-status-error-text/30 shadow-2xl">
                        <div className="flex items-center gap-3 text-status-error-text mb-6">
                            <ShieldAlert size={24} />
                            <h2 className="text-xl font-bold text-text-main">Revoke Access</h2>
                        </div>
                        <p className="text-text-secondary mb-6 leading-relaxed">
                            Are you sure you want to delete the staff account for <span className="font-bold text-text-main">{selectedStaff?.full_name}</span>? This action will prevent them from accessing the platform.
                        </p>
                        {error && <div className="mb-4 p-3 bg-status-error-bg text-status-error-text rounded-xl text-sm font-bold">{error}</div>}
                        <form onSubmit={handleDeleteStaff} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-status-error-text uppercase tracking-wider mb-2">Verify Root Password</label>
                                <input required type="password" className="w-full bg-app-bg border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-status-error-text transition-colors"
                                    value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Enter your root password to confirm" />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-text-secondary hover:bg-card-bg-hover">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-status-error-text text-app-bg hover:brightness-110 transition-all">Revoke Access</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
