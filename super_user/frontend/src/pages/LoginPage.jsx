import { useState } from "react"
import { motion } from "motion/react"
import { ShieldCheck, Mail, Lock, AlertCircle } from "lucide-react"

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const success = await onLogin(email, password)
            if (!success) {
                setError('Invalid credentials or unauthorized')
            }
        } catch (err) {
            setError('Connection failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-app-bg p-4 font-sans text-text-main relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Control Plane</h1>
                    <p className="text-text-secondary">Master administrative access only.</p>
                </div>

                <div className="glass-panel p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-status-error-bg text-status-error-text rounded-2xl flex items-center gap-3 text-sm font-bold">
                                <AlertCircle size={18} />
                                <p>{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-text-muted mb-2">Master Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-app-bg border border-border-subtle rounded-2xl py-4 pl-12 pr-4 text-text-main focus:outline-none focus:border-brand transition-colors"
                                    placeholder="admin@hotelcms.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-text-muted mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                <input
                                    required
                                    type="password"
                                    className="w-full bg-app-bg border border-border-subtle rounded-2xl py-4 pl-12 pr-4 text-text-main focus:outline-none focus:border-brand transition-colors"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand hover:bg-brand-hover text-app-bg font-black py-4 rounded-2xl transition-all disabled:opacity-50 mt-4"
                        >
                            {isLoading ? 'AUTHENTICATING...' : 'AUTHORIZE ACCESS'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}
