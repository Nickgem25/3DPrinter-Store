import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// Wrap a page in <RequireAuth> to protect it. If nobody is logged in, the visitor is
// sent to /login instead of seeing the page. ("replace" stops the Back button from
// bouncing them straight back here.)
//
// Note: this only hides the page for convenience. The REAL protection is the backend,
// which checks the token on every request.
export default function RequireAuth({ children }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
