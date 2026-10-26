import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import StatusBadge from '../components/StatusBadge';
import '../pages/Cart.css'; // reuses the .cart-table styles

export default function OrderDetails() {
    // useParams reads the changing part of the URL. For the route "/orders/:id",
    // visiting /orders/8 gives us id = "8".
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    const { logout } = useAuth();
    const navigate = useNavigate();

    // The [id] at the end means: run this again whenever the id in the URL changes
    useEffect(() => {
        setOrder(null);
        setError('');
        api.get(`/orders/${id}`)
            .then(setOrder)
            .catch((err) => {
                if (err.status === 401) {
                    logout();
                    navigate('/login');
                    return;
                }
                setError(err.message); // e.g. "Order not found." (also shown for other people's orders)
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (error) {
        return (
            <div>
                <p className="error">{error}</p>
                <Link to="/orders">Back to my orders</Link>
            </div>
        );
    }
    if (!order) return <p>Loading order...</p>;

    return (
        <div>
            <p><Link to="/orders">&larr; Back to my orders</Link></p>
            <h1>Order #{order.order_id}</h1>

            <p>
                <StatusBadge status={order.status} />{' '}
                <span className="muted">placed {new Date(order.order_date).toLocaleString()}</span>
            </p>
            <p><strong>Shipping to:</strong> {order.shipping_address}</p>

            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        <tr key={item.order_item_id}>
                            <td>
                                {item.product_name}

                                {Boolean(item.is_deleted) && (
                                    <span
                                        className="muted"
                                        style={{ display: 'block', marginTop: '4px' }}
                                    >
                                        Product deleted
                                    </span>
                                )}
                            </td>
                            <td>{item.sku}</td>
                            {/* This is the price the customer actually paid (saved at checkout),
                                not the product's current price. */}
                            <td>${item.price_at_purchase}</td>
                            <td>{item.quantity}</td>
                            <td>${item.line_total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="cart-total">Total: ${order.total_amount}</p>
        </div>
    );
}
