import { useState } from "react"
import { motion } from "motion/react"
import { Lock, Mail, ArrowRight, Sun, Moon } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"

export default function LoginPage({ onLogin }) {
    const { isDark, toggleTheme } = useTheme()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        // Mock authentication delay
        await new Promise(resolve => setTimeout(resolve, 800))

        const success = onLogin(email, password)
        if (!success) {
            setError("Invalid credentials. Please check your email and password.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-app-bg flex items-center justify-center p-4 relative overflow-hidden">
            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-card-bg border border-border-subtle flex items-center justify-center text-text-secondary hover:text-brand hover:border-brand/30 transition-all shadow-sm z-50"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {isDark ? (
                    <Sun size={20} className="text-yellow-400" />
                ) : (
                    <Moon size={20} className="text-brand" />
                )}
            </button>

            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                <div className="glass-panel p-10 rounded-[2.5rem] shadow-2xl border border-white/10 dark:border-white/5 relative overflow-hidden">
                    {/* Inner highlight */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    <div className="relative z-10 space-y-8">
                        <div className="space-y-2 text-center">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="w-16 h-16 bg-brand/10 rounded-2xl mx-auto flex items-center justify-center mb-6 border border-brand/20"
                            >
                                <Lock className="w-8 h-8 text-brand" />
                            </motion.div>
                            <h1 className="text-3xl font-black text-text-main tracking-tight">Welcome Back</h1>
                            <p className="text-sm text-text-muted font-medium">Enter your credentials to access the system</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-text-muted" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 bg-app-bg/50 border border-border-subtle rounded-2xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent transition-all backdrop-blur-sm"
                                        placeholder="Email address"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-text-muted" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 bg-app-bg/50 border border-border-subtle rounded-2xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent transition-all backdrop-blur-sm"
                                        placeholder="Password"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 px-4 bg-brand hover:bg-brand/90 text-app-bg rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_8px_20px_-8px_rgba(37,99,235,0.5)]"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 text-app-bg border-app-bg/30 border-t-app-bg rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
