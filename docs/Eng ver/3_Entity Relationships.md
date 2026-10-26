# 3. Entity Relationships

## 3DPrinter-Store Database Project

This document describes the relationships among the eight entities in the implemented MariaDB database. Cardinalities distinguish the number of records that *may* be associated, and foreign keys enforce references where applicable.

## Relationship Summary

| # | Parent entity | Child entity | Relationship | Foreign key | Explanation |
|---|---|---|---|---|---|
| 1 | `user` | `cart` | 1 to 0..1 (intended) | `cart.user_id` → `user.user_id` | A user may have a cart; each cart belongs to one user. Verify the UNIQUE constraint on `cart.user_id` to enforce at most one cart per user. |
| 2 | `user` | `order` | 1 to many | `order.user_id` → `user.user_id` | A user can place multiple orders; each order belongs to one user. |
| 3 | `brand` | `product` | 1 to many (optional on product side) | `product.brand_id` → `brand.brand_id` | A brand can identify many products; a product may have no assigned brand because `brand_id` is nullable. |
| 4 | `category` | `product` | 1 to many (optional on product side) | `product.category_id` → `category.category_id` | A category groups many products; a product may have no assigned category because `category_id` is nullable. |
| 5 | `cart` | `cartitem` | 1 to many | `cartitem.cart_id` → `cart.cart_id` | A cart can contain multiple lines; each line belongs to one cart. |
| 6 | `product` | `cartitem` | 1 to many | `cartitem.product_id` → `product.product_id` | A product can be in many carts; each cart line refers to one existing product. |
| 7 | `order` | `orderitem` | 1 to many | `orderitem.order_id` → `order.order_id` | An order contains purchase lines; each line belongs to one order. |
| 8 | `product` | `orderitem` | 1 to many, optional reference after deletion | `orderitem.product_id` → `product.product_id` | An order line normally refers to a product; the reference becomes NULL if that product is permanently deleted. |

> **Implementation note:** The `cart` table's full CREATE TABLE definition has not yet been checked in this documentation session. The application uses one cart per user, but the database must have a UNIQUE key on `cart.user_id` to guarantee the 1-to-0..1 cardinality.

## Many-to-Many Relationships Resolved by Associative Entities

### Cart and Product

Conceptually, one cart can contain many products, and one product may appear in many carts. This many-to-many (M:N) relationship is resolved by **`cartitem`**.

- `cart` 1 → many `cartitem`
- `product` 1 → many `cartitem`
- `cartitem` stores the selected `quantity`.
- The database's unique key on (`cart_id`, `product_id`) prevents the same product from appearing as separate lines in one cart.

### Order and Product

Conceptually, one order can contain many products, and one product can be purchased in many orders. This many-to-many (M:N) relationship is resolved by **`orderitem`**.

- `order` 1 → many `orderitem`
- `product` 1 → many `orderitem`, while that product still exists
- `orderitem` stores `quantity`, `price_at_purchase`, `product_name_at_purchase`, and `sku_at_purchase`.

These snapshots preserve purchased details even when the original product is renamed or permanently deleted.

## Referential Integrity and Deletion Rules

| Relationship | Observed deletion behavior | Effect |
|---|---|---|
| `product` → `cartitem` | `ON DELETE CASCADE` | Permanently deleting a product removes that product's cart lines. |
| `cart` → `cartitem` | `ON DELETE CASCADE` | Deleting a cart removes its item rows. |
| `product` → `orderitem` | `ON DELETE SET NULL` (after migration) | Permanently deleting a product sets the historical line's `product_id` to `NULL` without removing the line. |
| `order` → `orderitem` | No explicit `ON DELETE` action in the verified schema | The foreign key normally prevents deletion of an order referenced by line items. |
| `brand` → `product` | No explicit `ON DELETE` action in the verified schema | Referenced brands cannot be deleted without handling dependent products. |
| `category` → `product` | No explicit `ON DELETE` action in the verified schema | Referenced categories cannot be deleted without handling dependent products. |

### Example: Permanent Product Deletion

Before deletion:

- `product.product_id = 101` exists.
- An `orderitem` references `product_id = 101` and stores the purchased name, SKU, quantity, and price.

After deletion:

- The product row is removed.
- The matching `orderitem.product_id` becomes `NULL`.
- The snapshot fields and original order total remain available.
- The website can label the historical item **Product deleted**.

**Soft deletion is different:** setting `product.is_active = 0` hides the product from the storefront without removing the row or changing its relationships.

## Notes for the ER Diagram

Use **Crow's Foot notation** to represent these eight entities and show:

1. Primary keys (PK) and foreign keys (FK).
2. One-to-many cardinalities for the order, cart-item, category, and brand relationships.
3. Optionality for nullable product `brand_id`, `category_id`, and historical `orderitem.product_id`.
4. The associative entities `cartitem` and `orderitem` between carts/orders and products.

## Validation Before Final Submission

Confirm the remaining table definitions (especially `user`, `cart`, and `order`) using `SHOW CREATE TABLE` so that cardinalities, nullability, and referential actions in the final ER diagram accurately match the deployed database.
