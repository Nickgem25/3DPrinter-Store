import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function Products() {
    // Each useState is one piece of data the page remembers. When you call its
    // setter (setProducts...), React redraws the page with the new value.
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brandId, setBrandId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { user } = useAuth();
    const navigate = useNavigate();

    // useEffect with [] runs ONCE, when the page first appears. This is where we
    // load data from the backend. The 3 requests run at the same time.
    useEffect(() => {
        Promise.all([api.get('/products'), api.get('/brands'), api.get('/categories')])
            .then(([productList, brandList, categoryList]) => {
                setProducts(productList);
                setBrands(brandList);
                setCategories(categoryList);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Filtering happens in the browser: keep a product only if it passes every filter.
    // (An empty filter means "don't filter on this".)
    const visibleProducts = products.filter(
        (p) =>
            (!brandId || p.brand_id === Number(brandId)) &&
            (!categoryId || p.category_id === Number(categoryId)) &&
            p.product_name.toLowerCase().includes(search.toLowerCase())
    );

    async function addToCart(productId) {
        // The cart needs a logged-in user, so send guests to the login page
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.post('/cart/items', { product_id: productId, quantity: 1 });
            setMessage('Added to cart!');
        } catch (err) {
            setMessage(err.message); // e.g. "Only 3 in stock..."
        }
    }

    if (loading) return <p>Loading products...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div>
            <h1>Products</h1>

            <div className="filters">
                <input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">All categories</option>
                    {categories.map((c) => (
                        <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                    ))}
                </select>
                <select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                    <option value="">All brands</option>
                    {brands.map((b) => (
                        <option key={b.brand_id} value={b.brand_id}>{b.brand_name}</option>
                    ))}
                </select>
            </div>

            {message && <p className="notice">{message}</p>}

            <div className="grid">
                {/* .map() turns each product in the list into a card. `key` helps React
                    keep track of which card is which. */}
                {visibleProducts.map((p) => (
                    <div className="card" key={p.product_id}>
                        <h3>{p.product_name}</h3>
                        <p className="muted">{p.brand_name} · {p.category_name}</p>
                        <p>{p.description}</p>
                        <p className="price">${p.unit_price}</p>
                        <p className="muted">
                            {p.stock_quantity > 0 ? `${p.stock_quantity} in stock` : 'Out of stock'}
                        </p>
                        <button disabled={p.stock_quantity === 0} onClick={() => addToCart(p.product_id)}>
                            Add to cart
                        </button>
                    </div>
                ))}
            </div>

            {visibleProducts.length === 0 && <p>No products match your filters.</p>}
        </div>
    );
}
