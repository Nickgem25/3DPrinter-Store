# Business Rules
## 3DPrinter-Store Database Project

### 1. Users and Access
1. Each user is identified by a unique `user_id` and uses an email address to sign in.
2. Users have roles that distinguish customers from administrators.
3. A user may place multiple orders; each order belongs to one user.
4. Only administrators may create, edit, hide, restore, or permanently delete catalog products.

### 2. Brands, Categories, and Products
5. Each product has a unique `product_id` and SKU.
6. Each product records a name, price, stock quantity, active status, and optionally a description and image URL.
7. A product may be associated with one brand and one category; a brand or category may be associated with many products.
8. Product prices and stock quantities cannot be negative.
9. Only active products are listed in the public catalog. Customers cannot add inactive products to carts or purchase them.

### 3. Shopping Carts
10. A user may have a shopping cart containing multiple cart items.
11. Each cart item identifies one product and a positive quantity.
12. The same product should occur only once per cart; increasing its quantity updates that cart item.
13. When a product is permanently deleted, any cart items referring to that product are deleted automatically.

### 4. Orders and Inventory
14. A customer places an order using items in their cart and must provide a shipping address or have one saved in their profile.
15. Each order records its user, date, shipping address, total amount, and status.
16. An order contains one or more order items; each order item belongs to exactly one order.
17. Each order item stores the quantity and purchase-time price, product name, and SKU, preserving the transaction's historical details.
18. Checkout verifies that ordered products are active and sufficient stock is available.
19. Successful checkout creates an order, reduces applicable stock, and clears purchased items from the cart in a database transaction.
20. Supported order statuses are `Pending`, `Paid`, `Shipped`, `Delivered`, and `Cancelled`. Valid status changes follow the application's workflow.
21. Cancelling an eligible order returns quantities to inventory for products that still exist.

### 5. Product Removal and Historical Integrity
22. Hiding a product is a soft deletion: it sets `is_active` to false and can be reversed by an administrator.
23. Permanent deletion removes the product record from the `product` table.
24. An order item that referenced a permanently deleted product is retained; its `product_id` becomes `NULL` via `ON DELETE SET NULL`.
25. The order history continues to show the saved product name, SKU, quantity, and purchase price, and marks the product as deleted.
26. Removing a product does not remove the associated historical orders or change their recorded totals.

---

**Scope note:** This document describes the implemented business behavior discussed for the project. Final submission should be checked against the latest application code and database schema, particularly account/cardinality constraints and inventory handling.
