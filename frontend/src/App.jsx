import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';

// The navbar is always shown. Below it, <Routes> shows ONE page depending on the URL.
// Later steps will add /cart, /orders and /admin here.
export default function App() {
    return (
        <>
            <Navbar />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Products />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<p>Page not found.</p>} />
                </Routes>
            </main>
        </>
    );
}
