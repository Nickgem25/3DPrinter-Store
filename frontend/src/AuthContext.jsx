import { createContext, useContext, useState } from 'react';
import { api } from './api';

// A "context" is shared data any component can read without passing it down by hand.
// Here it holds WHO is logged in, so the navbar, cart page, admin page... can all use it.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // useState remembers a value between renders. The function we pass runs only once,
    // at startup: it reads the saved user from the browser, so refreshing the page
    // doesn't log you out.
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    async function login(email, password) {
        const data = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token); // api.js reads this for every request
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user); // changing state makes React redraw everything that uses `user`
    }

    async function register(fullName, email, password) {
        await api.post('/auth/register', { full_name: fullName, email, password });
        await login(email, password); // the register endpoint returns no token, so log in right after
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Small shortcut: in any component write  const { user } = useAuth();
export function useAuth() {
    return useContext(AuthContext);
}
