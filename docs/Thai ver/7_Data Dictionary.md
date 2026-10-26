# 7. พจนานุกรมข้อมูล (Data Dictionary) — 3DPrinter-Store

เอกสารฉบับร่างนี้อ้างอิงชื่อตารางและคอลัมน์ที่ตรวจสอบจากโค้ด backend ปัจจุบัน รวมทั้งความสัมพันธ์ที่จัดทำไว้ก่อนหน้า **ประเภทข้อมูลที่ระบุว่า (ต้องตรวจสอบ) ไม่ใช่ผลจาก `SHOW CREATE TABLE`** และต้องยืนยันกับฐานข้อมูลจริงก่อนส่งงาน


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

| แอตทริบิวต์ | ชนิดข้อมูล (รอยืนยัน) | คีย์ / ข้อจำกัดที่ทราบ | คำอธิบาย |
|---|---|---|---|
| `brand_id` | INT (ต้องตรวจสอบ) | PK | รหัสแบรนด์ |
| `brand_name` | VARCHAR (ต้องตรวจสอบ) | — | ชื่อแบรนด์ |

## `category`

| แอตทริบิวต์ | ชนิดข้อมูล (รอยืนยัน) | คีย์ / ข้อจำกัดที่ทราบ | คำอธิบาย |
|---|---|---|---|
| `category_id` | INT (ต้องตรวจสอบ) | PK | รหัสหมวดหมู่ |
| `category_name` | VARCHAR (ต้องตรวจสอบ) | — | ชื่อหมวดหมู่ |

## `product`

| แอตทริบิวต์ | ชนิดข้อมูล (รอยืนยัน) | คีย์ / ข้อจำกัดที่ทราบ | คำอธิบาย |
|---|---|---|---|
| `product_id` | INT (ต้องตรวจสอบ) | PK | รหัสสินค้า |
| `sku` | VARCHAR (ต้องตรวจสอบ) | UNIQUE | รหัส SKU ที่ไม่ซ้ำ |
| `product_name` | VARCHAR (ต้องตรวจสอบ) | — | ชื่อสินค้า |
| `description` | TEXT (ต้องตรวจสอบ) | — | รายละเอียดสินค้า |
| `image_url` | VARCHAR/TEXT (ต้องตรวจสอบ) | — | พาธหรือ URL ของรูปสินค้า |
| `unit_price` | DECIMAL(10,2) (ต้องตรวจสอบ) | — | ราคาขายปัจจุบัน |
| `stock_quantity` | INT (ต้องตรวจสอบ) | — | จำนวนสินค้าคงคลัง |
| `is_active` | TINYINT/BOOLEAN (ต้องตรวจสอบ) | — | สถานะการแสดงสินค้า |
| `brand_id` | INT (ต้องตรวจสอบ) | FK → brand.brand_id | รหัสแบรนด์ที่เชื่อมโยง |
| `category_id` | INT (ต้องตรวจสอบ) | FK → category.category_id | รหัสหมวดหมู่ที่เชื่อมโยง |

## `cart`

| แอตทริบิวต์ | ชนิดข้อมูล (รอยืนยัน) | คีย์ / ข้อจำกัดที่ทราบ | คำอธิบาย |
|---|---|---|---|
| `cart_id` | INT (ต้องตรวจสอบ) | PK | รหัสตะกร้า |
| `user_id` | INT (ต้องตรวจสอบ) | FK → user.user_id; UNIQUE (per application) | เจ้าของตะกร้า; หนึ่งตะกร้าประจำต่อผู้ใช้ |

## `cartitem`

| แอตทริบิวต์ | ชนิดข้อมูล (รอยืนยัน) | คีย์ / ข้อจำกัดที่ทราบ | คำอธิบาย |
|---|---|---|---|
| `cart_item_id` | INT (ต้องตรวจสอบ) | PK | รหัสรายการในตะกร้า |
| `cart_id` | INT (ต้องตรวจสอบ) | FK → cart.cart_id | รหัสตะกร้า |
| `product_id` | INT (ต้องตรวจสอบ) | FK → product.product_id; ON DELETE CASCADE (previously configured) | รหัสสินค้า |
| `quantity` | INT (ต้องตรวจสอบ) | — | จำนวนสินค้าที่เลือก |

## `order`

| แอตทริบิวต์ | ชนิดข้อมูล (รอยืนยัน) | คีย์ / ข้อจำกัดที่ทราบ | คำอธิบาย |
|---|---|---|---|
| `order_id` | INT (ต้องตรวจสอบ) | PK | รหัสคำสั่งซื้อ |
| `user_id` | INT (ต้องตรวจสอบ) | FK → user.user_id | รหัสผู้ซื้อ |
| `order_date` | TIMESTAMP (ต้องตรวจสอบ) | — | วันเวลาที่สั่งซื้อ |
| `total_amount` | DECIMAL(10,2) (ต้องตรวจสอบ) | — | ยอดรวมขณะชำระเงิน |
| `shipping_address` | TEXT (ต้องตรวจสอบ) | — | ที่อยู่จัดส่งของคำสั่งซื้อนี้ |
| `status` | ENUM (ต้องตรวจสอบ) | ENUM (as referenced in backend) | สถานะคำสั่งซื้อ: Pending/Paid/Shipped/Delivered/Cancelled |

## `orderitem`

| แอตทริบิวต์ | ชนิดข้อมูล (รอยืนยัน) | คีย์ / ข้อจำกัดที่ทราบ | คำอธิบาย |
|---|---|---|---|
| `order_item_id` | INT (ต้องตรวจสอบ) | PK | รหัสรายการสั่งซื้อ |
| `order_id` | INT (ต้องตรวจสอบ) | FK → order.order_id | รหัสคำสั่งซื้อ |
| `product_id` | INT (ต้องตรวจสอบ) | FK → product.product_id; ON DELETE SET NULL (previously configured) | รหัสสินค้าที่ซื้อ; อาจเป็น NULL หลังลบสินค้า |
| `product_name_at_purchase` | VARCHAR (ต้องตรวจสอบ) | — | ชื่อสินค้าที่บันทึกเมื่อสั่งซื้อ |
| `sku_at_purchase` | VARCHAR (ต้องตรวจสอบ) | — | SKU ที่บันทึกเมื่อสั่งซื้อ |
| `quantity` | INT (ต้องตรวจสอบ) | — | จำนวนสินค้าที่ซื้อ |
| `price_at_purchase` | DECIMAL(10,2) (ต้องตรวจสอบ) | — | ราคาต่อหน่วยเมื่อสั่งซื้อ |

## การตรวจสอบก่อนส่งงาน

ใน DBeaver ให้รันคำสั่งต่อไปนี้ **ทีละคำสั่ง** แล้วใช้ผลลัพธ์เพื่อแก้ไขชนิดข้อมูล `NULL` / `NOT NULL`, `DEFAULT`, `AUTO_INCREMENT`, ดัชนี, `UNIQUE`, และกฎ `ON DELETE` ให้ตรงกับฐานข้อมูลจริง:

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

**ข้อสังเกต:** โค้ดยืนยันว่า `cart.user_id` ออกแบบให้ไม่ซ้ำ และ `cartitem` ใช้ `ON DUPLICATE KEY UPDATE` กับคู่ `(cart_id, product_id)` แต่ต้องตรวจสอบการประกาศ constraint จริงใน MariaDB ด้วย. ไฟล์ `docs/Schema.md` เดิมอธิบาย 6 เอนทิตี ไม่ใช่โครงสร้าง 8 ตารางล่าสุด จึงไม่ควรใช้แทนการตรวจสอบ.
