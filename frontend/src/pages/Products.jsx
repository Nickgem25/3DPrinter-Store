import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

// There are no product photos yet, so each card shows an emoji picked from the
// category name. (Order matters: "Resin 3D Printers" must match 'resin' before 'printer'.)
function categoryIcon(name) {
    const n = (name ?? '').toLowerCase();
    if (n.includes('filament')) return '🧵';
    if (n.includes('resin')) return '🧪';
    if (n.includes('printer')) return '🖨️';
    if (n.includes('nozzle') || n.includes('hotend')) return '🔥';
    if (n.includes('plate')) return '🧱';
    if (n.includes('fastener') || n.includes('insert')) return '🔩';
    if (n.includes('tool')) return '🔧';
    return '📦';
}

export default function Products() {
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

    const visibleProducts = products.filter(
        (p) =>
            (!brandId || p.brand_id === Number(brandId)) &&
            (!categoryId || p.category_id === Number(categoryId)) &&
            p.product_name.toLowerCase().includes(search.toLowerCase())
    );

    async function addToCart(productId) {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.post('/cart/items', { product_id: productId, quantity: 1 });
            setMessage('Added to cart!');
        } catch (err) {
            setMessage(err.message);
        }
    }

    if (loading) return <p>Loading products...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div>
            {/* Banner at the top of the home page (styles: .hero in index.css) */}
            <section className="hero">
                <h1>Print your next idea</h1>
                <p>Printers, filaments and parts for makers, from first prints to full upgrades.</p>
            </section>

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
                {visibleProducts.map((p) => (
                    <div className="card" key={p.product_id}>
                        <div className="card-media">
                            {p.image_url ? (
                                <img src={p.image_url} alt={p.product_name} />
                            ) : (
                                <div className="card-emoji">{categoryIcon(p.category_name)}</div>
                            )}
                        </div>
                        <div className="card-body">
                            <h3>{p.product_name}</h3>
                            <p className="muted">{p.brand_name} · {p.category_name}</p>
                            <p className="card-desc">{p.description}</p>
                            <p className="price">${p.unit_price}</p>

                            {/* Three cases: sold out, running low (5 or fewer), plenty */}
                            {p.stock_quantity === 0 ? (
                                <p className="stock-low">Out of stock</p>
                            ) : p.stock_quantity <= 5 ? (
                                <p className="stock-low">Only {p.stock_quantity} left</p>
                            ) : (
                                <p className="muted">{p.stock_quantity} in stock</p>
                            )}

                            <button disabled={p.stock_quantity === 0} onClick={() => addToCart(p.product_id)}>
                                Add to cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {visibleProducts.length === 0 && <p>No products match your filters.</p>}
        </div>
    );
}
