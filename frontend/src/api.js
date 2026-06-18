const BASE_URL = 'http://localhost:4000/api/v1'

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token')
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

const handleResponse = async (res) => {
    if (!res.ok) {
        if (res.status === 401) {
            sessionStorage.clear()
            window.location.reload()
        }
        const error = await res.json().catch(() => ({}))
        throw new Error(error.error || 'API Request Failed')
    }
    if (res.status === 204) return null
    return res.json()
}

export const api = {
    // Auth
    getProfile: () => fetch(`${BASE_URL}/auth/me`, { headers: getAuthHeaders() }).then(handleResponse),

    // Config / Rooms
    getRoomTypes: () => fetch(`${BASE_URL}/config/room-types`, { headers: getAuthHeaders() }).then(handleResponse),
    createRoomType: (data) => fetch(`${BASE_URL}/config/room-types`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    updateRoomType: (id, data) => fetch(`${BASE_URL}/config/room-types/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    deleteRoomType: (id) => fetch(`${BASE_URL}/config/room-types/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(handleResponse),

    getRooms: () => fetch(`${BASE_URL}/config/rooms`, { headers: getAuthHeaders() }).then(handleResponse),
    createRoom: (data) => fetch(`${BASE_URL}/config/rooms`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    updateRoom: (id, data) => fetch(`${BASE_URL}/config/rooms/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse),

    // Housekeeping
    updateRoomStatus: (id, new_status) => fetch(`${BASE_URL}/housekeeping/${id}/transition`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ new_status }) }).then(handleResponse),

    // Reservations
    getReservations: () => fetch(`${BASE_URL}/reservations`, { headers: getAuthHeaders() }).then(handleResponse),
    createGuest: (data) => fetch(`${BASE_URL}/reservations/guests`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    createReservation: (data) => fetch(`${BASE_URL}/reservations`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    updateReservationStatus: (id, status) => fetch(`${BASE_URL}/reservations/${id}/status`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status }) }).then(handleResponse),
    deleteReservation: (id) => fetch(`${BASE_URL}/reservations/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(handleResponse),

    // Food
    getFoodItems: () => fetch(`${BASE_URL}/food/items`, { headers: getAuthHeaders() }).then(handleResponse),
    createFoodItem: (data) => fetch(`${BASE_URL}/food/items`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    updateFoodItem: (id, data) => fetch(`${BASE_URL}/food/items/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    getFoodOrders: () => fetch(`${BASE_URL}/food/orders`, { headers: getAuthHeaders() }).then(handleResponse),
    createFoodOrder: (data) => fetch(`${BASE_URL}/food/orders`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    updateFoodOrderStatus: (id, status) => fetch(`${BASE_URL}/food/orders/${id}/status`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status }) }).then(handleResponse),

    // Ledger (Finance)
    getLedger: () => fetch(`${BASE_URL}/finance/ledger`, { headers: getAuthHeaders() }).then(handleResponse),
    getFolio: (reservationId) => fetch(`${BASE_URL}/finance/folios/${reservationId}`, { headers: getAuthHeaders() }).then(handleResponse),
    addLedgerEntry: (folioId, data) => fetch(`${BASE_URL}/finance/folios/${folioId}/entries`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data) }).then(handleResponse),
}
