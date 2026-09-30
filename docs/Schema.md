## Entities

To support the business operations of the FDM 3D Printer & Maker Hardware Store, the database consists of 6 core entities:

1. **`Customer`:** Stores customer personal profiles, credentials, contact information, and shipping addresses.
2. **`Brand`:** Stores information about manufacturers and brands (e.g., Bambu Lab, Creality, eSUN, Polymaker, Sunlu).
3. **`Category`:** Classifies products into distinct types (*FDM 3D Printers*, *Filaments*, *Nozzles & Hotends*, *Fasteners & Inserts*, *Maker Tools*).
4. **`Product`:** Stores catalog items, SKUs, product descriptions, unit pricing, and real-time inventory stock levels.
5. **`Order`:** Tracks transaction header details including buyer reference, order date, total cost, shipping location, and fulfillment status.
6. **`OrderItem`:** An associative entity that tracks individual product line items, quantities, and historical purchase prices for each order.

---

## Entity Relationships

The business logic defines the following cardinalities between entities:

* **Customer to Order ($1 : N$):** A customer can place zero, one, or many orders. Each order must belong to exactly one customer.
* **Brand to Product ($1 : N$):** A brand can manufacture and list many products. Each product belongs to exactly one brand.
* **Category to Product ($1 : N$):** A category can contain many products. Each product belongs to exactly one category.
* **Order to Product ($M : N$):** An order can contain multiple products, and a product can appear in multiple orders over time.

---

## Relationship Optimization

To eliminate data redundancy, prevent update anomalies, and adhere to **3rd Normal Form (3NF)**, the Many-to-Many ($M : N$) relationship between **`Order`** and **`Product`** is resolved by introducing the **`OrderItem`** associative entity (junction table).

This converts the $M : N$ relationship into two normalized One-to-Many ($1 : N$) relationships:
* **`Order` $\rightarrow$ `OrderItem` ($1 : N$):** One order can contain multiple line items.
* **`Product` $\rightarrow$ `OrderItem` ($1 : N$):** One product can be listed in multiple line items across different orders.

---

## Attribute Definition

### 1. Entity: `Customer`
| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `customer_id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Unique identification number for each customer |
| `email` | `VARCHAR(100)` | UNIQUE, NOT NULL | Account login email address |
| `password_hash` | `VARCHAR(255)` | NOT NULL | Encrypted user password |
| `full_name` | `VARCHAR(100)` | NOT NULL | Customer's full name |
| `phone` | `VARCHAR(20)` | NOT NULL | Contact telephone number |
| `address` | `TEXT` | NOT NULL | Default shipping address |
| `created_at` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

---

### 2. Entity: `Brand`
| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `brand_id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Unique identification number for each brand |
| `brand_name` | `VARCHAR(50)` | UNIQUE, NOT NULL | Brand name (e.g., Bambu Lab, eSUN, Creality) |

---

### 3. Entity: `Category`
| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `category_id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Unique identification number for each category |
| `category_name` | `VARCHAR(50)` | UNIQUE, NOT NULL | Category name (e.g., FDM Printers, Filaments) |

---

### 4. Entity: `Product`
| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `product_id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Unique identification number for each product |
| `sku` | `VARCHAR(50)` | UNIQUE, NOT NULL | Stock Keeping Unit code |
| `product_name` | `VARCHAR(150)` | NOT NULL | Name of the product or machine |
| `description` | `TEXT` | NULL | Product specifications and details |
| `unit_price` | `DECIMAL(10,2)` | NOT NULL | Current retail price |
| `stock_quantity` | `INT` | NOT NULL, DEFAULT 0 | Current available stock quantity |
| `brand_id` | `INT` | FOREIGN KEY -> `Brand(brand_id)` | Reference to the brand |
| `category_id` | `INT` | FOREIGN KEY -> `Category(category_id)` | Reference to the product category |

---

### 5. Entity: `Order`
| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `order_id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Unique identification number for each order |
| `customer_id` | `INT` | FOREIGN KEY -> `Customer(customer_id)` | Reference to the purchasing customer |
| `order_date` | `TIMESTAMP` | DEFAULT CURRENT_TIMESTAMP | Order creation date and time |
| `total_amount` | `DECIMAL(10,2)` | NOT NULL | Total cost of the order |
| `shipping_address` | `TEXT` | NOT NULL | Shipping address specified for this order |
| `status` | `VARCHAR(20)` | DEFAULT 'Pending' | Order status (e.g., Pending, Paid, Shipped) |

---

### 6. Entity: `OrderItem`
| Column Name | Data Type | Constraints / Keys | Description |
| :--- | :--- | :--- | :--- |
| `order_item_id` | `INT` | PRIMARY KEY, AUTO_INCREMENT | Unique identification number for each line item |
| `order_id` | `INT` | FOREIGN KEY -> `Order(order_id)` | Reference to the parent order |
| `product_id` | `INT` | FOREIGN KEY -> `Product(product_id)` | Reference to the purchased product |
| `quantity` | `INT` | NOT NULL | Quantity of the product ordered |
| `price_at_purchase` | `DECIMAL(10,2)` | NOT NULL | Historical unit price locked at time of sale |