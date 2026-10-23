import './StatusBadge.css';

// "Props" are the inputs of a component, like function arguments in C.
// Usage:  <StatusBadge status="Shipped" />   ->   props = { status: 'Shipped' }
// The same component is reused on the orders list, the order page, and later the admin page.
export default function StatusBadge({ status }) {
    // 'Shipped' -> class "badge badge-shipped", so the CSS can give each status its own color
    return <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>;
}
