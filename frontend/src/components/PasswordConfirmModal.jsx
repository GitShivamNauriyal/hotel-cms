import React, { useState } from 'react';
import { X, Lock, AlertTriangle } from 'lucide-react';

export default function PasswordConfirmModal({ isOpen, onClose, onConfirm, title, message, isDangerous }) {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onConfirm(password);
        setLoading(false);
        setPassword('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3 text-gray-900 dark:text-white font-semibold text-lg">
                        <div className={`p-2 rounded-lg ${isDangerous ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                            {isDangerous ? <AlertTriangle className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                        </div>
                        {title || 'Security Verification'}
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {message || 'Please enter your password to confirm this action.'}
                    </p>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Root Password
                        </label>
                        <input
                            type="password"
                            required
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !password}
                            className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl shadow-sm transition-all flex items-center gap-2 ${
                                isDangerous 
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' 
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : null}
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
