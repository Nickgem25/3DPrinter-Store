import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import './Cart.css';

export default function Cart() {
    const [cart, setCart] = useState(null); // null = still loading, otherwise { cart_id, items, total }
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [placedOrder, setPlacedOrder] = useState(null); // filled in after a successful checkout
    const [busy, setBusy] = useState(false); // true while the order request is running

    const { logout } = useAuth();
    const navigate = useNavigate();

    // One place to handle failed requests. A 401 means the token expired (they last
    // 24 hours), so we log the user out and send them to the login page.
    function handleError(err) {
        if (err.status === 401) {
            logout();
            navigate('/login');
            return;
        }
        setError(err.message);
    }

    async function loadCart() {
        try {
            setCart(await api.get('/cart'));
        } catch (err) {
            handleError(err);
        }
    }

    // Load the cart once, when the page appears
    useEffect(() => {
        loadCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // After every change we ask the server for the cart again. That way the screen
    // always shows what the database really holds, including the server-calculated total.
    async function changeQuantity(item, newQuantity) {
        setError('');
        try {
            await api.put(`/cart/items/${item.cart_item_id}`, { quantity: newQuantity });
            await loadCart();
        } catch (err) {
            handleError(err); // e.g. "Only 3 in stock."
        }
    }

    async function removeItem(item) {
        setError('');
        try {
            await api.delete(`/cart/items/${item.cart_item_id}`);
            await loadCart();
        } catch (err) {
            handleError(err);
        }
    }

    async function placeOrder(e) {
        e.preventDefault();
        setError('');
        setBusy(true); // disables the button so a double-click can't send two orders
        try {
            const result = await api.post('/orders', { shipping_address: address });
            setPlacedOrder(result);
        } catch (err) {
            handleError(err);
        } finally {
            setBusy(false);
        }
    }

    // ---- What to draw. React shows the first one of these that applies. ----

    if (placedOrder) {
        return (
            <div>
                <h1>Thank you!</h1>
                <p className="notice">
                    Order #{placedOrder.order_id} placed. Total: ${Number(placedOrder.total_amount).toFixed(2)}
                </p>
                {/* The order id from the server lets us link straight to the new order's page */}
                <p><Link to={`/orders/${placedOrder.order_id}`}>View your order</Link></p>
                <Link to="/">Continue shopping</Link>
            </div>
        );
    }

    if (!cart) {
        return error ? <p className="error">{error}</p> : <p>Loading cart...</p>;
    }

    if (cart.items.length === 0) {
        return (
            <div>
                <h1>Your cart</h1>
                <p>Your cart is empty.</p>
                <Link to="/">Browse products</Link>
            </div>
        );
    }

    // Products an admin hid after they were added to the cart can't be bought
    const hasUnavailable = cart.items.some((item) => !item.is_active);

    return (
        <div>
            <h1>Your cart</h1>
            {error && <p className="error">{error}</p>}

            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {cart.items.map((item) => (
                        <tr key={item.cart_item_id}>
                            <td>
                                {item.name}
                                {!item.is_active && <span className="error"> (no longer available)</span>}
                            </td>
                            <td>${item.price}</td>
                            <td>
                                <button
                                    disabled={item.quantity <= 1 || !item.is_active}
                                    onClick={() => changeQuantity(item, item.quantity - 1)}
                                >
                                    -
                                </button>
                                <span className="qty">{item.quantity}</span>
                                <button
                                    disabled={item.quantity >= item.stock_quantity || !item.is_active}
                                    onClick={() => changeQuantity(item, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </td>
                            <td>${(Number(item.price) * item.quantity).toFixed(2)}</td>
                            <td>
                                <button className="danger" onClick={() => removeItem(item)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="cart-total">Total: ${cart.total.toFixed(2)}</p>

            <form className="checkout" onSubmit={placeOrder}>
                <label>Shipping address</label>
                <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <button type="submit" disabled={busy || hasUnavailable}>
                    {busy ? 'Placing order...' : 'Place order'}
                </button>
                {hasUnavailable && <p className="error">Remove the unavailable items to check out.</p>}
            </form>
        </div>
    );
}
