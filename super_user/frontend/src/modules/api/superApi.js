const API_BASE = 'http://localhost:4001/api/v1/super';

function getAuthHeader() {
    const authData = sessionStorage.getItem('auth');
    if (!authData) return {};
    const parsed = JSON.parse(authData);
    return { 'Authorization': `Bearer ${parsed.token}`, 'Content-Type': 'application/json' };
}

export const superApi = {
    getOrganizations: async () => {
        const res = await fetch(`${API_BASE}/organizations`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to fetch organizations');
        return res.json();
    },

    createOrganization: async (data) => {
        const res = await fetch(`${API_BASE}/organizations`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to create organization');
        }
        return res.json();
    },

    updateOrganizationStatus: async (id, status) => {
        const res = await fetch(`${API_BASE}/organizations/${id}/status`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
    },

    getOrganizationUsers: async (id) => {
        const res = await fetch(`${API_BASE}/organizations/${id}/users`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
    },

    updateUser: async (id, data) => {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to update user');
        }
        return res.json();
    }
};
