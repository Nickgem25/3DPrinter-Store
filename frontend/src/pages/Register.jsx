import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            await register(fullName, email, password); // creates the account, then logs in
            navigate('/');
        } catch (err) {
            setError(err.message); // e.g. "Email is already registered."
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h1>Register</h1>
            {error && <p className="error">{error}</p>}

            <label>Full name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />

            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Password (at least 8 characters)</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
            />

            <button type="submit">Create account</button>
            <p>Already have an account? <Link to="/login">Log in</Link></p>
        </form>
    );
}
