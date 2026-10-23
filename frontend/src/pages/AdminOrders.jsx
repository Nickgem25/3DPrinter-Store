import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useHandleError } from '../hooks/useHandleError';
import AdminNav from '../components/AdminNav';
import StatusBadge from '../components/StatusBadge';
import './Cart.css'; // reuses the .cart-table styles
import './Admin.css';

const STATUSES = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

// Which status can an order move to next? This copies the rules in the backend
// (ALLOWED_TRANSITIONS) so we only show buttons that make sense.
// The backend is still the real authority: it rejects any invalid change.
const NEXT_STATUSES = {
    Pending: ['Paid', 'Cancelled'],
    Paid: ['Shipped', 'Cancelled'],
    Shipped: ['Delivered'],
    Delivered: [],
    Cancelled: []
};

const ACTION_LABELS = {
    Paid: 'Mark as paid',
    Shipped: 'Mark as shipped',
    Delivered: 'Mark as delivered',
    Cancelled: 'Cancel order'
};

export default function AdminOrders() {
    const [orders, setOrders] = useState(null); // null = loading
    const [statusFilter, setStatusFilter] = useState(''); // '' = show all
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleError = useHandleError(setError);

    async function loadOrders() {
        try {
            // /orders  or  /orders?status=Pending
            const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
            setOrders(await api.get(`/orders${query}`));
        } catch (err) {
            handleError(err);
        }
    }

    // The [statusFilter] means: load the orders now, and again every time the filter changes
    useEffect(() => {
        setOrders(null);
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    async function changeStatus(order, newStatus) {
        setError('');
        setMessage('');

        // Cancelling returns the items to stock, so ask first
        if (newStatus === 'Cancelled') {
            const ok = window.confirm(`Cancel order #${order.order_id}? The items will go back into stock.`);
            if (!ok) return;
        }

        try {
            await api.patch(`/orders/${order.order_id}/status`, { status: newStatus });
            setMessage(`Order #${order.order_id} is now ${newStatus}.`);
            await loadOrders(); // refresh the table from the server
        } catch (err) {
            handleError(err); // e.g. "Cannot change an order from 'Delivered' to 'Cancelled'."
        }
    }

    return (
        <div>
            <h1>Manage orders</h1>
            <AdminNav />

            <div className="filters">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All statuses</option>
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {error && <p className="error">{error}</p>}
            {message && <p className="notice">{message}</p>}

            {!orders ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const nextStatuses = NEXT_STATUSES[order.status] || [];
                            return (
                                <tr key={order.order_id}>
                                    <td><Link to={`/orders/${order.order_id}`}>#{order.order_id}</Link></td>
                                    <td>{new Date(order.order_date).toLocaleString()}</td>
                                    <td>
                                        {order.customer_name}
                                        <br />
                                        <span className="muted">{order.customer_email}</span>
                                    </td>
                                    <td>${order.total_amount}</td>
                                    <td><StatusBadge status={order.status} /></td>
                                    <td className="actions">
                                        {nextStatuses.length === 0 ? (
                                            <span className="muted">No further changes</span>
                                        ) : (
                                            nextStatuses.map((next) => (
                                                <button
                                                    key={next}
                                                    className={next === 'Cancelled' ? 'danger' : ''}
                                                    onClick={() => changeStatus(order, next)}
                                                >
                                                    {ACTION_LABELS[next]}
                                                </button>
                                            ))
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
