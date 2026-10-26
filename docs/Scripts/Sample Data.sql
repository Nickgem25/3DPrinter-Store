-- 3DPrinter-Store: sample catalog seed for a NEW / EMPTY database.
-- Run AFTER "Create Database and Table.sql".
-- Do NOT run on the existing populated production/development database:
-- the SKU values are already present there.
-- Brand/category IDs below reproduce the mappings referenced by the product
-- samples; they are a reconstructed SAMPLE mapping, not a database export.
-- Confirm IDs against live brand/category tables if exact restoration matters.
-- To preserve real accounts, orders, stock, and other current data, use a
-- sanitized MariaDB dump instead of this seed file.

USE `3dprinter_store`;

-- ============================================================
-- SECTION 3A: BRANDS (must exist before products)
-- Names/ID assignments required by the product records
-- ============================================================
INSERT INTO `brand` (`brand_id`, `brand_name`) VALUES
  (1, 'Bambu Lab'),
  (2, 'Creality'),
  (3, 'eSUN'),
  (5, 'Elegoo'),
  (6, 'Anycubic'),
  (7, 'Polymaker'),
  (8, 'SUNLU'),
  (9, 'Overture'),
  (19, 'Generic'),
  (21, 'Phrozen'),
  (23, 'Prusa'),
  (24, 'Flashforge');

-- ============================================================
-- SECTION 3B: CATEGORIES (must exist before products)
-- ============================================================
INSERT INTO `category` (`category_id`, `category_name`) VALUES
  (1, 'FDM 3D Printers'),
  (2, 'Filaments'),
  (3, 'Nozzles & Hotends'),
  (5, 'Resin 3D Printers'),
  (7, 'Build Plates'),
  (18, 'Tools & Hardware'),
  (19, 'Resins & Consumables');

-- ============================================================
-- SECTION 3C: FIRST 80 PRODUCTS (CAT26-001 to CAT26-080)
-- Uses brand/category name lookups, just as in your original file
-- ============================================================
INSERT INTO `product` (`sku`, `product_name`, `description`, `unit_price`, `stock_quantity`, `brand_id`, `category_id`)
VALUES
    ('CAT26-001', 'A1 Mini', 'Sample store listing: A1 Mini. Confirm compatibility and specifications before actual sale.', 249.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Bambu Lab'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-002', 'A1', 'Sample store listing: A1. Confirm compatibility and specifications before actual sale.', 399.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Bambu Lab'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-003', 'P1S', 'Sample store listing: P1S. Confirm compatibility and specifications before actual sale.', 699.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Bambu Lab'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-004', 'X1 Carbon', 'Sample store listing: X1 Carbon. Confirm compatibility and specifications before actual sale.', 1199.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Bambu Lab'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-005', 'Ender-3 V3 SE', 'Sample store listing: Ender-3 V3 SE. Confirm compatibility and specifications before actual sale.', 199.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Creality'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-006', 'Ender-3 V3 KE', 'Sample store listing: Ender-3 V3 KE. Confirm compatibility and specifications before actual sale.', 279.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Creality'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-007', 'K1C', 'Sample store listing: K1C. Confirm compatibility and specifications before actual sale.', 499.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Creality'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-008', 'K1 Max', 'Sample store listing: K1 Max. Confirm compatibility and specifications before actual sale.', 799.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Creality'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-009', 'Neptune 4', 'Sample store listing: Neptune 4. Confirm compatibility and specifications before actual sale.', 239.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Elegoo'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-010', 'Neptune 4 Pro', 'Sample store listing: Neptune 4 Pro. Confirm compatibility and specifications before actual sale.', 279.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Elegoo'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-011', 'Neptune 4 Plus', 'Sample store listing: Neptune 4 Plus. Confirm compatibility and specifications before actual sale.', 349.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Elegoo'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-012', 'Kobra 3', 'Sample store listing: Kobra 3. Confirm compatibility and specifications before actual sale.', 329.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Anycubic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-013', 'Kobra 2 Pro', 'Sample store listing: Kobra 2 Pro. Confirm compatibility and specifications before actual sale.', 289.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Anycubic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-014', 'Original Prusa MK4S', 'Sample store listing: Original Prusa MK4S. Confirm compatibility and specifications before actual sale.', 1099.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Prusa'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-015', 'Adventurer 5M', 'Sample store listing: Adventurer 5M. Confirm compatibility and specifications before actual sale.', 349.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Flashforge'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-016', 'Adventurer 5M Pro', 'Sample store listing: Adventurer 5M Pro. Confirm compatibility and specifications before actual sale.', 549.00, 8, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Flashforge'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'FDM 3D Printers')),
    ('CAT26-017', 'Mars 4', 'Sample store listing: Mars 4. Confirm compatibility and specifications before actual sale.', 229.00, 7, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Elegoo'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resin 3D Printers')),
    ('CAT26-018', 'Mars 5 Ultra', 'Sample store listing: Mars 5 Ultra. Confirm compatibility and specifications before actual sale.', 359.00, 7, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Elegoo'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resin 3D Printers')),
    ('CAT26-019', 'Saturn 4', 'Sample store listing: Saturn 4. Confirm compatibility and specifications before actual sale.', 399.00, 7, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Elegoo'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resin 3D Printers')),
    ('CAT26-020', 'Saturn 4 Ultra', 'Sample store listing: Saturn 4 Ultra. Confirm compatibility and specifications before actual sale.', 499.00, 7, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Elegoo'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resin 3D Printers')),
    ('CAT26-021', 'Photon Mono 4', 'Sample store listing: Photon Mono 4. Confirm compatibility and specifications before actual sale.', 249.00, 7, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Anycubic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resin 3D Printers')),
    ('CAT26-022', 'Photon Mono M7 Pro', 'Sample store listing: Photon Mono M7 Pro. Confirm compatibility and specifications before actual sale.', 599.00, 7, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Anycubic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resin 3D Printers')),
    ('CAT26-023', 'Sonic Mini 8K S', 'Sample store listing: Sonic Mini 8K S. Confirm compatibility and specifications before actual sale.', 349.00, 7, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Phrozen'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resin 3D Printers')),
    ('CAT26-024', 'Sonic Mighty 8K', 'Sample store listing: Sonic Mighty 8K. Confirm compatibility and specifications before actual sale.', 649.00, 7, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Phrozen'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resin 3D Printers')),
    ('CAT26-025', 'PLA+ White 1kg 1.75mm', 'Sample store listing: PLA+ White 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 23.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'eSUN'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-026', 'PLA+ Black 1kg 1.75mm', 'Sample store listing: PLA+ Black 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 23.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'eSUN'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-027', 'PLA+ Grey 1kg 1.75mm', 'Sample store listing: PLA+ Grey 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 23.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'eSUN'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-028', 'PLA+ Red 1kg 1.75mm', 'Sample store listing: PLA+ Red 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 23.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'eSUN'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-029', 'PLA+ Blue 1kg 1.75mm', 'Sample store listing: PLA+ Blue 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 23.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'eSUN'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-030', 'PLA+ Green 1kg 1.75mm', 'Sample store listing: PLA+ Green 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 23.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'eSUN'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-031', 'PolyLite PLA White 1kg 1.75mm', 'Sample store listing: PolyLite PLA White 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 22.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Polymaker'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-032', 'PolyLite PLA Black 1kg 1.75mm', 'Sample store listing: PolyLite PLA Black 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 22.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Polymaker'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-033', 'PolyLite PLA Grey 1kg 1.75mm', 'Sample store listing: PolyLite PLA Grey 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 22.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Polymaker'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-034', 'PolyLite PLA Orange 1kg 1.75mm', 'Sample store listing: PolyLite PLA Orange 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 22.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Polymaker'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-035', 'PLA Basic White 1kg 1.75mm', 'Sample store listing: PLA Basic White 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 24.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Bambu Lab'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-036', 'PLA Basic Black 1kg 1.75mm', 'Sample store listing: PLA Basic Black 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 24.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Bambu Lab'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-037', 'PLA Basic Grey 1kg 1.75mm', 'Sample store listing: PLA Basic Grey 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 24.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Bambu Lab'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-038', 'PLA Basic Blue 1kg 1.75mm', 'Sample store listing: PLA Basic Blue 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 24.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Bambu Lab'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-039', 'PLA White 1kg 1.75mm', 'Sample store listing: PLA White 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 17.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'SUNLU'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-040', 'PLA Black 1kg 1.75mm', 'Sample store listing: PLA Black 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 17.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'SUNLU'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-041', 'PLA Red 1kg 1.75mm', 'Sample store listing: PLA Red 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 17.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'SUNLU'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-042', 'PLA Yellow 1kg 1.75mm', 'Sample store listing: PLA Yellow 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 17.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'SUNLU'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-043', 'PETG Black 1kg 1.75mm', 'Sample store listing: PETG Black 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 23.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Overture'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-044', 'PETG Clear 1kg 1.75mm', 'Sample store listing: PETG Clear 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 23.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Overture'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-045', 'PETG White 1kg 1.75mm', 'Sample store listing: PETG White 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 23.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Overture'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-046', 'PolyLite PETG Black 1kg 1.75mm', 'Sample store listing: PolyLite PETG Black 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 27.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Polymaker'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-047', 'PolyLite PETG Grey 1kg 1.75mm', 'Sample store listing: PolyLite PETG Grey 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 27.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Polymaker'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-048', 'PolyLite PETG Blue 1kg 1.75mm', 'Sample store listing: PolyLite PETG Blue 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 27.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Polymaker'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-049', 'TPU 95A Black 1kg 1.75mm', 'Sample store listing: TPU 95A Black 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 29.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'eSUN'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-050', 'TPU 95A White 1kg 1.75mm', 'Sample store listing: TPU 95A White 1kg 1.75mm. Confirm compatibility and specifications before actual sale.', 29.99, 60, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'eSUN'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Filaments')),
    ('CAT26-051', 'Brass Nozzle 0.4mm 10-pack', 'Sample store listing: Brass Nozzle 0.4mm 10-pack. Confirm compatibility and specifications before actual sale.', 8.99, 45, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Nozzles & Hotends')),
    ('CAT26-052', 'Brass Nozzle 0.6mm 10-pack', 'Sample store listing: Brass Nozzle 0.6mm 10-pack. Confirm compatibility and specifications before actual sale.', 8.99, 45, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Nozzles & Hotends')),
    ('CAT26-053', 'Hardened Steel Nozzle 0.4mm', 'Sample store listing: Hardened Steel Nozzle 0.4mm. Confirm compatibility and specifications before actual sale.', 12.99, 45, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Nozzles & Hotends')),
    ('CAT26-054', 'Hardened Steel Nozzle 0.6mm', 'Sample store listing: Hardened Steel Nozzle 0.6mm. Confirm compatibility and specifications before actual sale.', 12.99, 45, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Nozzles & Hotends')),
    ('CAT26-055', 'Stainless Steel Nozzle 0.4mm', 'Sample store listing: Stainless Steel Nozzle 0.4mm. Confirm compatibility and specifications before actual sale.', 11.99, 45, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Nozzles & Hotends')),
    ('CAT26-056', 'Hotend Silicone Sock 5-pack', 'Sample store listing: Hotend Silicone Sock 5-pack. Confirm compatibility and specifications before actual sale.', 7.99, 45, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Nozzles & Hotends')),
    ('CAT26-057', 'Heater Cartridge 24V', 'Sample store listing: Heater Cartridge 24V. Confirm compatibility and specifications before actual sale.', 12.99, 45, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Nozzles & Hotends')),
    ('CAT26-058', 'Thermistor Sensor Pack', 'Sample store listing: Thermistor Sensor Pack. Confirm compatibility and specifications before actual sale.', 9.99, 45, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Nozzles & Hotends')),
    ('CAT26-059', 'Hotend Cleaning Needle Set', 'Sample store listing: Hotend Cleaning Needle Set. Confirm compatibility and specifications before actual sale.', 6.99, 45, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Nozzles & Hotends')),
    ('CAT26-060', 'Textured PEI Spring Steel 235x235mm', 'Sample store listing: Textured PEI Spring Steel 235x235mm. Confirm compatibility and specifications before actual sale.', 24.99, 30, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Build Plates')),
    ('CAT26-061', 'Smooth PEI Spring Steel 235x235mm', 'Sample store listing: Smooth PEI Spring Steel 235x235mm. Confirm compatibility and specifications before actual sale.', 24.99, 30, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Build Plates')),
    ('CAT26-062', 'Textured PEI Spring Steel 256x256mm', 'Sample store listing: Textured PEI Spring Steel 256x256mm. Confirm compatibility and specifications before actual sale.', 29.99, 30, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Build Plates')),
    ('CAT26-063', 'Smooth PEI Spring Steel 256x256mm', 'Sample store listing: Smooth PEI Spring Steel 256x256mm. Confirm compatibility and specifications before actual sale.', 29.99, 30, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Build Plates')),
    ('CAT26-064', 'Magnetic Build Surface 220x220mm', 'Sample store listing: Magnetic Build Surface 220x220mm. Confirm compatibility and specifications before actual sale.', 14.99, 30, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Build Plates')),
    ('CAT26-065', 'Glass Build Plate 235x235mm', 'Sample store listing: Glass Build Plate 235x235mm. Confirm compatibility and specifications before actual sale.', 19.99, 30, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Build Plates')),
    ('CAT26-066', 'Adhesive Build Sheet 235x235mm', 'Sample store listing: Adhesive Build Sheet 235x235mm. Confirm compatibility and specifications before actual sale.', 9.99, 30, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Build Plates')),
    ('CAT26-067', 'Digital Caliper 150mm', 'Sample store listing: Digital Caliper 150mm. Confirm compatibility and specifications before actual sale.', 14.99, 42, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Tools & Hardware')),
    ('CAT26-068', 'Flush Cutter Tool', 'Sample store listing: Flush Cutter Tool. Confirm compatibility and specifications before actual sale.', 7.99, 42, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Tools & Hardware')),
    ('CAT26-069', 'Deburring Tool Kit', 'Sample store listing: Deburring Tool Kit. Confirm compatibility and specifications before actual sale.', 10.99, 42, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Tools & Hardware')),
    ('CAT26-070', 'Plastic Scraper Set', 'Sample store listing: Plastic Scraper Set. Confirm compatibility and specifications before actual sale.', 6.99, 42, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Tools & Hardware')),
    ('CAT26-071', 'Hex Key Metric Set', 'Sample store listing: Hex Key Metric Set. Confirm compatibility and specifications before actual sale.', 11.99, 42, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Tools & Hardware')),
    ('CAT26-072', 'M3 Screw Assortment 200-piece', 'Sample store listing: M3 Screw Assortment 200-piece. Confirm compatibility and specifications before actual sale.', 12.99, 42, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Tools & Hardware')),
    ('CAT26-073', 'M3 Heat-Set Insert 100-piece', 'Sample store listing: M3 Heat-Set Insert 100-piece. Confirm compatibility and specifications before actual sale.', 9.99, 42, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Tools & Hardware')),
    ('CAT26-074', 'Nozzle Cleaning Brush Kit', 'Sample store listing: Nozzle Cleaning Brush Kit. Confirm compatibility and specifications before actual sale.', 8.99, 42, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Generic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Tools & Hardware')),
    ('CAT26-075', 'Standard Grey Resin 1kg', 'Sample store listing: Standard Grey Resin 1kg. Confirm compatibility and specifications before actual sale.', 24.99, 35, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Elegoo'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resins & Consumables')),
    ('CAT26-076', 'Standard Black Resin 1kg', 'Sample store listing: Standard Black Resin 1kg. Confirm compatibility and specifications before actual sale.', 24.99, 35, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Elegoo'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resins & Consumables')),
    ('CAT26-077', 'Standard Grey Resin 1kg', 'Sample store listing: Standard Grey Resin 1kg. Confirm compatibility and specifications before actual sale.', 23.99, 35, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Anycubic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resins & Consumables')),
    ('CAT26-078', 'ABS-Like Grey Resin 1kg', 'Sample store listing: ABS-Like Grey Resin 1kg. Confirm compatibility and specifications before actual sale.', 29.99, 35, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Anycubic'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resins & Consumables')),
    ('CAT26-079', 'Water Washable Grey Resin 1kg', 'Sample store listing: Water Washable Grey Resin 1kg. Confirm compatibility and specifications before actual sale.', 26.99, 35, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'SUNLU'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resins & Consumables')),
    ('CAT26-080', 'Aqua Grey 4K Resin 1kg', 'Sample store listing: Aqua Grey 4K Resin 1kg. Confirm compatibility and specifications before actual sale.', 39.99, 35, (SELECT `brand_id` FROM `brand` WHERE `brand_name` = 'Phrozen'), (SELECT `category_id` FROM `category` WHERE `category_name` = 'Resins & Consumables'));

-- ============================================================
-- SECTION 3D: NEW 40 PRODUCTS (CAT26-081 to CAT26-120)
-- ============================================================
INSERT INTO `product` (`sku`, `product_name`, `description`, `unit_price`, `stock_quantity`, `brand_id`, `category_id`)
VALUES
    ('CAT26-081', 'A1 Combo', 'FDM 3D printer with AMS lite multi-color printing system', 459.00, 12, 1, 1),
    ('CAT26-082', 'P1S Combo', 'Enclosed CoreXY 3D printer bundle with AMS multi-color system', 849.00, 8, 1, 1),
    ('CAT26-083', 'Ender-3 V3', 'High-speed desktop FDM printer with automatic bed leveling', 299.00, 15, 2, 1),
    ('CAT26-084', 'K2 Plus', 'Large-format enclosed CoreXY 3D printer', 1299.00, 5, 2, 1),
    ('CAT26-085', 'Kobra 3 Combo', 'Multi-color FDM 3D printer bundle with filament management system', 499.00, 10, 6, 1),
    ('CAT26-086', 'CORE One', 'Enclosed CoreXY FDM 3D printer for precision printing', 1199.00, 6, 23, 1),
    ('CAT26-087', 'Mars 5', 'Compact LCD resin printer for high-detail models', 249.00, 9, 5, 5),
    ('CAT26-088', 'Photon Mono M7', 'High-resolution LCD resin 3D printer', 449.00, 7, 6, 5),
    ('CAT26-089', 'Sonic Mega 8K S', 'Large-format resin printer for detailed models', 1899.00, 3, 21, 5),
    ('CAT26-090', 'PETG HF Black 1kg 1.75mm', 'Black high-flow PETG filament for fast printing', 24.99, 80, 1, 2),
    ('CAT26-091', 'PETG HF White 1kg 1.75mm', 'White high-flow PETG filament for fast printing', 24.99, 75, 1, 2),
    ('CAT26-092', 'PLA Matte Black 1kg 1.75mm', 'Matte black PLA filament with a smooth finish', 22.99, 100, 1, 2),
    ('CAT26-093', 'PLA Matte White 1kg 1.75mm', 'Matte white PLA filament with a smooth finish', 22.99, 100, 1, 2),
    ('CAT26-094', 'PolyLite ASA Black 1kg 1.75mm', 'Weather-resistant black ASA filament', 34.99, 45, 7, 2),
    ('CAT26-095', 'PolyLite ASA White 1kg 1.75mm', 'Weather-resistant white ASA filament', 34.99, 40, 7, 2),
    ('CAT26-096', 'ABS+ Black 1kg 1.75mm', 'Black ABS+ filament for functional prints', 25.99, 65, 3, 2),
    ('CAT26-097', 'ABS+ White 1kg 1.75mm', 'White ABS+ filament for functional prints', 25.99, 60, 3, 2),
    ('CAT26-098', 'PLA+ Purple 1kg 1.75mm', 'Purple PLA+ filament for general 3D printing', 23.99, 80, 3, 2),
    ('CAT26-099', 'PLA Green 1kg 1.75mm', 'Green PLA filament for everyday printing', 17.99, 95, 8, 2),
    ('CAT26-100', 'PETG Black 1kg 1.75mm', 'Durable black PETG filament for functional parts', 21.99, 75, 8, 2),
    ('CAT26-101', 'PETG White 1kg 1.75mm', 'Durable white PETG filament for functional parts', 21.99, 70, 8, 2),
    ('CAT26-102', 'TPU 95A Black 1kg 1.75mm', 'Flexible black TPU filament for durable parts', 32.99, 40, 9, 2),
    ('CAT26-103', 'PolyLite PLA Blue 1kg 1.75mm', 'Blue PLA filament for general-purpose printing', 22.99, 85, 7, 2),
    ('CAT26-104', 'Brass Nozzle 0.2mm 10-pack', 'Brass nozzles for fine-detail FDM printing', 12.99, 55, 19, 3),
    ('CAT26-105', 'Hardened Steel Nozzle 0.8mm', 'Wear-resistant nozzle for high-flow printing', 15.99, 35, 19, 3),
    ('CAT26-106', 'Bimetal Heatbreak 1.75mm', 'Replacement bimetal heatbreak for compatible hotends', 13.99, 40, 19, 3),
    ('CAT26-107', 'Hotend Thermal Paste 5g', 'Thermal compound for compatible hotend maintenance', 7.99, 60, 19, 3),
    ('CAT26-108', 'Smooth PEI Spring Steel 220x220mm', 'Flexible smooth PEI build plate for compatible printers', 24.99, 40, 19, 7),
    ('CAT26-109', 'Textured PEI Spring Steel 310x310mm', 'Large textured PEI build plate for compatible printers', 39.99, 25, 19, 7),
    ('CAT26-110', 'Magnetic Build Surface 256x256mm', 'Magnetic build surface for compatible printer beds', 19.99, 45, 19, 7),
    ('CAT26-111', 'M2 Screw Assortment 200-piece', 'Metric M2 screw assortment for small assemblies', 9.99, 75, 19, 18),
    ('CAT26-112', 'M4 Screw Assortment 200-piece', 'Metric M4 screw assortment for printer assemblies', 11.99, 70, 19, 18),
    ('CAT26-113', 'M2 Heat-Set Insert 100-piece', 'Brass M2 threaded inserts for printed parts', 8.99, 90, 19, 18),
    ('CAT26-114', 'M4 Heat-Set Insert 100-piece', 'Brass M4 threaded inserts for printed parts', 10.99, 80, 19, 18),
    ('CAT26-115', 'Precision Tweezer Set', 'Fine-tip tweezers for printer maintenance and model finishing', 8.99, 65, 19, 18),
    ('CAT26-116', 'Silicone Work Mat', 'Heat-resistant work mat for printer maintenance', 14.99, 45, 19, 18),
    ('CAT26-117', 'Standard White Resin 1kg', 'White photopolymer resin for LCD resin printing', 27.99, 45, 5, 19),
    ('CAT26-118', 'Water Washable Ceramic Grey Resin 1kg', 'Water-washable grey resin for detailed models', 32.99, 35, 5, 19),
    ('CAT26-119', 'ABS-Like Black Resin 1kg', 'Black ABS-like resin for functional prototypes', 34.99, 40, 6, 19),
    ('CAT26-120', 'Aqua Clear Resin 1kg', 'Clear photopolymer resin for compatible LCD printers', 39.99, 25, 21, 19);

-- ============================================================
-- SECTION 3E: IMAGE PATHS
-- Actual image assets already live in frontend/public/product-images/
-- ============================================================
UPDATE `product`
SET `image_url` = CONCAT('/product-images/', LOWER(`sku`), '.jpg')
WHERE `sku` REGEXP '^CAT26-(0[0-9][0-9]|1[01][0-9]|120)$';

-- Read-only validation (after running the seed on a new database):
SELECT COUNT(*) AS seeded_catalog_products
FROM `product`
WHERE `sku` BETWEEN 'CAT26-001' AND 'CAT26-120';
