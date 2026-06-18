import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import SuperUserDashboard from "./modules/pages/SuperUserDashboard"
import SuperUserOrgDetails from "./modules/pages/SuperUserOrgDetails"

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => JSON.parse(sessionStorage.getItem('isAuthenticated') || 'false'))

    useEffect(() => {
        sessionStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated))
    }, [isAuthenticated])

    const handleLogin = async (email, password) => {
        try {
            const res = await fetch("http://localhost:4001/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) return false;

            const data = await res.json();
            sessionStorage.setItem("auth", JSON.stringify(data));
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem("auth")
        setIsAuthenticated(false)
    }

    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<SuperUserDashboard onLogout={handleLogout} />} />
                <Route path="/org/:id" element={<SuperUserOrgDetails onLogout={handleLogout} />} />
            </Routes>
        </BrowserRouter>
    )
}
