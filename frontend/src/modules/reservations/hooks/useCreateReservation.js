import { useState } from "react"

export function useCreateReservation() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const createReservation = async (formData) => {
        setIsLoading(true)
        setError(null)

        try {
            // Logic to send data to your Go API (e.g., /api/reservations)
            // This will impact GUEST, RESERVATION, and FOLIO tables
            console.log("Submitting to DB:", formData)

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1000))

            return { success: true }
        } catch (err) {
            setError(err.message)
            return { success: false }
        } finally {
            setIsLoading(false)
        }
    }

    return { createReservation, isLoading, error }
}
