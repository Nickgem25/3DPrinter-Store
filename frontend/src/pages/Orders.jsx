import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import StatusBadge from '../components/StatusBadge';
import '../pages/Cart.css'; // reuses the .cart-table styles

export default function Orders() {
    const [orders, setOrders] = useState(null); // null = still loading
    const [error, setError] = useState('');

    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/orders/my-orders')
            .then(setOrders)
            .catch((err) => {
                if (err.status === 401) { // expired token -> back to login
                    logout();
                    navigate('/login');
                    return;
                }
                setError(err.message);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) return <p className="error">{error}</p>;
    if (!orders) return <p>Loading orders...</p>;

    if (orders.length === 0) {
        return (
            <div>
                <h1>My orders</h1>
                <p>You haven't placed any orders yet.</p>
                <Link to="/">Browse products</Link>
            </div>
        );
    }

    return (
        <div>
            <h1>My orders</h1>
            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.order_id}>
                            <td>#{order.order_id}</td>
                            {/* The server sends UTC times like "2026-10-22T02:55:50.000Z".
                                new Date(...).toLocaleString() converts it to the visitor's own time zone. */}
                            <td>{new Date(order.order_date).toLocaleString()}</td>
                            <td>${order.total_amount}</td>
                            <td><StatusBadge status={order.status} /></td>
                            <td><Link to={`/orders/${order.order_id}`}>View</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
