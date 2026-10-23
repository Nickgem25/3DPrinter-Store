import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// A "custom hook" is just a function whose name starts with "use" that can use other
// hooks inside. It lets pages share logic instead of copy-pasting it.
//
// Usage inside a page:
//     const [error, setError] = useState('');
//     const handleError = useHandleError(setError);
//     ...
//     catch (err) { handleError(err); }
//
// A 401 means the login token expired, so we log out and go to the login page.
// Any other error message is shown on the page.
export function useHandleError(setError) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (err) => {
        if (err.status === 401) {
            logout();
            navigate('/login');
            return;
        }
        setError(err.message);
    };
}
