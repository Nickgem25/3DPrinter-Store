import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            {/* The orange "3D" badge is a <span>; its look is in index.css (.brand-mark) */}
            <Link to="/" className="brand">
                <span className="brand-mark">3D</span>Print Store
            </Link>

            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/cart">Cart</Link>
                        <Link to="/orders">Orders</Link>
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
