import { useState } from "react"
import { motion } from "motion/react"
import { X, Building2, Globe, Mail, Lock, AlertCircle } from "lucide-react"
import { superApi } from "../../api/superApi"

export default function CreateHotelModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        subdomain: '',
        root_email: '',
        root_password: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await superApi.createOrganization(formData)
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
                    <h2 className="text-xl font-bold text-text-main">Create New Hotel</h2>
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
                    
                    <div>
                        <label className="block text-sm font-bold text-text-muted mb-2">Hotel Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                            <input
                                required
                                type="text"
                                className="w-full bg-app-bg border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-text-main focus:outline-none focus:border-brand transition-colors"
                                placeholder="Grand Plaza Dubai"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-text-muted mb-2">Subdomain</label>
                        <div className="relative flex items-center">
                            <Globe className="absolute left-4 text-text-muted" size={20} />
                            <input
                                required
                                type="text"
                                className="w-full bg-app-bg border border-border-subtle rounded-2xl py-3 pl-12 pr-32 text-text-main focus:outline-none focus:border-brand transition-colors"
                                placeholder="grandplaza"
                                value={formData.subdomain}
                                onChange={e => setFormData({...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                            />
                            <span className="absolute right-4 text-text-muted text-sm pointer-events-none">.hotelcms.com</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border-subtle">
                        <h3 className="text-sm font-bold text-text-main mb-4">Root User Credentials</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-text-muted mb-2">Root Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-app-bg border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-text-main focus:outline-none focus:border-brand transition-colors"
                                        placeholder="root@hotel.com"
                                        value={formData.root_email}
                                        onChange={e => setFormData({...formData, root_email: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-text-muted mb-2">Root Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                    <input
                                        required
                                        type="password"
                                        className="w-full bg-app-bg border border-border-subtle rounded-2xl py-3 pl-12 pr-4 text-text-main focus:outline-none focus:border-brand transition-colors"
                                        placeholder="••••••••"
                                        value={formData.root_password}
                                        onChange={e => setFormData({...formData, root_password: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 bg-brand hover:bg-brand-hover text-white font-bold py-4 px-6 rounded-2xl transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating...' : 'Create Hotel & Root User'}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}
