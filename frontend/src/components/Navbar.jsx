import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/" className="brand">3D Print Store</Link>

            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/cart">Cart</Link>
                        <Link to="/orders">Orders</Link>
                        {/* Only admins see this link */}
                        {user.role === 'admin' && <Link to="/admin/products">Admin</Link>}
                        <span>Hi, {user.full_name}</span>
                        <button onClick={logout}>Log out</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Log in</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
