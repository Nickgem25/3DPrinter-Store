import { NavLink } from 'react-router-dom';

// Tabs shown at the top of every admin page.
// <NavLink> is a <Link> that automatically gets the CSS class "active" when its
// address matches the current page, so the CSS can highlight the current tab.
export default function AdminNav() {
    return (
        <div className="admin-tabs">
            <NavLink to="/admin/products">Products</NavLink>
            <NavLink to="/admin/orders">Orders</NavLink>
        </div>
    );
}
