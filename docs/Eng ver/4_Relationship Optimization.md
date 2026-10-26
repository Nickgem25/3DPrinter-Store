# 4. Entity Relationship Optimization
## 3DPrinter-Store Database Project

### 4.1 Objective
The relationships are designed to reduce unnecessary duplication, maintain referential integrity, support e-commerce transactions, and retain historical order information even after a product is permanently deleted. This section explains the design decisions already represented in the database; it does **not** propose changing the working schema.

### 4.2 Resolving Many-to-Many Relationships
**Orders and products:** One order may contain multiple products, and one product can appear in many orders. The many-to-many relationship is resolved through `orderitem`:

- `order` **1:N** `orderitem`
- `product` **1:N** `orderitem` (the product reference becomes optional after deletion)
- `orderitem` stores `order_id`, `product_id`, `quantity`, `price_at_purchase`, `product_name_at_purchase`, and `sku_at_purchase`.

**Shopping carts and products:** One cart may contain multiple products, and a product may appear in multiple carts. The many-to-many relationship is resolved through `cartitem`:

- `cart` **1:N** `cartitem`
- `product` **1:N** `cartitem`
- `cartitem` stores cart/product references and a selected quantity. A unique constraint on `(cart_id, product_id)` prevents the same product from appearing as separate lines within one cart.

### 4.3 Separating Reference Data
`brand` and `category` are independent entities referenced by `product` through `brand_id` and `category_id`. This avoids repeatedly storing brand and category names in every product row and makes their names easier to manage consistently. A product's brand or category can be nullable under the observed schema.

### 4.4 Preserving Transaction History
An order records its purchaser, date, shipping address, status, and `total_amount`. Each `orderitem` records its quantity and `price_at_purchase` rather than depending on today's retail price.

The historical fields `product_name_at_purchase` and `sku_at_purchase` are deliberate **snapshots**. They repeat a small amount of information to preserve what was purchased, even if the product is renamed or removed later. This is intentional historical denormalization, not an accidental duplicate.

The `orderitem.product_id` foreign key is nullable with **`ON DELETE SET NULL`**. Deleting a product removes its catalog row but preserves associated order items and their snapshots. `cartitem.product_id` uses **`ON DELETE CASCADE`**, so products removed permanently do not remain in shopping carts. Orders themselves must not be cascaded away when products are deleted.

### 4.5 User, Cart, and Order Separation
The `user` entity stores account information; `cart` holds a user's current shopping selections; `order` represents a completed checkout record. Keeping carts separate from orders avoids treating editable selections as permanent purchases. The exact user-to-cart maximum cardinality should be determined from the live `cart.user_id` constraints before asserting a strict 1:1 relationship.

### 4.6 Normalization Discussion
- **First Normal Form (1NF):** Product selections are represented by separate `cartitem` or `orderitem` rows, not repeating product columns or lists inside a single field.
- **Second Normal Form (2NF):** Attributes describing a cart or an order are held in their parent entity, while quantities and purchased prices belong to the respective line item.
- **Third Normal Form (3NF):** Brands and categories are separated into dedicated tables rather than duplicated as descriptive fields throughout `product`.
- **Intentional exceptions:** Purchase-time name, SKU, price, shipping address, and order total are retained as historical transaction values. These help preserve the actual transaction and should not be recomputed from mutable current product data.

Normalization is a design analysis; full compliance across every attribute would require a separate constraint and dependency review.

### 4.7 Integrity and Business Constraints
- Primary keys uniquely identify rows; `product.sku` uniquely identifies products.
- Foreign keys keep relationships valid while deletion actions are tailored to business needs.
- Checks on quantities and prices prevent invalid negative prices or non-positive line-item quantities.
- Checkout should insert order items and adjust inventory in a single transaction to avoid partial orders.
- Product soft deletion (`is_active = 0`) preserves the product row; permanent deletion removes it while retaining historical order lines.

### 4.8 Conclusion
The optimized design uses two junction tables, reusable brand/category reference entities, separated cart and order data, and controlled deletion rules. Together these choices support consistent product management, correct checkout behavior, and reliable order history.
