# 06_ER_Diagram — Crow’s Foot

```mermaid
erDiagram
    USER ||--o| CART : owns
    USER ||--o{ ORDER : places
    BRAND |o--o{ PRODUCT : identifies
    CATEGORY |o--o{ PRODUCT : classifies
    CART ||--o{ CARTITEM : contains
    PRODUCT ||--o{ CARTITEM : appears_in
    ORDER ||--|{ ORDERITEM : contains
    PRODUCT |o--o{ ORDERITEM : historically_referenced_by

    USER {
        int user_id PK
        string email UK
        string password_hash
        string full_name
        string role
    }
    BRAND {
        int brand_id PK
        string brand_name
    }
    CATEGORY {
        int category_id PK
        string category_name
    }
    PRODUCT {
        int product_id PK
        string sku UK
        string product_name
        string description
        string image_url
        decimal unit_price
        int stock_quantity
        boolean is_active
        int brand_id FK
        int category_id FK
    }
    CART {
        int cart_id PK
        int user_id FK,UK
    }
    CARTITEM {
        int cart_item_id PK
        int cart_id FK
        int product_id FK
        int quantity
    }
    ORDER {
        int order_id PK
        int user_id FK
        decimal total_amount
        string shipping_address
        string status
    }
    ORDERITEM {
        int order_item_id PK
        int order_id FK
        int product_id FK "nullable after deletion"
        string product_name_at_purchase
        string sku_at_purchase
        int quantity
        decimal price_at_purchase
    }
```

**Notes on interpretation**
- `USER` to `CART`: the application intends at most one cart per user (`cart.user_id` is UNIQUE), although a cart may be created only when needed.
- `ORDERITEM.product_id` is nullable and uses **ON DELETE SET NULL**; the stored name, SKU and price preserve order history.
- `CARTITEM.product_id` uses **ON DELETE CASCADE**.
- `PRODUCT.brand_id` and `PRODUCT.category_id` are nullable. A product can therefore have zero or one brand/category.
- The diagram reflects confirmed relationships and fields plus a few application-level assumptions; confirm the full `SHOW CREATE TABLE` output for `user`, `brand`, `category`, `cart` and `order` before final submission. In particular, mandatory participation (such as an order always having items) is a business rule, not necessarily enforced by a foreign key.

