import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// Like RequireAuth, but also checks the role. Logged-out visitors go to /login,
// logged-in customers go back to the home page.
//
// Again: this only hides the page. If a customer somehow reached it, the backend
// would still answer 403 to every admin request (checkRole(['admin'])).
export default function RequireAdmin({ children }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'admin') return <Navigate to="/" replace />;

    return children;
}
