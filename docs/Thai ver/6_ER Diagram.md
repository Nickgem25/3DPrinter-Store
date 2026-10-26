# 06_ER_Diagram — แผนภาพ ER แบบ Crow’s Foot

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

**หมายเหตุในการตีความแผนภาพ**
- `USER` ต่อ `CART`: แอปพลิเคชันกำหนดให้ผู้ใช้มีตะกร้าได้ไม่เกินหนึ่งใบ (`cart.user_id` เป็น UNIQUE) และอาจสร้างตะกร้าเมื่อต้องใช้งาน
- `ORDERITEM.product_id` ยอมรับ `NULL` และใช้ **ON DELETE SET NULL** โดยชื่อสินค้า SKU และราคาที่บันทึกไว้จะคงอยู่ในประวัติการสั่งซื้อ
- `CARTITEM.product_id` ใช้ **ON DELETE CASCADE**
- `PRODUCT.brand_id` และ `PRODUCT.category_id` เป็น `NULL` ได้ จึงอาจไม่มีแบรนด์หรือหมวดหมู่ หรือมีอย่างละหนึ่งรายการ
- แผนภาพใช้ความสัมพันธ์และฟิลด์ที่ตรวจสอบได้ร่วมกับข้อกำหนดระดับแอปพลิเคชันบางส่วน ก่อนส่งงานควรตรวจ `SHOW CREATE TABLE` ของ `user`, `brand`, `category`, `cart` และ `order` เพื่อยืนยันข้อกำหนดทุกจุด โดยการบังคับว่าออร์เดอร์ต้องมีสินค้าอย่างน้อยหนึ่งรายการเป็นกฎธุรกิจ ไม่ได้หมายความว่า FK บังคับได้โดยตรง

