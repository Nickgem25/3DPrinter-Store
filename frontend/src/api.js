// Every request to the backend goes through this file, so the server address,
// the login token and the error handling live in ONE place.

const API_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json' };

    // If the user is logged in, attach the token. This is exactly what you did in
    // PowerShell with -Headers $headers.
    const token = localStorage.getItem('token');
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(API_URL + path, { ...options, headers });
    } catch {
        // fetch only throws when the server can't be reached at all
        throw new Error('Cannot reach the server. Is the backend running?');
    }

    // The body might be empty or not JSON, so don't let that crash us
    const data = await response.json().catch(() => ({}));

    // response.ok is false for 400, 401, 404, 500... Our backend always puts the
    // reason in data.error, so we turn it into a normal JavaScript Error.
    if (!response.ok) {
        const error = new Error(data.error || 'Something went wrong.');
        error.status = response.status;
        throw error;
    }

    return data;
}

// Short helpers so pages can write api.get('/products') instead of a long fetch call
export const api = {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
    put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
    patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: 'DELETE' })
};