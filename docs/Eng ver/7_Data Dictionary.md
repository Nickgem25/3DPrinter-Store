# 7. Data Dictionary — 3DPrinter-Store

This working draft uses table/column names verified in current backend code, plus previously configured relationships. **Any type marked (verify) is a hypothesis, not output from `SHOW CREATE TABLE`**; confirm against the live MariaDB database before submission.


## `user`

| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `user_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Account email address |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed account password |
| `full_name` | VARCHAR(100) | NOT NULL | User's full name |
| `phone` | VARCHAR(20) | NULL, DEFAULT NULL | Contact phone number |
| `address` | TEXT | NULL, DEFAULT NULL | User's address |
| `role` | ENUM('customer','employee','admin') | NOT NULL, DEFAULT 'customer' | User account role |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |


## `brand`

| Attribute | Data type (pending verification) | Known keys / constraints | Description |
|---|---|---|---|
| `brand_id` | INT (verify) | PK | Brand identifier |
| `brand_name` | VARCHAR (verify) | — | Brand name |

## `category`

| Attribute | Data type (pending verification) | Known keys / constraints | Description |
|---|---|---|---|
| `category_id` | INT (verify) | PK | Category identifier |
| `category_name` | VARCHAR (verify) | — | Category name |

## `product`

| Attribute | Data type (pending verification) | Known keys / constraints | Description |
|---|---|---|---|
| `product_id` | INT (verify) | PK | Product identifier |
| `sku` | VARCHAR (verify) | UNIQUE | Stock keeping unit; unique |
| `product_name` | VARCHAR (verify) | — | Product display name |
| `description` | TEXT (verify) | — | Product description |
| `image_url` | VARCHAR/TEXT (verify) | — | Product image path/URL |
| `unit_price` | DECIMAL(10,2) (verify) | — | Current selling price |
| `stock_quantity` | INT (verify) | — | Available stock units |
| `is_active` | TINYINT/BOOLEAN (verify) | — | Visibility/availability flag |
| `brand_id` | INT (verify) | FK → brand.brand_id | Linked brand |
| `category_id` | INT (verify) | FK → category.category_id | Linked category |

## `cart`

| Attribute | Data type (pending verification) | Known keys / constraints | Description |
|---|---|---|---|
| `cart_id` | INT (verify) | PK | Cart identifier |
| `user_id` | INT (verify) | FK → user.user_id; UNIQUE (per application) | Owner; one persistent cart per user |

## `cartitem`

| Attribute | Data type (pending verification) | Known keys / constraints | Description |
|---|---|---|---|
| `cart_item_id` | INT (verify) | PK | Cart line identifier |
| `cart_id` | INT (verify) | FK → cart.cart_id | Parent cart |
| `product_id` | INT (verify) | FK → product.product_id; ON DELETE CASCADE (previously configured) | Selected product |
| `quantity` | INT (verify) | — | Requested units |

## `order`

| Attribute | Data type (pending verification) | Known keys / constraints | Description |
|---|---|---|---|
| `order_id` | INT (verify) | PK | Order identifier |
| `user_id` | INT (verify) | FK → user.user_id | Buyer |
| `order_date` | TIMESTAMP (verify) | — | Order placement time |
| `total_amount` | DECIMAL(10,2) (verify) | — | Order total at checkout |
| `shipping_address` | TEXT (verify) | — | Address used for this order |
| `status` | ENUM (verify) | ENUM (as referenced in backend) | Order state: Pending/Paid/Shipped/Delivered/Cancelled |

## `orderitem`

| Attribute | Data type (pending verification) | Known keys / constraints | Description |
|---|---|---|---|
| `order_item_id` | INT (verify) | PK | Order line identifier |
| `order_id` | INT (verify) | FK → order.order_id | Parent order |
| `product_id` | INT (verify) | FK → product.product_id; ON DELETE SET NULL (previously configured) | Purchased product; may be NULL after deletion |
| `product_name_at_purchase` | VARCHAR (verify) | — | Product name captured at checkout |
| `sku_at_purchase` | VARCHAR (verify) | — | SKU captured at checkout |
| `quantity` | INT (verify) | — | Quantity purchased |
| `price_at_purchase` | DECIMAL(10,2) (verify) | — | Unit price captured at checkout |

## Verify against the live database before submission

In DBeaver, run each statement and update the data types, `NULL` / `NOT NULL`, defaults, `AUTO_INCREMENT`, indexes, `UNIQUE` keys, and `ON DELETE` actions using the actual definitions:

```sql
SHOW CREATE TABLE `user`;
SHOW CREATE TABLE `brand`;
SHOW CREATE TABLE `category`;
SHOW CREATE TABLE `product`;
SHOW CREATE TABLE `cart`;
SHOW CREATE TABLE `cartitem`;
SHOW CREATE TABLE `order`;
SHOW CREATE TABLE `orderitem`;
```

**Notes:** Current code expects `cart.user_id` to be unique and uses an upsert implying a unique `(cart_id, product_id)` pair in `cartitem`; verify the actual constraints. The older `docs/Schema.md` describes six entities, not the current eight-table implementation, and must not be treated as authoritative schema evidence.
