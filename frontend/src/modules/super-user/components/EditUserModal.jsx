import { useState } from "react"
import { motion } from "motion/react"
import { X, Mail, Lock, AlertCircle, ShieldAlert } from "lucide-react"
import { superApi } from "../../api/superApi"

export default function EditUserModal({ isOpen, onClose, user, onSuccess }) {
    const [formData, setFormData] = useState({
        email: user?.email || '',
        password: '',
        super_admin_password: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen || !user) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            // Only send password if it was typed
            const payload = { 
                email: formData.email,
                super_admin_password: formData.super_admin_password
            }
            if (formData.password) {
                payload.password = formData.password
            }

            await superApi.updateUser(user.id, payload)
            onSuccess()
            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-app-bg/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-card-bg w-full max-w-md rounded-3xl shadow-xl border border-border-subtle overflow-hidden"
            >
                <div className="p-6 border-b border-border-subtle flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-main">Edit User Credentials</h2>
                    <button onClick={onClose} className="p-2 hover:bg-hover-bg rounded-full text-text-secondary transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 bg-status-error-bg text-status-error-text rounded-2xl flex items-start gap-3 text-sm">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-text-muted mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-app-bg border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-text-main focus:outline-none focus:border-brand transition-colors"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-text-muted mb-2">New Password (Optional)</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                <input
                                    type="password"
                                    className="w-full bg-app-bg border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-text-main focus:outline-none focus:border-brand transition-colors"
                                    placeholder="Leave blank to keep current"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-status-error-text/20">
                        <div className="flex items-center gap-2 mb-4 text-status-error-text">
                            <ShieldAlert size={20} />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Super Admin Verification</h3>
                        </div>
                        <p className="text-sm text-text-muted mb-4">
                            You are modifying credentials for another tenant. Please verify this action by entering your Super Admin password.
                        </p>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-status-error-text" size={20} />
                            <input
                                required
                                type="password"
                                className="w-full bg-status-error-bg/30 border border-status-error-text/30 rounded-2xl py-3 pl-12 pr-4 text-text-main focus:outline-none focus:border-status-error-text transition-colors placeholder:text-status-error-text/50"
                                placeholder="Your Super Admin Password"
                                value={formData.super_admin_password}
                                onChange={e => setFormData({...formData, super_admin_password: e.target.value})}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !formData.super_admin_password}
                        className="w-full mt-6 bg-brand hover:bg-brand-hover text-white font-bold py-4 px-6 rounded-2xl transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Verifying & Saving...' : 'Save Changes'}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}
