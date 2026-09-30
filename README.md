# 3DPrinter-Store
Database Project for CPE-303

# Business Rule
## 1. Customer & Account Management (การจัดการข้อมูลลูกค้า)
- Rule 1.1: A customer must register an account with a unique email address, password, full name, phone number, and delivery address before placing an order.
- Rule 1.2: A customer can exist in the system without having placed any orders yet.
- Rule 1.3: A customer can place zero, one, or many orders over time.

## 2. Brand & Manufacturer Management (การจัดการแบรนด์และผู้ผลิต)
- Rule 2.1: Every product in the store must belong to exactly one Brand/Manufacturer (e.g., Bambu Lab, Creality, Prusa, eSUN, Polymaker, Sunlu, R3D, Panchroma, Anycubic).
- Rule 2.2: A Brand can produce and list multiple products across different categories in the store catalog.

## 3. Product Categories (การจัดหมวดหมู่สินค้า)
- Rule 3.1: Every item in the catalog must belong to exactly one Category:
FDM 3D Printers (e.g., CoreXY, Bed Slinger)
Filaments (e.g., PLA, PETG, ABS, TPU spools and refills)
Nozzles & Hotend Parts (e.g., Brass/Hardened Steel Nozzles, Heater Blocks)
Fasteners & Threaded Inserts (e.g., M1–M6 Bolts/Nuts/Washers, Brass Heat-Set Inserts M2–M5)
Maker Tools & Accessories (e.g., Heat-Insert Soldering Iron Tips, PEI Sheets, Flush Cutters)
- Rule 3.2: A Category can contain multiple products, and a category can exist in the system even if no products are assigned to it yet.

## 4. Product Catalog & Inventory Management (การจัดการสินค้าและคลังสินค้า)
- Rule 4.1: Every product has a unique SKU, product name, description, unit price, stock quantity, brand ID, and category ID.
- Rule 4.2: Hardware items sold in multi-packs (e.g., M3x5mm Brass Heat Inserts 50-Pack, M3x10mm Screws 20-Pack) are registered as individual product SKUs with fixed package quantities.
- Rule 4.3: Stock quantity must automatically decrease when an order is finalized and increase when inventory is restocked.

## 5. Order & Transaction Management (การจัดการคำสั่งซื้อ)
- Rule 5.1: An order must belong to exactly one Customer.
- Rule 5.2: An order tracks a unique Order ID, order date/time, total amount, shipping address, and current order status (Pending, Paid, Shipped, Completed, Cancelled).
- Rule 5.3: An order must contain at least one product, but can combine machines, filaments, and hardware accessories in a single checkout.

## 6. Order Line Items (รายการสินค้าในคำสั่งซื้อ - Junction Rule)
- Rule 6.1: A single product SKU can appear across many different orders over time.
- Rule 6.2: Each line item in an order records the specific quantity purchased and locks in the unit price at the time of purchase to protect historical sales records if catalog prices change later.
