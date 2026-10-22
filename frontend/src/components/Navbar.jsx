import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// A component is just a function that returns what to draw (JSX looks like HTML).
// <Link> works like <a href>, but switches page without reloading the browser.
export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/" className="brand">3D Print Store</Link>

            <div className="nav-links">
                {/* {condition ? A : B} = "if logged in show A, otherwise show B" */}
                {user ? (
                    <>
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
