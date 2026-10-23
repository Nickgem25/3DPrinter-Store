import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';

export default function App() {
    return (
        <>
            <Navbar />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Products />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Need a logged-in user */}
                    <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
                    <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
                    <Route path="/orders/:id" element={<RequireAuth><OrderDetails /></RequireAuth>} />

                    {/* Need a logged-in ADMIN */}
                    <Route path="/admin/products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
                    <Route path="/admin/orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />

                    <Route path="*" element={<p>Page not found.</p>} />
                </Routes>
            </main>
        </>
    );
}
