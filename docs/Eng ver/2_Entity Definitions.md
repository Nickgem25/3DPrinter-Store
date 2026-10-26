# 2. Entity Definitions
## 3DPrinter-Store Database Project

### Objective
Identify the principal entities used to manage accounts, the product catalog, shopping carts, and orders in the implemented MariaDB database. This section defines **what each entity represents**. Detailed attributes, keys, and constraints will be documented separately in the Data Dictionary (Requirement 7), while cardinalities and deletion actions will be covered under Requirements 3–4.

### Entity inventory

| No. | Entity (actual table name) | Description | Main responsibility |
|---|---|---|---|
| 1 | `user` | A registered account, including customers and administrators. | Holds account details and identifies who owns carts and places orders. |
| 2 | `brand` | A manufacturer or brand associated with store products. | Organizes products by brand for catalog management and filtering. |
| 3 | `category` | A classification of products by type. | Groups products such as printers, filaments, and hardware for browsing. |
| 4 | `product` | A purchasable product listing maintained by the store. | Holds SKU, name, description, image path, selling price, stock, visibility status, and optional brand/category associations. |
| 5 | `cart` | A shopping cart associated with a user. | Groups products a user intends to purchase before checkout. |
| 6 | `cartitem` | One product selection within a cart. | Records the chosen product and requested quantity; connects carts to products. |
| 7 | `order` | A checkout transaction placed by a user. | Stores the order header, such as purchase date, shipping address, total, and status. |
| 8 | `orderitem` | An individual purchased line item within an order. | Preserves quantity, price at purchase, and the historical product name and SKU even if the original product is later deleted. |

### Entity notes

#### `user`
Represents an authenticated account. Roles separate normal customer access from administrative operations. A user can have shopping-cart and order records associated with the account.

#### `brand`
Represents a manufacturer or product brand (for example, Bambu Lab or Creality). Brand records are reused by multiple product listings, avoiding repeated brand descriptions in each product row.

#### `category`
Represents a product classification (for example, FDM 3D Printers or Filaments). Categories support the store's filtering and organization features.

#### `product`
Represents an inventory listing, identified by its product ID and unique SKU. Product records hold current selling information. A product may be active, hidden (soft-deleted), or permanently removed according to admin actions.

#### `cart`
Represents a user's collection of potential purchases. It acts as the header for the cart's individual selections.

#### `cartitem`
Represents a selected product and a positive quantity in a particular cart. This is an associative entity between `cart` and `product`.

#### `order`
Represents an order placed through checkout, linked to the purchasing user. The order remains an independent record of the transaction and its fulfillment status.

#### `orderitem`
Represents a purchased line item. It is an associative entity connecting `order` to `product` when a product still exists. The saved product name, SKU, quantity, and purchase price preserve transaction history. The `product_id` reference is nullable, so a permanent deletion can set it to `NULL` without deleting the line item.

### Scope and distinction
- The **product catalog** uses `brand`, `category`, and `product`.
- The **shopping workflow** uses `user`, `cart`, and `cartitem`.
- The **order workflow** uses `user`, `order`, and `orderitem`.
- `cartitem` and `orderitem` are **separate entities** because a cart selection and a completed purchase record serve different purposes.
- The database currently contains **eight tables**, confirmed by `SHOW TABLES` in MariaDB.

> **Documentation note:** This document reflects the project's current eight-entity design, including historical order-item snapshots and the nullable product reference used for permanent deletion. It intentionally does not rely on older design documents that describe only six entities.
