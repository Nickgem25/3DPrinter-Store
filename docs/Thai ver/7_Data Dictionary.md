# 7. พจนานุกรมข้อมูล (Data Dictionary) — 3DPrinter-Store

## `user` — ข้อมูลผู้ใช้งาน
| แอตทริบิวต์ | ชนิดข้อมูล | คีย์ / ข้อกำหนด | คำอธิบาย |
|---|---|---|---|
| `user_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | รหัสประจำตัวผู้ใช้งาน |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | อีเมลสำหรับเข้าสู่ระบบ |
| `password_hash` | VARCHAR(255) | NOT NULL | รหัสผ่านที่ผ่านการแฮช |
| `full_name` | VARCHAR(100) | NOT NULL | ชื่อ-นามสกุลของผู้ใช้งาน |
| `phone` | VARCHAR(20) | NULL, DEFAULT NULL | หมายเลขโทรศัพท์ |
| `address` | TEXT | NULL, DEFAULT NULL | ที่อยู่ของผู้ใช้งาน |
| `role` | ENUM('customer','employee','admin') | NOT NULL, DEFAULT 'customer' | บทบาทของผู้ใช้งานในระบบ |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่สร้างบัญชี |

## `brand` — ข้อมูลแบรนด์สินค้า
| แอตทริบิวต์ | ชนิดข้อมูล | คีย์ / ข้อกำหนด | คำอธิบาย |
|---|---|---|---|
| `brand_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | รหัสประจำแบรนด์สินค้า |
| `brand_name` | VARCHAR(50) | UNIQUE, NOT NULL | ชื่อแบรนด์หรือผู้ผลิตสินค้า |

## `category` — ข้อมูลหมวดหมู่สินค้า
| แอตทริบิวต์ | ชนิดข้อมูล | คีย์ / ข้อกำหนด | คำอธิบาย |
|---|---|---|---|
| `category_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | รหัสประจำหมวดหมู่สินค้า |
| `category_name` | VARCHAR(50) | UNIQUE, NOT NULL | ชื่อหมวดหมู่สินค้า |

## `product` — ข้อมูลสินค้า
| แอตทริบิวต์ | ชนิดข้อมูล | คีย์ / ข้อกำหนด | คำอธิบาย |
|---|---|---|---|
| `product_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | รหัสประจำสินค้า |
| `sku` | VARCHAR(50) | UNIQUE, NOT NULL | รหัสสินค้าเฉพาะสำหรับการจัดการสินค้าคงคลัง |
| `product_name` | VARCHAR(150) | NOT NULL | ชื่อสินค้า |
| `description` | TEXT | NULL, DEFAULT NULL | รายละเอียดและคุณสมบัติของสินค้า |
| `image_url` | VARCHAR(255) | NULL, DEFAULT NULL | ที่อยู่ URL หรือพาธของรูปภาพสินค้า |
| `unit_price` | DECIMAL(10,2) | NOT NULL, CHECK (unit_price >= 0) | ราคาขายต่อหน่วย โดยต้องไม่ติดลบ |
| `stock_quantity` | INT(11) | NOT NULL, DEFAULT 0, CHECK (stock_quantity >= 0) | จำนวนสินค้าคงคลัง โดยต้องไม่ติดลบ |
| `brand_id` | INT(11) | FK → brand.brand_id, NULL, DEFAULT NULL | รหัสแบรนด์ของสินค้า |
| `category_id` | INT(11) | FK → category.category_id, NULL, DEFAULT NULL | รหัสหมวดหมู่ของสินค้า |
| `is_active` | TINYINT(1) | NOT NULL, DEFAULT 1 | สถานะการแสดงสินค้า โดย 1 = แสดงสินค้า และ 0 = ซ่อนสินค้า |

## `cart` — ข้อมูลตะกร้าสินค้า
| แอตทริบิวต์ | ชนิดข้อมูล | คีย์ / ข้อกำหนด | คำอธิบาย |
|---|---|---|---|
| `cart_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | รหัสประจำตะกร้าสินค้า |
| `user_id` | INT(11) | FK → user.user_id, UNIQUE, NOT NULL, ON DELETE CASCADE | รหัสผู้ใช้งานที่เป็นเจ้าของตะกร้าสินค้า |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่สร้างตะกร้าสินค้า |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | วันและเวลาที่แก้ไขข้อมูลตะกร้าสินค้าล่าสุด |

## `cartitem` — ข้อมูลรายการสินค้าในตะกร้า
| แอตทริบิวต์ | ชนิดข้อมูล | คีย์ / ข้อกำหนด | คำอธิบาย |
|---|---|---|---|
| `cart_item_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | รหัสประจำรายการสินค้าในตะกร้า |
| `cart_id` | INT(11) | FK → cart.cart_id, NOT NULL, ON DELETE CASCADE | รหัสตะกร้าสินค้าที่เก็บรายการนี้ |
| `product_id` | INT(11) | FK → product.product_id, NOT NULL, ON DELETE CASCADE | รหัสสินค้าที่ถูกเพิ่มลงในตะกร้า |
| `quantity` | INT(11) | NOT NULL, DEFAULT 1, CHECK (quantity > 0) | จำนวนสินค้าที่เลือก โดยต้องมากกว่า 0 |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่เพิ่มรายการสินค้าในตะกร้า |

## `order` — ข้อมูลคำสั่งซื้อ
| แอตทริบิวต์ | ชนิดข้อมูล | คีย์ / ข้อกำหนด | คำอธิบาย |
|---|---|---|---|
| `order_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | รหัสประจำคำสั่งซื้อ |
| `user_id` | INT(11) | FK → user.user_id, NOT NULL, ON DELETE CASCADE | รหัสผู้ใช้งานที่ทำรายการสั่งซื้อ |
| `order_date` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่สร้างคำสั่งซื้อ |
| `total_amount` | DECIMAL(10,2) | NOT NULL | ยอดเงินรวมของคำสั่งซื้อ ณ เวลาที่ชำระเงิน |
| `shipping_address` | TEXT | NOT NULL | ที่อยู่สำหรับจัดส่งสินค้าในคำสั่งซื้อนี้ |
| `status` | ENUM('Pending','Paid','Shipped','Delivered','Cancelled') | NOT NULL, DEFAULT 'Pending' | สถานะปัจจุบันของคำสั่งซื้อ |

## `orderitem` — ข้อมูลรายการสินค้าในคำสั่งซื้อ
| แอตทริบิวต์ | ชนิดข้อมูล | คีย์ / ข้อกำหนด | คำอธิบาย |
|---|---|---|---|
| `order_item_id` | INT(11) | PK, AUTO_INCREMENT, NOT NULL | รหัสประจำรายการสินค้าในคำสั่งซื้อ |
| `order_id` | INT(11) | FK → order.order_id, NOT NULL | รหัสคำสั่งซื้อที่รายการสินค้านี้สังกัด |
| `product_id` | INT(11) | FK → product.product_id, NULL, DEFAULT NULL, ON DELETE SET NULL | รหัสสินค้าที่สั่งซื้อ โดยอาจเป็น NULL หลังจากลบสินค้าออกจากระบบ |
| `quantity` | INT(11) | NOT NULL, CHECK (quantity > 0) | จำนวนสินค้าที่สั่งซื้อ โดยต้องมากกว่า 0 |
| `price_at_purchase` | DECIMAL(10,2) | NOT NULL, CHECK (price_at_purchase >= 0) | ราคาต่อหน่วยที่บันทึกไว้ ณ เวลาสั่งซื้อ |
| `product_name_at_purchase` | VARCHAR(150) | NULL, DEFAULT NULL | ชื่อสินค้าที่บันทึกไว้ ณ เวลาสั่งซื้อ |
| `sku_at_purchase` | VARCHAR(50) | NULL, DEFAULT NULL | รหัส SKU ของสินค้าที่บันทึกไว้ ณ เวลาสั่งซื้อ |

**ข้อกำหนด UNIQUE แบบผสม (Composite UNIQUE Constraint):** ตาราง `cartitem` มีข้อกำหนด `UNIQUE (cart_id, product_id)` เพื่อป้องกันการบันทึกสินค้าชนิดเดียวกันซ้ำเป็นหลายรายการภายในตะกร้าเดียวกัน หากผู้ใช้งานเพิ่มสินค้าชนิดเดิม ระบบจะปรับปรุงจำนวนสินค้า (`quantity`) ของรายการที่มีอยู่แทนการสร้างรายการใหม่

**การรักษาประวัติคำสั่งซื้อ (Historical Order Preservation):**
ตาราง `orderitem` ใช้ข้อกำหนด `ON DELETE SET NULL` สำหรับ Foreign Key `product_id` เพื่อรักษาข้อมูลรายการสั่งซื้อย้อนหลัง แม้ว่าสินค้านั้นจะถูกลบออกจากฐานข้อมูลอย่างถาวร โดยระบบจะกำหนดค่า `product_id` เป็น `NULL` แต่ยังคงเก็บชื่อสินค้า (`product_name_at_purchase`), รหัสสินค้า (`sku_at_purchase`), จำนวนสินค้า (`quantity`) และราคาขณะสั่งซื้อ (`price_at_purchase`) ไว้
นอกจากนี้ Foreign Key `order_id` ไม่มีการกำหนด `ON DELETE CASCADE` ดังนั้นคำสั่งซื้อที่มีรายการสินค้าอ้างอิงอยู่จะไม่สามารถถูกลบออกได้โดยตรงตามข้อกำหนดความสัมพันธ์ของฐานข้อมูล