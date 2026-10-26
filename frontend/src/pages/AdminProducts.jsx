import { useEffect, useState } from 'react';
import { api } from '../api';
import { useHandleError } from '../hooks/useHandleError';
import AdminNav from '../components/AdminNav';
import './Cart.css'; // reuses the .cart-table styles
import './Admin.css';

// The form starts empty. All the fields are kept as text, because that is what
// text boxes give us; the backend converts and validates them.
const emptyForm = {
    product_name: '',
    sku: '',
    unit_price: '',
    stock_quantity: '',
    description: '',
    image_url: '',
    brand_id: '',
    category_id: ''
};

export default function AdminProducts() {
    const [products, setProducts] = useState(null); // null = still loading
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null); // null = "add" mode, a number = "edit" mode
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleError = useHandleError(setError);

    // This route returns ALL products, including the hidden ones (see the backend change)
    async function loadProducts() {
        try {
            setProducts(await api.get('/products/admin/all'));
        } catch (err) {
            handleError(err);
        }
    }

    useEffect(() => {
        loadProducts();
        api.get('/brands').then(setBrands).catch(handleError);
        api.get('/categories').then(setCategories).catch(handleError);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // One function updates ANY field. Each input has a name="..." that matches a key of
    // the form. [e.target.name] uses that name as the key, and ...form copies the other fields.
    function updateField(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function startEdit(product) {
        setEditingId(product.product_id);
        setForm({
            product_name: product.product_name,
            sku: product.sku,
            unit_price: product.unit_price,
            stock_quantity: product.stock_quantity,
            description: product.description || '',
            image_url: product.image_url || '',
            brand_id: product.brand_id ?? '',
            category_id: product.category_id ?? ''
        });
        setError('');
        setMessage('');
        window.scrollTo(0, 0); // jump to the form at the top
    }

    function cancelEdit() {
        setEditingId(null);
        setForm(emptyForm);
    }

    // The same form is used for both adding and editing
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setMessage('');

        const body = {
            product_name: form.product_name,
            sku: form.sku,
            unit_price: form.unit_price,
            stock_quantity: form.stock_quantity,
            description: form.description,
            image_url: form.image_url,
            brand_id: form.brand_id || null, // "" (nothing chosen) becomes null
            category_id: form.category_id || null
        };

        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, body);
                setMessage('Product updated.');
            } else {
                await api.post('/products', body);
                setMessage('Product created.');
            }
            cancelEdit();
            await loadProducts(); // refresh the table from the server
        } catch (err) {
            handleError(err); // e.g. "A product with that SKU already exists."
        }
    }

    // Visible product -> hide it (the backend's soft delete).
    // Hidden product  -> restore it by setting is_active back to true.
    async function toggleActive(product) {
        setError('');
        setMessage('');
        try {
            if (product.is_active) {
                if (!window.confirm(`Hide "${product.product_name}" from the shop?`)) return;
                await api.delete(`/products/${product.product_id}`);
                setMessage('Product hidden.');
            } else {
                await api.put(`/products/${product.product_id}`, { is_active: true });
                setMessage('Product restored.');
            }
            await loadProducts();
        } catch (err) {
            handleError(err);
        }
    }

    async function permanentlyDelete(product) {
        const confirmed = window.confirm(
            `PERMANENTLY DELETE "${product.product_name}"?\n\n` +
            `This cannot be undone.\n` +
            `Existing order history will be preserved.\n` +
            `The product will also be removed from customer carts.`
        );

        if (!confirmed) return;

        setError('');
        setMessage('');

        try {
            await api.delete(`/products/${product.product_id}/permanent`);

            setMessage(`"${product.product_name}" permanently deleted.`);

            if (editingId === product.product_id) {
                cancelEdit();
            }

            await loadProducts();
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <div>
            <h1>Manage products</h1>
            <AdminNav />

            {error && <p className="error">{error}</p>}
            {message && <p className="notice">{message}</p>}

            <form className="admin-form" onSubmit={handleSubmit}>
                <h3>{editingId ? `Edit product #${editingId}` : 'Add a product'}</h3>

                <input name="product_name" placeholder="Product name" value={form.product_name} onChange={updateField} required />
                <input name="sku" placeholder="SKU (unique)" value={form.sku} onChange={updateField} required />
                <input name="unit_price" type="number" step="0.01" min="0" placeholder="Price" value={form.unit_price} onChange={updateField} required />
                <input name="stock_quantity" type="number" step="1" min="0" placeholder="Stock" value={form.stock_quantity} onChange={updateField} required />

                <select name="brand_id" value={form.brand_id} onChange={updateField}>
                    <option value="">No brand</option>
                    {brands.map((b) => (
                        <option key={b.brand_id} value={b.brand_id}>{b.brand_name}</option>
                    ))}
                </select>
                <select name="category_id" value={form.category_id} onChange={updateField}>
                    <option value="">No category</option>
                    {categories.map((c) => (
                        <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                    ))}
                </select>

                <textarea name="description" rows={2} placeholder="Description" value={form.description} onChange={updateField} />
                <input
                    name="image_url"
                    placeholder="Image URL or path (e.g. /product-images/cat26-001.jpg)"
                    value={form.image_url}
                    onChange={updateField}
                />
                <div className="actions">
                    <button type="submit">{editingId ? 'Save changes' : 'Add product'}</button>
                    {editingId && <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>}
                </div>
            </form>

            {!products ? (
                <p>Loading products...</p>
            ) : (
                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            // Hidden products are shown faded so you can tell them apart
                            <tr key={p.product_id} className={p.is_active ? '' : 'inactive'}>
                                <td>{p.product_id}</td>
                                <td>{p.product_name}</td>
                                <td>{p.sku}</td>
                                <td>${p.unit_price}</td>
                                <td>{p.stock_quantity}</td>
                                <td>{p.is_active ? 'Visible' : 'Hidden'}</td>
                                <td className="actions">
                                    <button onClick={() => startEdit(p)}>
                                        Edit
                                    </button>

                                    <button
                                        className={p.is_active ? 'danger' : 'secondary'}
                                        onClick={() => toggleActive(p)}
                                    >
                                        {p.is_active ? 'Hide' : 'Restore'}
                                    </button>

                                    <button
                                        className="danger"
                                        onClick={() => permanentlyDelete(p)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
