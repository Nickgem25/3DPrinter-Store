import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import App from './App';
import './index.css';

// This is where React starts: it takes the <div id="root"> from index.html and
// draws the whole app inside it. Think of it as main() in C.
//   BrowserRouter  -> lets us have several "pages" (URLs) without reloading
//   AuthProvider   -> makes the logged-in user available everywhere
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>
);
