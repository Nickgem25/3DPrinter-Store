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
| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `brand_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | Unique brand identifier |
| `brand_name` | VARCHAR(50) | UNIQUE, NOT NULL | Name of the product manufacturer or brand |

## `category`
| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `category_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | Unique category identifier |
| `category_name` | VARCHAR(50) | UNIQUE, NOT NULL | Name of the product category |

## `product`
| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `product_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | Unique product identifier |
| `sku` | VARCHAR(50) | UNIQUE, NOT NULL | Unique stock keeping unit code |
| `product_name` | VARCHAR(150) | NOT NULL | Product display name |
| `description` | TEXT | NULL, DEFAULT NULL | Product description and specifications |
| `image_url` | VARCHAR(255) | NULL, DEFAULT NULL | Product image URL or file path |
| `unit_price` | DECIMAL(10,2) | NOT NULL, CHECK (unit_price >= 0) | Current selling price |
| `stock_quantity` | INT(11) | NOT NULL, DEFAULT 0, CHECK (stock_quantity >= 0) | Available inventory quantity |
| `brand_id` | INT(11) | FK → brand.brand_id, NULL, DEFAULT NULL | Associated brand |
| `category_id` | INT(11) | FK → category.category_id, NULL, DEFAULT NULL | Associated category |
| `is_active` | TINYINT(1) | NOT NULL, DEFAULT 1 | Product availability: 1 = active, 0 = hidden |


## `cart`
| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `cart_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | Unique shopping cart identifier |
| `user_id` | INT(11) | FK → user.user_id, UNIQUE, NOT NULL, ON DELETE CASCADE | User who owns the shopping cart |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Cart creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last cart update timestamp |

## `cartitem`
| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `cart_item_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | Unique cart item identifier |
| `cart_id` | INT(11) | FK → cart.cart_id, NOT NULL, ON DELETE CASCADE | Shopping cart containing this item |
| `product_id` | INT(11) | FK → product.product_id, NOT NULL, ON DELETE CASCADE | Product added to the cart |
| `quantity` | INT(11) | NOT NULL, DEFAULT 1, CHECK (quantity > 0) | Quantity of the selected product |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Time the product was added to the cart |

## `order`
| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `order_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | Unique order identifier |
| `user_id` | INT(11) | FK → user.user_id, NOT NULL, ON DELETE CASCADE | User who placed the order |
| `order_date` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date and time the order was placed |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Total amount recorded at checkout |
| `shipping_address` | TEXT | NOT NULL | Shipping address for this order |
| `status` | ENUM('Pending','Paid','Shipped','Delivered','Cancelled') | NOT NULL, DEFAULT 'Pending' | Current order status |

## `orderitem`
| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `order_item_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | Unique order item identifier |
| `order_id` | INT(11) | FK → order.order_id, NOT NULL | Parent order containing this item |
| `product_id` | INT(11) | FK → product.product_id, NULL, DEFAULT NULL, ON DELETE SET NULL | Referenced product, if it still exists |
| `quantity` | INT(11) | NOT NULL, CHECK (quantity > 0) | Number of units purchased |
| `price_at_purchase` | DECIMAL(10,2) | NOT NULL, CHECK (price_at_purchase >= 0) | Unit price recorded at checkout |
| `product_name_at_purchase` | VARCHAR(150) | NULL, DEFAULT NULL | Product name saved at the time of purchase |
| `sku_at_purchase` | VARCHAR(50) | NULL, DEFAULT NULL | Product SKU saved at the time of purchase |