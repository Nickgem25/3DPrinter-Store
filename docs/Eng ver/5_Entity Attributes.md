# 5. Entity Attributes

## 3DPrinter-Store Database Project

This document describes the attributes of the eight entities in the implemented MariaDB database. **Verified** means checked against the `SHOW CREATE TABLE` output provided for `product`, `cartitem`, and `orderitem` (after the product-deletion migration). **To verify** means that the full live table definition has not yet been supplied; types and constraints should not be assumed.

**Notation:** PK = primary key; FK = foreign key; UQ = unique; NULL = optional.

## 5.1 `user` — Customer and administrator accounts

| Attribute | Role | Description | Schema status |
|---|---|---|---|
| `user_id` | PK | Unique identifier for an account | Type/constraints to verify |
| `full_name` | — | User's display or full name | Type/constraints to verify |
| `email` | Candidate key | Login email address | Confirm UNIQUE in live schema |
| `password_hash` | — | Secure password hash, not a plaintext password | Type/constraints to verify |
| `address` | — | Saved shipping address, used when checkout does not supply one | Type/constraints to verify |
| `role` | — | Customer or administrator authorization role | Type/allowed values to verify |

> Other user fields, if present (such as `phone` or timestamps), must be added after inspecting `SHOW CREATE TABLE user`.

## 5.2 `brand` — Manufacturers

| Attribute | Role | Description | Schema status |
|---|---|---|---|
| `brand_id` | PK | Unique brand identifier; referenced by products | Type/constraints to verify |
| `brand_name` | — | Manufacturer or brand name | Confirm length, nullability, UNIQUE |

## 5.3 `category` — Product classifications

| Attribute | Role | Description | Schema status |
|---|---|---|---|
| `category_id` | PK | Unique category identifier | Type/constraints to verify |
| `category_name` | — | Category name shown by filters | Confirm length, nullability, UNIQUE |

## 5.4 `product` — Sellable catalog items (**verified**)

| Attribute | MariaDB type | Key / constraint | Description |
|---|---|---|---|
| `product_id` | `INT(11)` | PK, AUTO_INCREMENT, NOT NULL | Product identifier |
| `sku` | `VARCHAR(50)` | UQ, NOT NULL | Stock-keeping unit |
| `product_name` | `VARCHAR(150)` | NOT NULL | Product name |
| `description` | `TEXT` | NULL | Product details |
| `image_url` | `VARCHAR(255)` | NULL | Relative URL or image path |
| `unit_price` | `DECIMAL(10,2)` | NOT NULL, CHECK ≥ 0 | Current selling price |
| `stock_quantity` | `INT(11)` | NOT NULL, DEFAULT 0, CHECK ≥ 0 | Units in stock |
| `brand_id` | `INT(11)` | FK → `brand.brand_id`, NULL | Assigned brand |
| `category_id` | `INT(11)` | FK → `category.category_id`, NULL | Assigned category |
| `is_active` | `TINYINT(1)` | NOT NULL, DEFAULT 1 | Storefront visibility / soft-delete flag |

## 5.5 `cart` — User shopping carts

| Attribute | Role | Description | Schema status |
|---|---|---|---|
| `cart_id` | PK | Cart identifier | Type/constraints to verify |
| `user_id` | FK → `user.user_id` | Cart owner | Confirm nullability and whether UNIQUE enforces one cart per user |

> Any additional timestamps and the FK's deletion rule require the live DDL.

## 5.6 `cartitem` — Items selected in a cart (**verified**)

| Attribute | MariaDB type | Key / constraint | Description |
|---|---|---|---|
| `cart_item_id` | `INT(11)` | PK, AUTO_INCREMENT, NOT NULL | Cart-line identifier |
| `cart_id` | `INT(11)` | FK → `cart.cart_id`, NOT NULL | Owning cart; ON DELETE CASCADE |
| `product_id` | `INT(11)` | FK → `product.product_id`, NOT NULL | Selected product; ON DELETE CASCADE |
| `quantity` | `INT(11)` | NOT NULL, DEFAULT 1, CHECK > 0 | Selected units |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Time added |

**Composite uniqueness:** `UNIQUE (cart_id, product_id)` ensures a product occurs at most once per cart.

## 5.7 `order` — Customer purchase headers

| Attribute | Role | Description | Schema status |
|---|---|---|---|
| `order_id` | PK | Order identifier | Type/constraints to verify |
| `user_id` | FK → `user.user_id` | Customer who placed the order | Type/constraints to verify |
| `order_date` | — | Date/time placed | Type/default to verify |
| `total_amount` | — | Amount recorded at checkout | Type/check to verify |
| `shipping_address` | — | Shipping destination captured for the order | Type/nullability to verify |
| `status` | — | Order lifecycle status: Pending, Paid, Shipped, Delivered, Cancelled in backend | Confirm live ENUM or other constraint |

> The backend defines permitted status transitions; they are application rules, not necessarily database CHECK constraints.

## 5.8 `orderitem` — Purchased product lines (**verified with migration notes**)

| Attribute | MariaDB type | Key / constraint | Description |
|---|---|---|---|
| `order_item_id` | `INT(11)` | PK, AUTO_INCREMENT, NOT NULL | Purchase-line identifier |
| `order_id` | `INT(11)` | FK → `order.order_id`, NOT NULL | Parent order |
| `product_id` | `INT(11)` | FK → `product.product_id`, NULL, ON DELETE SET NULL | Live product reference, or NULL after hard deletion |
| `product_name_at_purchase` | `VARCHAR(150)` | NULL (added during migration) | Saved product name at purchase |
| `sku_at_purchase` | `VARCHAR(50)` | NULL (added during migration) | Saved SKU at purchase |
| `quantity` | `INT(11)` | NOT NULL, CHECK > 0 | Purchased units |
| `price_at_purchase` | `DECIMAL(10,2)` | NOT NULL, CHECK ≥ 0 | Historical unit price |

The name and SKU snapshot columns were introduced as nullable columns and backfilled for existing orders. New orders should populate both at checkout. `orderitem` survives permanent product deletion because the product FK uses `ON DELETE SET NULL`.

## 5.9 Why some attributes are repeated in `orderitem`

Although the current catalog contains the current `product_name`, `sku`, and `unit_price`, an order needs a **historical snapshot**. Product prices and names may change, and products may be permanently removed. Therefore `price_at_purchase`, `product_name_at_purchase`, and `sku_at_purchase` retain the facts of the original transaction; this is deliberate historical data, not an accidental duplication.

## 5.10 Final verification required

Before submission, compare this report against:

```sql
SHOW CREATE TABLE `user`;
SHOW CREATE TABLE brand;
SHOW CREATE TABLE category;
SHOW CREATE TABLE cart;
SHOW CREATE TABLE `order`;
SHOW CREATE TABLE orderitem;
```

The first five statements confirm remaining column types, unique constraints, optional attributes, and deletion rules. The final statement reconfirms the migrated `orderitem` structure. Update all entries marked **To verify** using the actual DDL before treating this as the final data dictionary. Requirement 7 will provide the exhaustive, DDL-verified data dictionary.
