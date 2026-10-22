import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    // "Controlled inputs": the text boxes always show these state values, and every
    // keystroke updates them (see onChange below). So we always know what was typed.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault(); // stop the browser's default behaviour (reloading the page)
        setError('');
        try {
            await login(email, password);
            navigate('/'); // success -> go to the product list
        } catch (err) {
            setError(err.message); // e.g. "Invalid email or password."
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h1>Log in</h1>
            {error && <p className="error">{error}</p>}

            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <button type="submit">Log in</button>
            <p>No account? <Link to="/register">Register</Link></p>
        </form>
    );
}
