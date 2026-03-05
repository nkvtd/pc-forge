import "dotenv/config";
import pg from 'pg';

const dataSQL = `
SET search_path TO public;

TRUNCATE TABLE
suggestions,
cooler_cpu_sockets,
case_mobo_form_factors,
case_ps_form_factors,
case_storage_form_factors,
build_component,
favorite_build,
rating_build,
review,
build,
admins,
users,
network_card,
network_adapter,
cables,
sound_card,
optical_drive,
memory_card,
storage,
motherboard,
cooler,
pc_case,
power_supply,
memory,
gpu,
cpu,
components
RESTART IDENTITY CASCADE;

INSERT INTO users (username, password, email) VALUES
('tome', 'tg', 'tome.gjorgiev@gmail.com'),
('mihail', 'mn', 'mihail.naumov@gmail.com'),
('stefan', 'sv', 'stefan.velkovski@gmail.com'),
('admin', 'admin', 'admin@gmail.com'),
('pc_wizard', 'pw', 'wizard@gmail.com'),
('budget_king', 'bk', 'budget@gmail.com'),
('rgb_lover', 'rgb', 'rgblover@gmail.com'),
('streamer_pro', 'sp', 'streamer@gmail.com'),
('office_guy', 'og', 'office@gmail.com'),
('linux_fan', 'lf', 'linux@gmail.com'),
('first_timer', 'ft', 'noob@gmail.com');

INSERT INTO admins (user_id) VALUES (4);

INSERT INTO components (name, brand, price, type, img_url) VALUES
('Air Cooler', 'Noctua', 69.99, 'cooler', 'https://cdn.brandfetch.io/idSeoCDyH9/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('B550 Motherboard', 'ASUS', 149.99, 'motherboard', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('1TB NVMe SSD', 'Samsung', 129.99, 'storage', 'https://cdn.brandfetch.io/iduaw_nOnR/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Sound Card', 'Creative', 59.99, 'sound_card', 'https://cdn.brandfetch.io/idkZSfybrG/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Network Card', 'Intel', 39.99, 'network_card', 'https://cdn.brandfetch.io/idTGhLyv09/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('Network Adapter', 'TP-Link', 29.99, 'network_adapter', 'https://cdn.brandfetch.io/idfUqCiOVX/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Optical Drive', 'LG', 19.99, 'optical_drive', 'https://cdn.brandfetch.io/idEI6u48uh/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Storage Card', 'SanDisk', 15.99, 'memory_card', 'https://cdn.brandfetch.io/idM3tf3Iq8/w/800/h/800/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Cables Pack', 'Corsair', 9.99, 'cables', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),

-- CPUS
('Ryzen 5 5600X', 'AMD', 199.99, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-5-5600.png'),
('Ryzen 5 7600', 'AMD', 229.00, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-5-7600.png'),
('Ryzen 7 7800X3D', 'AMD', 399.00, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-7-7800x3d.png'),
('Ryzen 9 7950X', 'AMD', 599.00, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-9-7950x.png'),
('Core i3-13100F', 'Intel', 119.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i3-13100.png'),
('Core i5-13600K', 'Intel', 319.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i5-13600k.png'),
('Core i7-14700K', 'Intel', 409.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i7-14700k.png'),
('Core i9-14900KS', 'Intel', 689.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i9-14900ks.png'),
('Ryzen 5 3600', 'AMD', 149.99, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-5-3600.png'),
('Ryzen 7 3700X', 'AMD', 189.99, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-7-3700x.png'),
('Ryzen 5 5600', 'AMD', 179.99, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-5-5600.png'),
('Ryzen 7 5700X', 'AMD', 219.99, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-7-5700x.png'),
('Ryzen 9 5900X', 'AMD', 349.99, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-9-5900x.png'),
('Core i5-12400F', 'Intel', 159.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i5-12400.png'),
('Core i7-12700K', 'Intel', 299.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i7-12700k.png'),
('Core i5-10400F', 'Intel', 129.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i5-10400.png'),
('Core i7-11700K', 'Intel', 249.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i7-11700k.png'),
('Core i9-12900K', 'Intel', 449.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i9-12900k.png'),
('Ryzen 3 3200G', 'AMD', 99.99, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-3-3200g.png'),
('Ryzen 5 3600X', 'AMD', 199.99, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-5-3600x.png'),
('Ryzen 9 3900X', 'AMD', 399.99, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-9-3900x.png'),
('Ryzen 5 5600G', 'AMD', 159.99, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-5-5600g.png'),
('Ryzen 7 5800X', 'AMD', 299.99, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-7-5800x.png'),
('Core i3-10100F', 'Intel', 89.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i3-10100.png'),
('Core i3-12100F', 'Intel', 109.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i3-12100.png'),
('Core i5-11400F', 'Intel', 139.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i5-11400.png'),
('Core i9-10900K', 'Intel', 399.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i9-10900k.png'),
('Core i5-13400F', 'Intel', 199.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i5-13400.png'),

-- GPUS
('RTX 3060', 'NVIDIA', 329.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-3060.png'),
('Radeon RX 6600', 'PowerColor', 199.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-6600.png'),
('Radeon RX 7600', 'Sapphire', 269.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-7600.png'),
('Radeon RX 7800 XT', 'XFX', 499.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-7800-xt.png'),
('Radeon RX 7900 XTX', 'Sapphire', 999.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-7900-xtx.png'),
('GeForce RTX 3050', 'MSI', 229.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-3050.png'),
('GeForce RTX 4060', 'Zotac', 299.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-4060.png'),
('GeForce RTX 4070 Super', 'ASUS', 599.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-4070-super.png'),
('GeForce RTX 4080 Super', 'Gigabyte', 999.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-4080-super.png'),
('GeForce RTX 4090', 'NVIDIA', 1599.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-4090.png'),
('GeForce RTX 3060 Ti', 'EVGA', 399.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-3060-ti.png'),
('GeForce RTX 3070', 'MSI', 499.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-3070.png'),
('GeForce RTX 3070 Ti', 'Gigabyte', 549.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-3070-ti.png'),
('GeForce RTX 3080', 'ASUS', 699.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-3080.png'),
('GeForce RTX 3090', 'NVIDIA', 1499.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-3090.png'),
('GeForce RTX 4060 Ti', 'Zotac', 399.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-4060-ti.png'),
('GeForce RTX 4070', 'MSI', 549.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-4070.png'),
('GeForce RTX 4070 Ti', 'Gigabyte', 749.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-4070-ti.png'),
('GeForce RTX 4080', 'ASUS', 1199.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-4080.png'),
('GeForce RTX 2060', 'EVGA', 299.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-2060.png'),
('Radeon RX 6700 XT', 'Sapphire', 379.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-6700-xt.png'),
('Radeon RX 6800', 'PowerColor', 479.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-6800.png'),
('Radeon RX 6800 XT', 'XFX', 579.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-6800-xt.png'),
('Radeon RX 6900 XT', 'Sapphire', 699.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-6900-xt.png'),
('Radeon RX 7700 XT', 'XFX', 449.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-7700-xt.png'),
('Radeon RX 7900 XT', 'Sapphire', 849.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-7900-xt.png'),
('Radeon RX 6650 XT', 'PowerColor', 279.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-6650-xt.png'),
('Radeon RX 6750 XT', 'XFX', 329.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-6750-xt.png'),
('Radeon RX 5700 XT', 'Sapphire', 349.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-5700-xt.png'),
('Radeon RX 5600 XT', 'PowerColor', 259.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-5600-xt.png'),
('Arc A770', 'Intel', 349.99, 'gpu', 'https://static.hardwaredb.net/badges/arc-a770.png'),
('Arc A750', 'Intel', 289.99, 'gpu', 'https://static.hardwaredb.net/badges/arc-a750.png'),
('Arc A580', 'Intel', 179.99, 'gpu', 'https://static.hardwaredb.net/badges/arc-a580.png'),
('Arc A380', 'Intel', 139.99, 'gpu', 'https://static.hardwaredb.net/badges/arc-a380.png'),
('Arc A310', 'Intel', 99.99, 'gpu', 'https://cdn.brandfetch.io/idTGhLyv09/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('Arc B580', 'Intel', 249.99, 'gpu', 'https://cdn.brandfetch.io/idTGhLyv09/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('Arc B570', 'Intel', 219.99, 'gpu', 'https://cdn.brandfetch.io/idTGhLyv09/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('Arc A350M', 'Intel', 199.99, 'gpu', 'https://cdn.brandfetch.io/idTGhLyv09/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('Arc Pro A60', 'Intel', 449.99, 'gpu', 'https://cdn.brandfetch.io/idTGhLyv09/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('Arc Pro A40', 'Intel', 299.99, 'gpu', 'https://cdn.brandfetch.io/idTGhLyv09/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),

-- MOTHERBOARDS
('B450 Tomahawk Max', 'MSI', 109.99, 'motherboard', 'https://images.seeklogo.com/logo-png/30/1/msi-logo-png_seeklogo-304877.png'),
('B550-A Pro', 'MSI', 139.99, 'motherboard', 'https://images.seeklogo.com/logo-png/30/1/msi-logo-png_seeklogo-304877.png'),
('X570 AORUS Elite', 'Gigabyte', 189.99, 'motherboard', 'https://images.seeklogo.com/logo-png/39/1/gigabyte-logo-png_seeklogo-398170.png'),
('B550M TUF Gaming', 'ASUS', 119.99, 'motherboard', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('X570 Unify', 'MSI', 279.99, 'motherboard', 'https://images.seeklogo.com/logo-png/30/1/msi-logo-png_seeklogo-304877.png'),
('B650 AORUS Elite AX', 'Gigabyte', 199.99, 'motherboard', 'https://images.seeklogo.com/logo-png/39/1/gigabyte-logo-png_seeklogo-398170.png'),
('X670 Gaming Plus WiFi', 'MSI', 249.99, 'motherboard', 'https://images.seeklogo.com/logo-png/30/1/msi-logo-png_seeklogo-304877.png'),
('B650E TUF Gaming', 'ASUS', 229.99, 'motherboard', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('X670E Taichi', 'ASRock', 399.99, 'motherboard', 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/0013/7800/brand.gif?itok=5s1HB6L_'),
('B550 Phantom Gaming', 'ASRock', 129.99, 'motherboard', 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/0013/7800/brand.gif?itok=5s1HB6L_'),
('B660M Pro RS', 'ASRock', 109.99, 'motherboard', 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/0013/7800/brand.gif?itok=5s1HB6L_'),
('B660 Gaming X DDR4', 'Gigabyte', 139.99, 'motherboard', 'https://images.seeklogo.com/logo-png/39/1/gigabyte-logo-png_seeklogo-398170.png'),
('H610M-E', 'ASUS', 89.99, 'motherboard', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Z690 AORUS Pro', 'Gigabyte', 299.99, 'motherboard', 'https://images.seeklogo.com/logo-png/39/1/gigabyte-logo-png_seeklogo-398170.png'),
('Z690 Edge WiFi DDR4', 'MSI', 259.99, 'motherboard', 'https://images.seeklogo.com/logo-png/30/1/msi-logo-png_seeklogo-304877.png'),
('B760M DS3H DDR4', 'Gigabyte', 119.99, 'motherboard', 'https://images.seeklogo.com/logo-png/39/1/gigabyte-logo-png_seeklogo-398170.png'),
('Z790 TUF Gaming', 'ASUS', 349.99, 'motherboard', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('B760 Tomahawk WiFi', 'MSI', 189.99, 'motherboard', 'https://images.seeklogo.com/logo-png/30/1/msi-logo-png_seeklogo-304877.png'),
('Z790 AORUS Elite', 'Gigabyte', 269.99, 'motherboard', 'https://images.seeklogo.com/logo-png/39/1/gigabyte-logo-png_seeklogo-398170.png'),
('H670 Steel Legend', 'ASRock', 159.99, 'motherboard', 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/0013/7800/brand.gif?itok=5s1HB6L_'),
('B650M DS3H', 'Gigabyte', 149.99, 'motherboard', 'https://images.seeklogo.com/logo-png/39/1/gigabyte-logo-png_seeklogo-398170.png'),
('X670E AORUS Master', 'Gigabyte', 459.99, 'motherboard', 'https://images.seeklogo.com/logo-png/39/1/gigabyte-logo-png_seeklogo-398170.png'),
('B760M Bomber WiFi', 'MSI', 129.99, 'motherboard', 'https://images.seeklogo.com/logo-png/30/1/msi-logo-png_seeklogo-304877.png'),
('Z790 Maximus Hero', 'ASUS', 599.99, 'motherboard', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),

-- RAM MODULES
('16GB DDR4 Kit', 'Corsair', 79.99, 'memory', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('Vengeance LPX 8GB', 'Corsair', 24.99, 'memory', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('Ripjaws V 16GB', 'G.Skill', 34.99, 'memory', 'https://cdn.brandfetch.io/id8HgeVn1l/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Fury Beast 16GB', 'Kingston', 39.99, 'memory', 'https://cdn.brandfetch.io/idQrDf3A8-/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Elite 32GB Kit', 'TeamGroup', 59.99, 'memory', 'https://cdn.brandfetch.io/id8A5bRNKu/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Vengeance RGB Pro 32GB', 'Corsair', 79.99, 'memory', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('Trident Z RGB 16GB', 'G.Skill', 49.99, 'memory', 'https://cdn.brandfetch.io/id8HgeVn1l/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Aegis 16GB Kit', 'G.Skill', 29.99, 'memory', 'https://cdn.brandfetch.io/id8HgeVn1l/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('HyperX Fury 32GB', 'Kingston', 69.99, 'memory', 'https://cdn.brandfetch.io/idQrDf3A8-/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Ballistix 16GB', 'Crucial', 39.99, 'memory', 'https://cdn.brandfetch.io/idcQwroMOv/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Value RAM 8GB', 'Corsair', 19.99, 'memory', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('Trident Z5 16GB', 'G.Skill', 64.99, 'memory', 'https://cdn.brandfetch.io/id8HgeVn1l/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Dominator Platinum 32GB', 'Corsair', 159.99, 'memory', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('Fury Beast DDR5 16GB', 'Kingston', 69.99, 'memory', 'https://cdn.brandfetch.io/idQrDf3A8-/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Vengeance DDR5 32GB', 'Corsair', 119.99, 'memory', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('Trident Z5 RGB 64GB', 'G.Skill', 249.99, 'memory', 'https://cdn.brandfetch.io/id8HgeVn1l/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Elite DDR5 32GB', 'TeamGroup', 109.99, 'memory', 'https://cdn.brandfetch.io/id8A5bRNKu/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Fury Beast DDR5 32GB', 'Kingston', 129.99, 'memory', 'https://cdn.brandfetch.io/idQrDf3A8-/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Vengeance RGB DDR5 64GB', 'Corsair', 249.99, 'memory', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('T-Force Delta RGB 32GB', 'TeamGroup', 99.99, 'memory', 'https://cdn.brandfetch.io/id8A5bRNKu/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Flare X5 32GB', 'G.Skill', 134.99, 'memory', 'https://cdn.brandfetch.io/id8HgeVn1l/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Vengeance LPX 16GB', 'Corsair', 39.99, 'memory', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('Ripjaws V 32GB', 'G.Skill', 69.99, 'memory', 'https://cdn.brandfetch.io/id8HgeVn1l/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Trident Z5 RGB 32GB', 'G.Skill', 114.99, 'memory', 'https://cdn.brandfetch.io/id8HgeVn1l/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Dominator Platinum 64GB', 'Corsair', 289.99, 'memory', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),

-- STORAGE DEVICES
('Samsung 870 EVO 500GB', 'Samsung', 54.99, 'storage', 'https://cdn.brandfetch.io/iduaw_nOnR/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Samsung 870 QVO 1TB', 'Samsung', 89.99, 'storage', 'https://cdn.brandfetch.io/iduaw_nOnR/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('WD Blue 1TB', 'Western Digital', 49.99, 'storage', 'https://cdn.brandfetch.io/id6bAnMJ1y/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Crucial MX500 2TB', 'Crucial', 149.99, 'storage', 'https://cdn.brandfetch.io/idcQwroMOv/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Kingston A400 480GB', 'Kingston', 34.99, 'storage', 'https://cdn.brandfetch.io/idQrDf3A8-/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Samsung 980 Pro 1TB', 'Samsung', 119.99, 'storage', 'https://cdn.brandfetch.io/iduaw_nOnR/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('WD Black SN770 1TB', 'Western Digital', 89.99, 'storage', 'https://cdn.brandfetch.io/id6bAnMJ1y/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Crucial P5 Plus 2TB', 'Crucial', 159.99, 'storage', 'https://cdn.brandfetch.io/idcQwroMOv/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Samsung 980 500GB', 'Samsung', 49.99, 'storage', 'https://cdn.brandfetch.io/iduaw_nOnR/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('WD Blue SN580 1TB', 'Western Digital', 69.99, 'storage', 'https://cdn.brandfetch.io/id6bAnMJ1y/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Kingston KC3000 1TB', 'Kingston', 99.99, 'storage', 'https://cdn.brandfetch.io/idQrDf3A8-/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Seagate Barracuda 2TB', 'Seagate', 54.99, 'storage', 'https://cdn.brandfetch.io/id5NUik-_s/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('WD Blue 4TB HDD', 'Western Digital', 79.99, 'storage', 'https://cdn.brandfetch.io/id6bAnMJ1y/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Seagate IronWolf 4TB', 'Seagate', 99.99, 'storage', 'https://cdn.brandfetch.io/id5NUik-_s/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Toshiba X300 6TB', 'Toshiba', 139.99, 'storage', 'https://cdn.brandfetch.io/idC7lwdfzx/w/200/h/200/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('WD Black 6TB HDD', 'Western Digital', 179.99, 'storage', 'https://cdn.brandfetch.io/id6bAnMJ1y/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Seagate Barracuda 8TB', 'Seagate', 149.99, 'storage', 'https://cdn.brandfetch.io/id5NUik-_s/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Crucial BX500 1TB', 'Crucial', 59.99, 'storage', 'https://cdn.brandfetch.io/idcQwroMOv/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Samsung 870 EVO 2TB', 'Samsung', 179.99, 'storage', 'https://cdn.brandfetch.io/iduaw_nOnR/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Kingston NV2 2TB', 'Kingston', 109.99, 'storage', 'https://cdn.brandfetch.io/idQrDf3A8-/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Crucial P3 1TB', 'Crucial', 64.99, 'storage', 'https://cdn.brandfetch.io/idcQwroMOv/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('WD Black SN850X 2TB', 'Western Digital', 159.99, 'storage', 'https://cdn.brandfetch.io/id6bAnMJ1y/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Samsung 990 Pro 4TB', 'Samsung', 349.99, 'storage', 'https://cdn.brandfetch.io/iduaw_nOnR/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),

-- CASES
('H5 Elite Hero', 'NZXT', 119.99, 'case', 'https://nzxt.com/cdn/shop/files/h5-elite-hero-black.png?v=1744789660&width=2000'),
('H510 Elite', 'NZXT', 149.99, 'case', 'https://nzxt.com/cdn/shop/files/h5-elite-hero-white.png?crop=center&height=1200&v=1762528056&width=1200'),
('H7 Flow', 'NZXT', 129.99, 'case', 'https://nzxt.com/cdn/shop/files/h7-flow-hero-white.png?v=1762528078&width=1000'),
('5000D Airflow', 'Corsair', 164.99, 'case', 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Cases/base-5000d-airflow/Gallery/5000D_AF_WHITE_001.webp'),
('4000D RGB', 'Corsair', 134.99, 'case', 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Cases/CC-9011240-WW/iCUE-4000D-RGB-AIRFLOW-Mid-Tower-Case_-Black---3x-AF120-RGB-ELITE-Fans---iCUE-Lighting-Node-PRO-Controller---High-airflow-Design-_CN_-0.webp'),
('iCUE 5000X RGB', 'Corsair', 179.99, 'case', 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Cases/base-5000x/Gallery/5000X_RGB_BLACK_27.webp?width=1080&quality=85&auto=webp&format=pjpg'),
('O11 Dynamic XL', 'Lian Li', 199.99, 'case', 'https://ddstore.mk/media/catalog/product/cache/0ee050c3ffc3555709b9bb6062f4d7e9/1/0/1005459-product_11887_0.png'),
('Lancool 216', 'Lian Li', 109.99, 'case', 'https://lian-li.com/wp-content/uploads/2022/11/1007_136-b.jpg'),
('Meshify 2 Compact', 'Fractal Design', 119.99, 'case', 'https://www.fractal-design.com/app/uploads/2021/01/Standard-Studio_Meshify2Compact_Black_TGD_Standard_6.-Left-Front.jpg'),
('Define 7', 'Fractal Design', 169.99, 'case', 'https://www.fractal-design.com/app/uploads/2020/10/Define_7_TGD_Black_Left_Front-810x810.jpg'),
('Torrent Compact', 'Fractal Design', 179.99, 'case', 'https://www.fractal-design.com/app/uploads/2022/01/Torrent_Compact_Black_RGB_TGL_1-Left-Front.jpg'),
('View 51 TG', 'Thermaltake', 139.99, 'case', 'https://www.thermaltake.com/media/catalog/product/cache/cc8b24283b13da6bc2ff91682c03b54b/v/i/view51tg_1.jpg'),
('Core P3 TG', 'Thermaltake', 149.99, 'case', 'https://www.thermaltake.com/media/catalog/product/cache/6af153fd0a0c509bdfcdfb60a394dd9c/c/o/core_p3_new_5.jpg'),
('H440', 'NZXT', 109.99, 'case', 'https://static.bhphoto.com/images/images500x500/1449769831_1204996.jpg'),
('P500A', 'Phanteks', 149.99, 'case', 'https://files.pccasegear.com/images/1594876098-PH-EC500ATG_DBK01-thb3.jpg'),
('Pure Base 500DX', 'Be Quiet', 109.99, 'case', 'https://www.techpowerup.com/review/be-quiet-pure-base-500dx-rgb-atx-chassis/images/small.png'),
('H500', 'Cooler Master', 119.99, 'case', 'https://a.storyblok.com/f/281110/819c3bb0a3/mch500_g2.png/m/1440x0/smart'),
('RL08', 'Silverstone', 89.99, 'case', 'https://www.silverstonetek.com/upload/detail/pro_20220426123228_1.jpg'),
('Air 100 ARGB', 'Montech', 69.99, 'case', 'https://www.montechpc.com/images/375613?stamp=1734689091'),
('CC560', 'Deepcool', 59.99, 'case', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL4Zf68opHbG86D31NTVI3Y4AQhXE1PBYPjw&s'),
('DF700 Flux', 'Antec', 159.99, 'case', 'https://www.antec.com/product/case/images/gallery-df700-flux-01.jpg'),
('H5 Flow', 'NZXT', 94.99, 'case', 'https://nzxt.com/cdn/shop/files/h5-flow-rgb-h5-flow-rgb-primary-lg.png?v=1744863470&width=2000'),
('4000D Airflow', 'Corsair', 104.99, 'case', 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Cases/base-4000d-airflow-config/Gallery/4000D_AF_BLACK_01.webp'),
('O11 Dynamic Evo', 'Lian Li', 159.99, 'case', 'https://www.pbtech.co.nz/imgprod/C/H/CHALAN2074__1.jpg?h=2971221114'),
('Versa H18', 'Thermaltake', 49.99, 'case', 'https://cdn.mwave.com.au/images/400/AC11503_2.jpg'),

-- PSUs
('650W PSU', 'EVGA', 89.99, 'power_supply', 'https://cdn.brandfetch.io/iddPf9bbl3/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Smart 450W', 'Thermaltake', 34.99, 'power_supply', 'https://cdn.brandfetch.io/idkwuFYTlH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('CV550', 'Corsair', 49.99, 'power_supply', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('BR600W', 'EVGA', 59.99, 'power_supply', 'https://cdn.brandfetch.io/iddPf9bbl3/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('CX650M', 'Corsair', 79.99, 'power_supply', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('SuperNOVA 750 G6', 'EVGA', 109.99, 'power_supply', 'https://cdn.brandfetch.io/iddPf9bbl3/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('RM850x', 'Corsair', 134.99, 'power_supply', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('Toughpower GF1 850W', 'Thermaltake', 119.99, 'power_supply', 'https://cdn.brandfetch.io/idkwuFYTlH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('HX1000i', 'Corsair', 199.99, 'power_supply', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('SuperNOVA 1200 P2', 'EVGA', 229.99, 'power_supply', 'https://cdn.brandfetch.io/iddPf9bbl3/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('RM1000x Shift', 'Corsair', 219.99, 'power_supply', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('Smart 500W', 'Thermaltake', 39.99, 'power_supply', 'https://cdn.brandfetch.io/idkwuFYTlH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('RM750e', 'Corsair', 99.99, 'power_supply', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('SuperNOVA 1000 GT', 'EVGA', 169.99, 'power_supply', 'https://cdn.brandfetch.io/iddPf9bbl3/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),

-- COOLERS
('Hyper 212 RGB Black', 'Cooler Master', 44.99, 'cooler', 'https://cdn.brandfetch.io/idestV9Dp7/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B'),
('NH-D15', 'Noctua', 109.99, 'cooler', 'https://cdn.brandfetch.io/idSeoCDyH9/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('Dark Rock Pro 4', 'Be Quiet', 89.99, 'cooler', 'https://cdn.brandfetch.io/idl3sdUGQK/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('NH-U12S', 'Noctua', 69.99, 'cooler', 'https://cdn.brandfetch.io/idSeoCDyH9/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('Vetroo V5', 'Vetroo', 29.99, 'cooler', 'https://cdn.brandfetch.io/idTMdoBX11/w/500/h/500/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Assassin X 120 Refined', 'Thermalright', 19.99, 'cooler', 'https://cdn.brandfetch.io/id2Wov4r9a/w/339/h/339/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('Pure Rock 2', 'Be Quiet', 49.99, 'cooler', 'https://cdn.brandfetch.io/idl3sdUGQK/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Fuma 3', 'Scythe', 64.99, 'cooler', 'https://cdn.brandfetch.io/ide9kDI3oQ/w/200/h/166/theme/light/logo.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('Kraken X63', 'NZXT', 149.99, 'cooler', 'https://cdn.brandfetch.io/id6LxRitGO/w/1080/h/1080/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('iCUE H100i Elite', 'Corsair', 149.99, 'cooler', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('iCUE H150i Elite LCD', 'Corsair', 289.99, 'cooler', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('Castle 280 RGB', 'Deepcool', 119.99, 'cooler', 'https://cdn.brandfetch.io/iddrVAMC1d/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('MasterLiquid ML240L', 'Cooler Master', 79.99, 'cooler', 'https://cdn.brandfetch.io/idestV9Dp7/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Liquid Freezer II 360', 'Arctic', 119.99, 'cooler', 'https://cdn.brandfetch.io/idPggLGOPA/w/2007/h/2195/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('EK-AIO 240 D-RGB', 'EK Water Blocks', 109.99, 'cooler', 'https://cdn.brandfetch.io/idEOY10s6I/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Peerless Assassin 120 SE', 'Thermalright', 33.90, 'cooler', 'https://cdn.brandfetch.io/id2Wov4r9a/w/339/h/339/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('Kraken Elite 360', 'NZXT', 279.99, 'cooler', 'https://cdn.brandfetch.io/id6LxRitGO/w/1080/h/1080/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),

-- SOUND CARDS
('Sound BlasterX AE-5 Plus', 'Creative', 149.99, 'sound_card', 'https://cdn.brandfetch.io/idkZSfybrG/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Xonar SE', 'ASUS', 44.99, 'sound_card', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Sound Blaster Z', 'Creative', 89.99, 'sound_card', 'https://cdn.brandfetch.io/idkZSfybrG/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Audigy FX', 'Creative', 39.99, 'sound_card', 'https://cdn.brandfetch.io/idkZSfybrG/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Xonar U7', 'ASUS', 79.99, 'sound_card', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),

-- NETWORK CARDS
('PRO/1000 PT', 'Intel', 49.99, 'network_card', 'https://cdn.brandfetch.io/idTGhLyv09/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('TG-3468', 'TP-Link', 24.99, 'network_card', 'https://cdn.brandfetch.io/idfUqCiOVX/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('PCE-AC68', 'ASUS', 69.99, 'network_card', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('XG-C100C', 'ASUS', 99.99, 'network_card', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Killer E3100G', 'Intel', 54.99, 'network_card', 'https://cdn.brandfetch.io/idTGhLyv09/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),

-- NETWORK ADAPTERS
('Archer TX3000E', 'TP-Link', 49.99, 'network_adapter', 'https://cdn.brandfetch.io/idfUqCiOVX/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('AX200', 'Intel', 34.99, 'network_adapter', 'https://cdn.brandfetch.io/idTGhLyv09/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('PCE-AXE5400', 'ASUS', 89.99, 'network_adapter', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Archer T6E', 'TP-Link', 39.99, 'network_adapter', 'https://cdn.brandfetch.io/idfUqCiOVX/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('WN7200ND', 'Rosewill', 19.99, 'network_adapter', 'https://cdn.brandfetch.io/idyFoDrbp8/w/1298/h/471/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B'),

-- MEMORY CARDS
('M.2 NVMe Adapter Card', 'ASUS', 24.99, 'memory_card', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Dual M.2 PCIe Card', 'Silverstone', 29.99, 'memory_card', 'https://cdn.brandfetch.io/idV16xgPJT/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Quad M.2 RAID Card', 'ASUS', 89.99, 'memory_card', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('U.2 NVMe Adapter', 'StarTech', 49.99, 'memory_card', 'https://cdn.brandfetch.io/idXnrkx-Wc/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Triple M.2 Expansion', 'Gigabyte', 44.99, 'memory_card', 'https://images.seeklogo.com/logo-png/39/1/gigabyte-logo-png_seeklogo-398170.png'),

-- OPTICAL DRIVE
('DVD-RW Drive', 'ASUS', 21.99, 'optical_drive', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Slim DVD Writer', 'LG', 24.99, 'optical_drive', 'https://cdn.brandfetch.io/idEI6u48uh/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('BDR-XD07B', 'Pioneer', 89.99, 'optical_drive', 'https://cdn.brandfetch.io/idWn73vTFp/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('BP60NB10', 'LG', 69.99, 'optical_drive', 'https://cdn.brandfetch.io/idEI6u48uh/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Blu-ray Writer', 'ASUS', 79.99, 'optical_drive', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),

-- CABLES
('USB 3.0 Extension 6ft', 'Cable Matters', 8.99, 'cables', 'https://cdn.brandfetch.io/idvRXtmRRE/w/350/h/350/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('SATA III Cable 3-Pack', 'Monoprice', 6.99, 'cables', 'https://cdn.brandfetch.io/id7CYiuB0p/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Premium Sleeved Cables', 'Corsair', 79.99, 'cables', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('DisplayPort 1.4 Cable', 'Cable Matters', 12.99, 'cables', 'https://cdn.brandfetch.io/idvRXtmRRE/w/350/h/350/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('USB-C to USB-A Cable', 'Anker', 9.99, 'cables', 'https://cdn.brandfetch.io/idZx11xCTE/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B'),
('HDMI 2.1 Cable 10ft', 'Cable Matters', 15.99, 'cables', 'https://cdn.brandfetch.io/idvRXtmRRE/w/350/h/350/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('PWM Fan Splitter Cable', 'Noctua', 7.99, 'cables', 'https://cdn.brandfetch.io/idSeoCDyH9/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('RGB LED Strip Extension', 'Corsair', 14.99, 'cables', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('PCIe 4.0 Riser Cable', 'Thermaltake', 49.99, 'cables', 'https://cdn.brandfetch.io/idkwuFYTlH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Molex to SATA Power', 'StarTech', 5.99, 'cables', 'https://cdn.brandfetch.io/idXnrkx-Wc/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B');

INSERT INTO cpu (component_id, socket, cores, threads, base_clock, boost_clock, tdp) VALUES
(1, 'AM4', 6, 12, 3.7, 4.6, 65),
((SELECT id FROM components WHERE name='Ryzen 5 7600'), 'AM5', 6, 12, 3.8, 5.1, 65),
((SELECT id FROM components WHERE name='Ryzen 7 7800X3D'), 'AM5', 8, 16, 4.2, 5.0, 120),
((SELECT id FROM components WHERE name='Ryzen 9 7950X'), 'AM5', 16, 32, 4.5, 5.7, 170),
((SELECT id FROM components WHERE name='Core i3-13100F'), 'LGA1700', 4, 8, 3.4, 4.5, 58),
((SELECT id FROM components WHERE name='Core i5-13600K'), 'LGA1700', 14, 20, 3.5, 5.1, 125),
((SELECT id FROM components WHERE name='Core i7-14700K'), 'LGA1700', 20, 28, 3.4, 5.6, 125),
((SELECT id FROM components WHERE name='Core i9-14900KS'), 'LGA1700', 24, 32, 3.2, 6.2, 150),
((SELECT id FROM components WHERE name='Ryzen 5 3600'), 'AM4', 6, 12, 3.6, 4.2, 65),
((SELECT id FROM components WHERE name='Ryzen 7 3700X'), 'AM4', 8, 16, 3.6, 4.4, 65),
((SELECT id FROM components WHERE name='Ryzen 5 5600'), 'AM4', 6, 12, 3.5, 4.4, 65),
((SELECT id FROM components WHERE name='Ryzen 7 5700X'), 'AM4', 8, 16, 3.4, 4.6, 65),
((SELECT id FROM components WHERE name='Ryzen 9 5900X'), 'AM4', 12, 24, 3.7, 4.8, 105),
((SELECT id FROM components WHERE name='Core i5-12400F'), 'LGA1700', 6, 12, 2.5, 4.4, 65),
((SELECT id FROM components WHERE name='Core i7-12700K'), 'LGA1700', 12, 20, 3.6, 5.0, 125),
((SELECT id FROM components WHERE name='Core i5-10400F'), 'LGA1200', 6, 12, 2.9, 4.3, 65),
((SELECT id FROM components WHERE name='Core i7-11700K'), 'LGA1200', 8, 16, 3.6, 5.0, 125),
((SELECT id FROM components WHERE name='Core i9-12900K'), 'LGA1700', 16, 24, 3.2, 5.2, 125),
((SELECT id FROM components WHERE name='Ryzen 3 3200G'), 'AM4', 4, 4, 3.6, 4.0, 65),
((SELECT id FROM components WHERE name='Ryzen 5 3600X'), 'AM4', 6, 12, 3.8, 4.4, 95),
((SELECT id FROM components WHERE name='Ryzen 9 3900X'), 'AM4', 12, 24, 3.8, 4.6, 105),
((SELECT id FROM components WHERE name='Ryzen 5 5600G'), 'AM4', 6, 12, 3.9, 4.4, 65),
((SELECT id FROM components WHERE name='Ryzen 7 5800X'), 'AM4', 8, 16, 3.8, 4.7, 105),
((SELECT id FROM components WHERE name='Core i3-10100F'), 'LGA1200', 4, 8, 3.6, 4.3, 65),
((SELECT id FROM components WHERE name='Core i3-12100F'), 'LGA1700', 4, 8, 3.3, 4.3, 58),
((SELECT id FROM components WHERE name='Core i5-11400F'), 'LGA1200', 6, 12, 2.6, 4.4, 65),
((SELECT id FROM components WHERE name='Core i9-10900K'), 'LGA1200', 10, 20, 3.7, 5.3, 125),
((SELECT id FROM components WHERE name='Core i5-13400F'), 'LGA1700', 10, 16, 2.5, 4.6, 65);

INSERT INTO gpu (component_id, vram, tdp, base_clock, boost_clock, chipset, length) VALUES
(2, 12, 170, 1.32, 1.78, 'RTX 3060', 242),
((SELECT id FROM components WHERE name='Radeon RX 6600'), 8, 132, 2.0, 2.4, 'RX 6600', 200),
((SELECT id FROM components WHERE name='Radeon RX 7600'), 8, 165, 2.2, 2.6, 'RX 7600', 240),
((SELECT id FROM components WHERE name='Radeon RX 7800 XT'), 16, 263, 2.1, 2.4, 'RX 7800 XT', 280),
((SELECT id FROM components WHERE name='Radeon RX 7900 XTX'), 24, 355, 2.3, 2.5, 'RX 7900 XTX', 320),
((SELECT id FROM components WHERE name='GeForce RTX 3050'), 8, 130, 1.5, 1.7, 'RTX 3050', 200),
((SELECT id FROM components WHERE name='GeForce RTX 4060'), 8, 115, 1.8, 2.4, 'RTX 4060', 220),
((SELECT id FROM components WHERE name='GeForce RTX 4070 Super'), 12, 220, 1.9, 2.5, 'RTX 4070 S', 260),
((SELECT id FROM components WHERE name='GeForce RTX 4080 Super'), 16, 320, 2.2, 2.5, 'RTX 4080 S', 300),
((SELECT id FROM components WHERE name='GeForce RTX 4090'), 24, 450, 2.2, 2.5, 'RTX 4090', 340),
((SELECT id FROM components WHERE name='GeForce RTX 3060 Ti'), 8, 200, 1.41, 1.67, 'RTX 3060 Ti', 242),
((SELECT id FROM components WHERE name='GeForce RTX 3070'), 8, 220, 1.5, 1.73, 'RTX 3070', 242),
((SELECT id FROM components WHERE name='GeForce RTX 3070 Ti'), 8, 290, 1.58, 1.77, 'RTX 3070 Ti', 267),
((SELECT id FROM components WHERE name='GeForce RTX 3080'), 10, 320, 1.44, 1.71, 'RTX 3080', 285),
((SELECT id FROM components WHERE name='GeForce RTX 3090'), 24, 350, 1.4, 1.7, 'RTX 3090', 313),
((SELECT id FROM components WHERE name='GeForce RTX 4060 Ti'), 8, 160, 2.3, 2.5, 'RTX 4060 Ti', 244),
((SELECT id FROM components WHERE name='GeForce RTX 4070'), 12, 200, 1.9, 2.48, 'RTX 4070', 242),
((SELECT id FROM components WHERE name='GeForce RTX 4070 Ti'), 12, 285, 2.3, 2.6, 'RTX 4070 Ti', 267),
((SELECT id FROM components WHERE name='GeForce RTX 4080'), 16, 320, 2.2, 2.51, 'RTX 4080', 304),
((SELECT id FROM components WHERE name='GeForce RTX 2060'), 6, 160, 1.37, 1.68, 'RTX 2060', 229),
((SELECT id FROM components WHERE name='Radeon RX 6700 XT'), 12, 230, 2.3, 2.58, 'RX 6700 XT', 267),
((SELECT id FROM components WHERE name='Radeon RX 6800'), 16, 250, 1.7, 2.1, 'RX 6800', 267),
((SELECT id FROM components WHERE name='Radeon RX 6800 XT'), 16, 300, 1.82, 2.25, 'RX 6800 XT', 267),
((SELECT id FROM components WHERE name='Radeon RX 6900 XT'), 16, 300, 1.83, 2.25, 'RX 6900 XT', 267),
((SELECT id FROM components WHERE name='Radeon RX 7700 XT'), 12, 245, 2.2, 2.54, 'RX 7700 XT', 260),
((SELECT id FROM components WHERE name='Radeon RX 7900 XT'), 20, 315, 2.0, 2.4, 'RX 7900 XT', 287),
((SELECT id FROM components WHERE name='Radeon RX 6650 XT'), 8, 180, 2.06, 2.64, 'RX 6650 XT', 240),
((SELECT id FROM components WHERE name='Radeon RX 6750 XT'), 12, 250, 2.15, 2.6, 'RX 6750 XT', 267),
((SELECT id FROM components WHERE name='Radeon RX 5700 XT'), 8, 225, 1.61, 1.91, 'RX 5700 XT', 267),
((SELECT id FROM components WHERE name='Radeon RX 5600 XT'), 6, 150, 1.38, 1.62, 'RX 5600 XT', 240),
((SELECT id FROM components WHERE name='Arc A770'), 16, 225, 2.1, 2.4, 'Arc A770', 267),
((SELECT id FROM components WHERE name='Arc A750'), 8, 225, 2.05, 2.4, 'Arc A750', 267),
((SELECT id FROM components WHERE name='Arc A580'), 8, 185, 1.7, 2.0, 'Arc A580', 229),
((SELECT id FROM components WHERE name='Arc A380'), 6, 75, 2.0, 2.45, 'Arc A380', 167),
((SELECT id FROM components WHERE name='Arc A310'), 4, 75, 2.0, 2.0, 'Arc A310', 150),
((SELECT id FROM components WHERE name='Arc B580'), 12, 190, 2.0, 2.67, 'Arc B580', 267),
((SELECT id FROM components WHERE name='Arc B570'), 10, 150, 1.9, 2.5, 'Arc B570', 242),
((SELECT id FROM components WHERE name='Arc A350M'), 4, 50, 1.15, 1.8, 'Arc A350M', 180),
((SELECT id FROM components WHERE name='Arc Pro A60'), 12, 130, 2.0, 2.45, 'Arc Pro A60', 229),
((SELECT id FROM components WHERE name='Arc Pro A40'), 6, 50, 1.65, 2.05, 'Arc Pro A40', 167);

INSERT INTO motherboard (component_id, socket, chipset, form_factor, ram_type, num_ram_slots, max_ram_capacity, pci_express_slots) VALUES
(7, 'AM4', 'B550', 'ATX', 'DDR4', 4, 128, 3),
((SELECT id FROM components WHERE name='B650M DS3H'), 'AM5', 'B650', 'Micro-ATX', 'DDR5', 4, 128, 2),
((SELECT id FROM components WHERE name='X670E AORUS Master'), 'AM5', 'X670E', 'ATX', 'DDR5', 4, 192, 3),
((SELECT id FROM components WHERE name='B760M Bomber WiFi'), 'LGA1700', 'B760', 'Micro-ATX', 'DDR4', 2, 64, 1),
((SELECT id FROM components WHERE name='Z790 Maximus Hero'), 'LGA1700', 'Z790', 'ATX', 'DDR5', 4, 192, 3),
((SELECT id FROM components WHERE name='B450 Tomahawk Max'), 'AM4', 'B450', 'ATX', 'DDR4', 4, 128, 2),
((SELECT id FROM components WHERE name='B550-A Pro'), 'AM4', 'B550', 'ATX', 'DDR4', 4, 128, 2),
((SELECT id FROM components WHERE name='X570 AORUS Elite'), 'AM4', 'X570', 'ATX', 'DDR4', 4, 128, 3),
((SELECT id FROM components WHERE name='B550M TUF Gaming'), 'AM4', 'B550', 'Micro-ATX', 'DDR4', 4, 128, 2),
((SELECT id FROM components WHERE name='X570 Unify'), 'AM4', 'X570', 'ATX', 'DDR4', 4, 128, 3),
((SELECT id FROM components WHERE name='B650 AORUS Elite AX'), 'AM5', 'B650', 'ATX', 'DDR5', 4, 128, 3),
((SELECT id FROM components WHERE name='X670 Gaming Plus WiFi'), 'AM5', 'X670', 'ATX', 'DDR5', 4, 192, 3),
((SELECT id FROM components WHERE name='B650E TUF Gaming'), 'AM5', 'B650E', 'ATX', 'DDR5', 4, 128, 3),
((SELECT id FROM components WHERE name='X670E Taichi'), 'AM5', 'X670E', 'ATX', 'DDR5', 4, 256, 4),
((SELECT id FROM components WHERE name='B550 Phantom Gaming'), 'AM4', 'B550', 'ATX', 'DDR4', 4, 128, 2),
((SELECT id FROM components WHERE name='B660M Pro RS'), 'LGA1700', 'B660', 'Micro-ATX', 'DDR4', 4, 128, 2),
((SELECT id FROM components WHERE name='B660 Gaming X DDR4'), 'LGA1700', 'B660', 'ATX', 'DDR4', 4, 128, 2),
((SELECT id FROM components WHERE name='H610M-E'), 'LGA1700', 'H610', 'Micro-ATX', 'DDR4', 2, 64, 1),
((SELECT id FROM components WHERE name='Z690 AORUS Pro'), 'LGA1700', 'Z690', 'ATX', 'DDR5', 4, 128, 3),
((SELECT id FROM components WHERE name='Z690 Edge WiFi DDR4'), 'LGA1700', 'Z690', 'ATX', 'DDR4', 4, 128, 3),
((SELECT id FROM components WHERE name='B760M DS3H DDR4'), 'LGA1700', 'B760', 'Micro-ATX', 'DDR4', 4, 128, 2),
((SELECT id FROM components WHERE name='Z790 TUF Gaming'), 'LGA1700', 'Z790', 'ATX', 'DDR5', 4, 192, 3),
((SELECT id FROM components WHERE name='B760 Tomahawk WiFi'), 'LGA1700', 'B760', 'ATX', 'DDR4', 4, 128, 3),
((SELECT id FROM components WHERE name='Z790 AORUS Elite'), 'LGA1700', 'Z790', 'ATX', 'DDR5', 4, 192, 3),
((SELECT id FROM components WHERE name='H670 Steel Legend'), 'LGA1700', 'H670', 'ATX', 'DDR4', 4, 128, 2);

INSERT INTO memory (component_id, type, speed, capacity, modules) VALUES
(3, 'DDR4', 3200, 16, 2),
((SELECT id FROM components WHERE name='Vengeance LPX 16GB'), 'DDR4', 3200, 16, 2),
((SELECT id FROM components WHERE name='Ripjaws V 32GB'), 'DDR4', 3600, 32, 2),
((SELECT id FROM components WHERE name='Trident Z5 RGB 32GB'), 'DDR5', 6000, 32, 2),
((SELECT id FROM components WHERE name='Dominator Platinum 64GB'), 'DDR5', 6400, 64, 2),
((SELECT id FROM components WHERE name='Vengeance LPX 8GB'), 'DDR4', 3200, 8, 1),
((SELECT id FROM components WHERE name='Ripjaws V 16GB'), 'DDR4', 3600, 16, 2),
((SELECT id FROM components WHERE name='Fury Beast 16GB'), 'DDR4', 3200, 16, 2),
((SELECT id FROM components WHERE name='Elite 32GB Kit'), 'DDR4', 3200, 32, 2),
((SELECT id FROM components WHERE name='Vengeance RGB Pro 32GB'), 'DDR4', 3600, 32, 2),
((SELECT id FROM components WHERE name='Trident Z RGB 16GB'), 'DDR4', 3600, 16, 2),
((SELECT id FROM components WHERE name='Aegis 16GB Kit'), 'DDR4', 3000, 16, 2),
((SELECT id FROM components WHERE name='HyperX Fury 32GB'), 'DDR4', 3200, 32, 4),
((SELECT id FROM components WHERE name='Ballistix 16GB'), 'DDR4', 3200, 16, 1),
((SELECT id FROM components WHERE name='Value RAM 8GB'), 'DDR4', 2666, 8, 1),
((SELECT id FROM components WHERE name='Trident Z5 16GB'), 'DDR5', 6000, 16, 2),
((SELECT id FROM components WHERE name='Dominator Platinum 32GB'), 'DDR5', 6400, 32, 2),
((SELECT id FROM components WHERE name='Fury Beast DDR5 16GB'), 'DDR5', 5600, 16, 1),
((SELECT id FROM components WHERE name='Vengeance DDR5 32GB'), 'DDR5', 5600, 32, 2),
((SELECT id FROM components WHERE name='Trident Z5 RGB 64GB'), 'DDR5', 6000, 64, 2),
((SELECT id FROM components WHERE name='Elite DDR5 32GB'), 'DDR5', 5200, 32, 2),
((SELECT id FROM components WHERE name='Fury Beast DDR5 32GB'), 'DDR5', 6000, 32, 2),
((SELECT id FROM components WHERE name='Vengeance RGB DDR5 64GB'), 'DDR5', 6400, 64, 2),
((SELECT id FROM components WHERE name='T-Force Delta RGB 32GB'), 'DDR5', 6000, 32, 2),
((SELECT id FROM components WHERE name='Flare X5 32GB'), 'DDR5', 6000, 32, 2);

INSERT INTO storage (component_id, type, capacity, form_factor) VALUES
(8, 'NVMe', 1000, 'M.2'),
((SELECT id FROM components WHERE name='Crucial P3 1TB'), 'NVMe', 1000, 'M.2'),
((SELECT id FROM components WHERE name='WD Black SN850X 2TB'), 'NVMe', 2000, 'M.2'),
((SELECT id FROM components WHERE name='Samsung 990 Pro 4TB'), 'NVMe', 4000, 'M.2'),
((SELECT id FROM components WHERE name='Samsung 870 EVO 500GB'), 'SATA', 500, '2.5'),
((SELECT id FROM components WHERE name='Samsung 870 QVO 1TB'), 'SATA', 1000, '2.5'),
((SELECT id FROM components WHERE name='WD Blue 1TB'), 'SATA', 1000, '2.5'),
((SELECT id FROM components WHERE name='Crucial MX500 2TB'), 'SATA', 2000, '2.5'),
((SELECT id FROM components WHERE name='Kingston A400 480GB'), 'SATA', 480, '2.5'),
((SELECT id FROM components WHERE name='Samsung 980 Pro 1TB'), 'NVMe', 1000, 'M.2'),
((SELECT id FROM components WHERE name='WD Black SN770 1TB'), 'NVMe', 1000, 'M.2'),
((SELECT id FROM components WHERE name='Crucial P5 Plus 2TB'), 'NVMe', 2000, 'M.2'),
((SELECT id FROM components WHERE name='Samsung 980 500GB'), 'NVMe', 500, 'M.2'),
((SELECT id FROM components WHERE name='WD Blue SN580 1TB'), 'NVMe', 1000, 'M.2'),
((SELECT id FROM components WHERE name='Kingston KC3000 1TB'), 'NVMe', 1000, 'M.2'),
((SELECT id FROM components WHERE name='Seagate Barracuda 2TB'), 'HDD', 2000, '3.5'),
((SELECT id FROM components WHERE name='WD Blue 4TB HDD'), 'HDD', 4000, '3.5'),
((SELECT id FROM components WHERE name='Seagate IronWolf 4TB'), 'HDD', 4000, '3.5'),
((SELECT id FROM components WHERE name='Toshiba X300 6TB'), 'HDD', 6000, '3.5'),
((SELECT id FROM components WHERE name='WD Black 6TB HDD'), 'HDD', 6000, '3.5'),
((SELECT id FROM components WHERE name='Seagate Barracuda 8TB'), 'HDD', 8000, '3.5'),
((SELECT id FROM components WHERE name='Crucial BX500 1TB'), 'SATA', 1000, '2.5'),
((SELECT id FROM components WHERE name='Samsung 870 EVO 2TB'), 'SATA', 2000, '2.5'),
((SELECT id FROM components WHERE name='Kingston NV2 2TB'), 'NVMe', 2000, 'M.2');

INSERT INTO pc_case (component_id, cooler_max_height, gpu_max_length) VALUES
(5, 165, 300),
((SELECT id FROM components WHERE name='H5 Flow'), 165, 365),
((SELECT id FROM components WHERE name='4000D Airflow'), 170, 360),
((SELECT id FROM components WHERE name='O11 Dynamic Evo'), 167, 422),
((SELECT id FROM components WHERE name='Versa H18'), 155, 350),
((SELECT id FROM components WHERE name='H510 Elite'), 165, 381),
((SELECT id FROM components WHERE name='H7 Flow'), 185, 400),
((SELECT id FROM components WHERE name='5000D Airflow'), 170, 420),
((SELECT id FROM components WHERE name='4000D RGB'), 170, 360),
((SELECT id FROM components WHERE name='iCUE 5000X RGB'), 170, 420),
((SELECT id FROM components WHERE name='O11 Dynamic XL'), 167, 420),
((SELECT id FROM components WHERE name='Lancool 216'), 176, 384),
((SELECT id FROM components WHERE name='Meshify 2 Compact'), 169, 360),
((SELECT id FROM components WHERE name='Define 7'), 185, 491),
((SELECT id FROM components WHERE name='Torrent Compact'), 188, 360),
((SELECT id FROM components WHERE name='View 51 TG'), 180, 420),
((SELECT id FROM components WHERE name='Core P3 TG'), 185, 420),
((SELECT id FROM components WHERE name='H440'), 165, 400),
((SELECT id FROM components WHERE name='P500A'), 160, 435),
((SELECT id FROM components WHERE name='Pure Base 500DX'), 190, 369),
((SELECT id FROM components WHERE name='H500'), 167, 410),
((SELECT id FROM components WHERE name='RL08'), 158, 400),
((SELECT id FROM components WHERE name='Air 100 ARGB'), 155, 330),
((SELECT id FROM components WHERE name='CC560'), 165, 370),
((SELECT id FROM components WHERE name='DF700 Flux'), 180, 405);

INSERT INTO case_mobo_form_factors (case_id, form_factor) VALUES
(5, 'ATX'), (5, 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'H5 Flow'), 'ATX'),
((SELECT id FROM components WHERE name = 'H5 Flow'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = '4000D Airflow'), 'ATX'),
((SELECT id FROM components WHERE name = '4000D Airflow'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'O11 Dynamic Evo'), 'ATX'),
((SELECT id FROM components WHERE name = 'O11 Dynamic Evo'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'Versa H18'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'H510 Elite'), 'ATX'),
((SELECT id FROM components WHERE name = 'H510 Elite'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'H7 Flow'), 'ATX'),
((SELECT id FROM components WHERE name = 'H7 Flow'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = '5000D Airflow'), 'ATX'),
((SELECT id FROM components WHERE name = '5000D Airflow'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = '4000D RGB'), 'ATX'),
((SELECT id FROM components WHERE name = '4000D RGB'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'iCUE 5000X RGB'), 'ATX'),
((SELECT id FROM components WHERE name = 'iCUE 5000X RGB'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'O11 Dynamic XL'), 'ATX'),
((SELECT id FROM components WHERE name = 'O11 Dynamic XL'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'Lancool 216'), 'ATX'),
((SELECT id FROM components WHERE name = 'Lancool 216'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'Meshify 2 Compact'), 'ATX'),
((SELECT id FROM components WHERE name = 'Meshify 2 Compact'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'Define 7'), 'ATX'),
((SELECT id FROM components WHERE name = 'Define 7'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'Torrent Compact'), 'ATX'),
((SELECT id FROM components WHERE name = 'Torrent Compact'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'View 51 TG'), 'ATX'),
((SELECT id FROM components WHERE name = 'View 51 TG'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'Core P3 TG'), 'ATX'),
((SELECT id FROM components WHERE name = 'Core P3 TG'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'H440'), 'ATX'),
((SELECT id FROM components WHERE name = 'H440'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'P500A'), 'ATX'),
((SELECT id FROM components WHERE name = 'P500A'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'Pure Base 500DX'), 'ATX'),
((SELECT id FROM components WHERE name = 'Pure Base 500DX'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'H500'), 'ATX'),
((SELECT id FROM components WHERE name = 'H500'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'RL08'), 'ATX'),
((SELECT id FROM components WHERE name = 'RL08'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'Air 100 ARGB'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'CC560'), 'ATX'),
((SELECT id FROM components WHERE name = 'CC560'), 'Micro-ATX'),
((SELECT id FROM components WHERE name = 'DF700 Flux'), 'ATX'),
((SELECT id FROM components WHERE name = 'DF700 Flux'), 'Micro-ATX');

INSERT INTO case_storage_form_factors (case_id, form_factor, num_slots) VALUES
(5, 'M.2', 2),
((SELECT id FROM components WHERE name = 'H5 Flow'), 'M.2', 3),
((SELECT id FROM components WHERE name = '4000D Airflow'), 'M.2', 3),
((SELECT id FROM components WHERE name = 'O11 Dynamic Evo'), 'M.2', 4),
((SELECT id FROM components WHERE name = 'Versa H18'), 'M.2', 2),
((SELECT id FROM components WHERE name = 'H510 Elite'), 'M.2', 3),
((SELECT id FROM components WHERE name = 'H7 Flow'), 'M.2', 4),
((SELECT id FROM components WHERE name = '5000D Airflow'), 'M.2', 4),
((SELECT id FROM components WHERE name = '4000D RGB'), 'M.2', 3),
((SELECT id FROM components WHERE name = 'iCUE 5000X RGB'), 'M.2', 4),
((SELECT id FROM components WHERE name = 'O11 Dynamic XL'), 'M.2', 4),
((SELECT id FROM components WHERE name = 'Lancool 216'), 'M.2', 3),
((SELECT id FROM components WHERE name = 'Meshify 2 Compact'), 'M.2', 3),
((SELECT id FROM components WHERE name = 'Define 7'), 'M.2', 3),
((SELECT id FROM components WHERE name = 'Torrent Compact'), 'M.2', 3),
((SELECT id FROM components WHERE name = 'View 51 TG'), 'M.2', 3),
((SELECT id FROM components WHERE name = 'Core P3 TG'), 'M.2', 2),
((SELECT id FROM components WHERE name = 'H440'), 'M.2', 2),
((SELECT id FROM components WHERE name = 'P500A'), 'M.2', 3),
((SELECT id FROM components WHERE name = 'Pure Base 500DX'), 'M.2', 3),
((SELECT id FROM components WHERE name = 'H500'), 'M.2', 3),
((SELECT id FROM components WHERE name = 'RL08'), 'M.2', 2),
((SELECT id FROM components WHERE name = 'Air 100 ARGB'), 'M.2', 2),
((SELECT id FROM components WHERE name = 'CC560'), 'M.2', 2),
((SELECT id FROM components WHERE name = 'DF700 Flux'), 'M.2', 3);

INSERT INTO power_supply (component_id, type, wattage, form_factor) VALUES
(4, 'Modular', 650, 'ATX'),
((SELECT id FROM components WHERE name='Smart 500W'), 'Non-Modular', 500, 'ATX'),
((SELECT id FROM components WHERE name='RM750e'), 'Fully Modular', 750, 'ATX'),
((SELECT id FROM components WHERE name='SuperNOVA 1000 GT'), 'Fully Modular', 1000, 'ATX'),
((SELECT id FROM components WHERE name='Smart 450W'), 'Non-Modular', 450, 'ATX'),
((SELECT id FROM components WHERE name='CV550'), 'Non-Modular', 550, 'ATX'),
((SELECT id FROM components WHERE name='BR600W'), 'Non-Modular', 600, 'ATX'),
((SELECT id FROM components WHERE name='CX650M'), 'Semi-Modular', 650, 'ATX'),
((SELECT id FROM components WHERE name='SuperNOVA 750 G6'), 'Fully Modular', 750, 'ATX'),
((SELECT id FROM components WHERE name='RM850x'), 'Fully Modular', 850, 'ATX'),
((SELECT id FROM components WHERE name='Toughpower GF1 850W'), 'Fully Modular', 850, 'ATX'),
((SELECT id FROM components WHERE name='HX1000i'), 'Fully Modular', 1000, 'ATX'),
((SELECT id FROM components WHERE name='SuperNOVA 1200 P2'), 'Fully Modular', 1200, 'ATX'),
((SELECT id FROM components WHERE name='RM1000x Shift'), 'Fully Modular', 1000, 'ATX');

INSERT INTO cooler (component_id, type, height, max_tdp_supported) VALUES
(6, 'Air', 158, 150),
((SELECT id FROM components WHERE name='Peerless Assassin 120 SE'), 'Air', 155, 245),
((SELECT id FROM components WHERE name='Kraken Elite 360'), 'Liquid', 55, 300),
((SELECT id FROM components WHERE name='Hyper 212 RGB Black'), 'Air', 159, 180),
((SELECT id FROM components WHERE name='NH-D15'), 'Air', 165, 220),
((SELECT id FROM components WHERE name='Dark Rock Pro 4'), 'Air', 163, 250),
((SELECT id FROM components WHERE name='NH-U12S'), 'Air', 158, 165),
((SELECT id FROM components WHERE name='Vetroo V5'), 'Air', 155, 180),
((SELECT id FROM components WHERE name='Assassin X 120 Refined'), 'Air', 157, 150),
((SELECT id FROM components WHERE name='Pure Rock 2'), 'Air', 155, 150),
((SELECT id FROM components WHERE name='Fuma 3'), 'Air', 154, 220),
((SELECT id FROM components WHERE name='Kraken X63'), 'Liquid', 55, 250),
((SELECT id FROM components WHERE name='iCUE H100i Elite'), 'Liquid', 55, 250),
((SELECT id FROM components WHERE name='iCUE H150i Elite LCD'), 'Liquid', 55, 300),
((SELECT id FROM components WHERE name='Castle 280 RGB'), 'Liquid', 55, 250),
((SELECT id FROM components WHERE name='MasterLiquid ML240L'), 'Liquid', 55, 200),
((SELECT id FROM components WHERE name='Liquid Freezer II 360'), 'Liquid', 55, 320),
((SELECT id FROM components WHERE name='EK-AIO 240 D-RGB'), 'Liquid', 55, 240);

INSERT INTO cooler_cpu_sockets (cooler_id, socket) VALUES
(6, 'AM4'), (6, 'AM5'),
((SELECT id FROM components WHERE name = 'Peerless Assassin 120 SE'), 'AM4'),
((SELECT id FROM components WHERE name = 'Peerless Assassin 120 SE'), 'AM5'),
((SELECT id FROM components WHERE name = 'Peerless Assassin 120 SE'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'Kraken Elite 360'), 'AM4'),
((SELECT id FROM components WHERE name = 'Kraken Elite 360'), 'AM5'),
((SELECT id FROM components WHERE name = 'Kraken Elite 360'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'Hyper 212 RGB Black'), 'AM4'),
((SELECT id FROM components WHERE name = 'Hyper 212 RGB Black'), 'AM5'),
((SELECT id FROM components WHERE name = 'Hyper 212 RGB Black'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'Hyper 212 RGB Black'), 'LGA1200'),
((SELECT id FROM components WHERE name = 'NH-D15'), 'AM4'),
((SELECT id FROM components WHERE name = 'NH-D15'), 'AM5'),
((SELECT id FROM components WHERE name = 'NH-D15'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'NH-D15'), 'LGA1200'),
((SELECT id FROM components WHERE name = 'Dark Rock Pro 4'), 'AM4'),
((SELECT id FROM components WHERE name = 'Dark Rock Pro 4'), 'AM5'),
((SELECT id FROM components WHERE name = 'Dark Rock Pro 4'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'Dark Rock Pro 4'), 'LGA1200'),
((SELECT id FROM components WHERE name = 'NH-U12S'), 'AM4'),
((SELECT id FROM components WHERE name = 'NH-U12S'), 'AM5'),
((SELECT id FROM components WHERE name = 'NH-U12S'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'NH-U12S'), 'LGA1200'),
((SELECT id FROM components WHERE name = 'Vetroo V5'), 'AM4'),
((SELECT id FROM components WHERE name = 'Vetroo V5'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'Assassin X 120 Refined'), 'AM4'),
((SELECT id FROM components WHERE name = 'Assassin X 120 Refined'), 'AM5'),
((SELECT id FROM components WHERE name = 'Assassin X 120 Refined'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'Pure Rock 2'), 'AM4'),
((SELECT id FROM components WHERE name = 'Pure Rock 2'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'Fuma 3'), 'AM4'),
((SELECT id FROM components WHERE name = 'Fuma 3'), 'AM5'),
((SELECT id FROM components WHERE name = 'Fuma 3'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'Kraken X63'), 'AM4'),
((SELECT id FROM components WHERE name = 'Kraken X63'), 'AM5'),
((SELECT id FROM components WHERE name = 'Kraken X63'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'iCUE H100i Elite'), 'AM4'),
((SELECT id FROM components WHERE name = 'iCUE H100i Elite'), 'AM5'),
((SELECT id FROM components WHERE name = 'iCUE H100i Elite'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'iCUE H150i Elite LCD'), 'AM4'),
((SELECT id FROM components WHERE name = 'iCUE H150i Elite LCD'), 'AM5'),
((SELECT id FROM components WHERE name = 'iCUE H150i Elite LCD'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'Castle 280 RGB'), 'AM4'),
((SELECT id FROM components WHERE name = 'Castle 280 RGB'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'MasterLiquid ML240L'), 'AM4'),
((SELECT id FROM components WHERE name = 'MasterLiquid ML240L'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'Liquid Freezer II 360'), 'AM4'),
((SELECT id FROM components WHERE name = 'Liquid Freezer II 360'), 'AM5'),
((SELECT id FROM components WHERE name = 'Liquid Freezer II 360'), 'LGA1700'),
((SELECT id FROM components WHERE name = 'EK-AIO 240 D-RGB'), 'AM4'),
((SELECT id FROM components WHERE name = 'EK-AIO 240 D-RGB'), 'AM5'),
((SELECT id FROM components WHERE name = 'EK-AIO 240 D-RGB'), 'LGA1700');

INSERT INTO case_ps_form_factors (case_id, form_factor) VALUES
(5, 'ATX'),
((SELECT id FROM components WHERE name = 'H5 Flow'), 'ATX'),
((SELECT id FROM components WHERE name = '4000D Airflow'), 'ATX'),
((SELECT id FROM components WHERE name = 'O11 Dynamic Evo'), 'ATX'),
((SELECT id FROM components WHERE name = 'Versa H18'), 'ATX'),
((SELECT id FROM components WHERE name = 'H510 Elite'), 'ATX'),
((SELECT id FROM components WHERE name = 'H7 Flow'), 'ATX'),
((SELECT id FROM components WHERE name = '5000D Airflow'), 'ATX'),
((SELECT id FROM components WHERE name = '4000D RGB'), 'ATX'),
((SELECT id FROM components WHERE name = 'iCUE 5000X RGB'), 'ATX'),
((SELECT id FROM components WHERE name = 'O11 Dynamic XL'), 'ATX'),
((SELECT id FROM components WHERE name = 'Lancool 216'), 'ATX'),
((SELECT id FROM components WHERE name = 'Meshify 2 Compact'), 'ATX'),
((SELECT id FROM components WHERE name = 'Define 7'), 'ATX'),
((SELECT id FROM components WHERE name = 'Torrent Compact'), 'ATX'),
((SELECT id FROM components WHERE name = 'View 51 TG'), 'ATX'),
((SELECT id FROM components WHERE name = 'Core P3 TG'), 'ATX'),
((SELECT id FROM components WHERE name = 'H440'), 'ATX'),
((SELECT id FROM components WHERE name = 'P500A'), 'ATX'),
((SELECT id FROM components WHERE name = 'Pure Base 500DX'), 'ATX'),
((SELECT id FROM components WHERE name = 'H500'), 'ATX'),
((SELECT id FROM components WHERE name = 'RL08'), 'ATX'),
((SELECT id FROM components WHERE name = 'Air 100 ARGB'), 'ATX'),
((SELECT id FROM components WHERE name = 'CC560'), 'ATX'),
((SELECT id FROM components WHERE name = 'DF700 Flux'), 'ATX');

INSERT INTO sound_card (component_id, sample_rate, bit_depth, chipset, interface, channel) VALUES 
(9, 192000, 24, 'SoundCore', 'PCIe', '7.1'),
((SELECT id FROM components WHERE name='Sound BlasterX AE-5 Plus'), 192000, 32, 'SB1508', 'PCIe', '7.1'),
((SELECT id FROM components WHERE name='Xonar SE'), 192000, 24, 'CM6620', 'PCIe', '5.1'),
((SELECT id FROM components WHERE name='Sound Blaster Z'), 192000, 24, 'SB1502', 'PCIe', '5.1'),
((SELECT id FROM components WHERE name='Audigy FX'), 192000, 24, 'CA20K2', 'PCIe', '5.1'),
((SELECT id FROM components WHERE name='Xonar U7'), 192000, 24, 'CM6632AX', 'USB', '7.1');

INSERT INTO network_card (component_id, num_ports, speed, interface) VALUES 
(10, 2, 1000, 'PCIe'),
((SELECT id FROM components WHERE name='PRO/1000 PT'), 2, 1000, 'PCIe'),
((SELECT id FROM components WHERE name='TG-3468'), 1, 1000, 'PCIe'),
((SELECT id FROM components WHERE name='PCE-AC68'), 1, 1300, 'PCIe'),
((SELECT id FROM components WHERE name='XG-C100C'), 1, 10000, 'PCIe'),
((SELECT id FROM components WHERE name='Killer E3100G'), 1, 2500, 'PCIe');

INSERT INTO network_adapter (component_id, wifi_version, interface, num_antennas) VALUES 
(11, 'WiFi 6', 'PCIe', 3),
((SELECT id FROM components WHERE name='Archer TX3000E'), 'WiFi 6', 'PCIe', 2),
((SELECT id FROM components WHERE name='AX200'), 'WiFi 6', 'M.2', 2),
((SELECT id FROM components WHERE name='PCE-AXE5400'), 'WiFi 6E', 'PCIe', 4),
((SELECT id FROM components WHERE name='Archer T6E'), 'WiFi 5', 'PCIe', 2),
((SELECT id FROM components WHERE name='WN7200ND'), 'WiFi 4', 'PCIe', 2);

INSERT INTO optical_drive (component_id, form_factor, type, interface, write_speed, read_speed) VALUES 
(12, '5.25"', 'DVD-RW', 'SATA', 16, 16),
((SELECT id FROM components WHERE name='DVD-RW Drive'), '5.25"', 'DVD-RW', 'SATA', 24, 24),
((SELECT id FROM components WHERE name='Slim DVD Writer'), 'Slim', 'DVD-RW', 'SATA', 8, 8),
((SELECT id FROM components WHERE name='BDR-XD07B'), 'Slim', 'BD-RE', 'USB', 6, 6),
((SELECT id FROM components WHERE name='BP60NB10'), 'Slim', 'BD-RE', 'USB', 6, 6),
((SELECT id FROM components WHERE name='Blu-ray Writer'), '5.25"', 'BD-RE', 'SATA', 16, 16);

INSERT INTO memory_card (component_id, num_slots, interface) VALUES 
(13, 1, 'PCIe'),
((SELECT id FROM components WHERE name='M.2 NVMe Adapter Card'), 1, 'PCIe x4'),
((SELECT id FROM components WHERE name='Dual M.2 PCIe Card'), 2, 'PCIe x8'),
((SELECT id FROM components WHERE name='Quad M.2 RAID Card'), 4, 'PCIe x16'),
((SELECT id FROM components WHERE name='U.2 NVMe Adapter'), 1, 'PCIe x4'),
((SELECT id FROM components WHERE name='Triple M.2 Expansion'), 3, 'PCIe x16');

INSERT INTO cables (component_id, length_cm, type) VALUES 
(14, 50, 'SATA'),
((SELECT id FROM components WHERE name='USB 3.0 Extension 6ft'), 180, 'USB'),
((SELECT id FROM components WHERE name='SATA III Cable 3-Pack'), 50, 'SATA'),
((SELECT id FROM components WHERE name='Premium Sleeved Cables'), 60, 'PSU'),
((SELECT id FROM components WHERE name='DisplayPort 1.4 Cable'), 180, 'DisplayPort'),
((SELECT id FROM components WHERE name='USB-C to USB-A Cable'), 100, 'USB'),
((SELECT id FROM components WHERE name='HDMI 2.1 Cable 10ft'), 300, 'HDMI'),
((SELECT id FROM components WHERE name='PWM Fan Splitter Cable'), 30, 'Fan'),
((SELECT id FROM components WHERE name='RGB LED Strip Extension'), 50, 'RGB'),
((SELECT id FROM components WHERE name='PCIe 4.0 Riser Cable'), 30, 'PCIe'),
((SELECT id FROM components WHERE name='Molex to SATA Power'), 20, 'Power');

INSERT INTO build (user_id, name, created_at, description, total_price, is_approved) VALUES
((SELECT id FROM users WHERE username='tome'), 'Gaming Build', '2025-09-18', 'Mid-range gaming PC', 1154.92, TRUE);

INSERT INTO build_component (build_id, component_id) VALUES
  ((SELECT id FROM build WHERE name = 'Gaming Build'),(SELECT id FROM components WHERE name = 'Ryzen 7 5800X')),
  ((SELECT id FROM build WHERE name = 'Gaming Build'),(SELECT id FROM components WHERE name = 'RTX 3060')),
  ((SELECT id FROM build WHERE name = 'Gaming Build'),(SELECT id FROM components WHERE name = 'B550M TUF Gaming')),
  ((SELECT id FROM build WHERE name = 'Gaming Build'),(SELECT id FROM components WHERE name = 'Fury Beast 16GB')),
  ((SELECT id FROM build WHERE name = 'Gaming Build'),(SELECT id FROM components WHERE name = 'Samsung 980 Pro 1TB')),
  ((SELECT id FROM build WHERE name = 'Gaming Build'),(SELECT id FROM components WHERE name = 'CX650M')),
  ((SELECT id FROM build WHERE name = 'Gaming Build'),(SELECT id FROM components WHERE name = '4000D Airflow')),
  ((SELECT id FROM build WHERE name = 'Gaming Build'), (SELECT id FROM components WHERE name = 'NH-U12S'));

INSERT INTO build (user_id, name, created_at, description, total_price, is_approved) VALUES
((SELECT id FROM users WHERE username='budget_king'), 'Console Killer 2025', '2024-12-01', 'Cheap entry level gaming PC', 580.00, TRUE);

INSERT INTO build_component (build_id, component_id) VALUES
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM components WHERE name='Core i3-13100F')),
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM components WHERE name='Radeon RX 6600')),
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM components WHERE name='B760M Bomber WiFi')),
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM components WHERE name='Vengeance LPX 16GB')),
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM components WHERE name='Crucial P3 1TB')),
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM components WHERE name='Smart 500W')),
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM components WHERE name='Versa H18'));

INSERT INTO build (user_id, name, created_at, description, total_price, is_approved) VALUES
((SELECT id FROM users WHERE username='streamer_pro'), 'Pro Streaming Rig', '2025-01-15', 'Handles OBS and 1440p gaming flawlessly', 2150.00, TRUE);

INSERT INTO build_component (build_id, component_id) VALUES
((SELECT id FROM build WHERE name='Pro Streaming Rig'), (SELECT id FROM components WHERE name='Core i7-14700K')),
((SELECT id FROM build WHERE name='Pro Streaming Rig'), (SELECT id FROM components WHERE name='GeForce RTX 4080 Super')),
((SELECT id FROM build WHERE name='Pro Streaming Rig'), (SELECT id FROM components WHERE name='Z790 Maximus Hero')),
((SELECT id FROM build WHERE name='Pro Streaming Rig'), (SELECT id FROM components WHERE name='Trident Z5 RGB 32GB')),
((SELECT id FROM build WHERE name='Pro Streaming Rig'), (SELECT id FROM components WHERE name='WD Black SN850X 2TB')),
((SELECT id FROM build WHERE name='Pro Streaming Rig'), (SELECT id FROM components WHERE name='SuperNOVA 1000 GT')),
((SELECT id FROM build WHERE name='Pro Streaming Rig'), (SELECT id FROM components WHERE name='H5 Flow')),
((SELECT id FROM build WHERE name='Pro Streaming Rig'), (SELECT id FROM components WHERE name='Kraken Elite 360'));

INSERT INTO build (user_id, name, created_at, description, total_price, is_approved) VALUES
((SELECT id FROM users WHERE username='pc_wizard'), 'Team Red Value King', '2025-02-10', 'Pure rasterization performance', 1450.00, TRUE);

INSERT INTO build_component (build_id, component_id) VALUES
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM components WHERE name='Ryzen 7 7800X3D')),
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM components WHERE name='Radeon RX 7800 XT')),
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM components WHERE name='B650M DS3H')),
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM components WHERE name='Trident Z5 RGB 32GB')),
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM components WHERE name='Crucial P3 1TB')),
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM components WHERE name='RM750e')),
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM components WHERE name='4000D Airflow')),
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM components WHERE name='Peerless Assassin 120 SE'));

INSERT INTO build (user_id, name, created_at, description, total_price, is_approved) VALUES
((SELECT id FROM users WHERE username='rgb_lover'), 'God Tier 4090 Build', '2025-03-01', 'Money is no object. 4K 144Hz Ultra.', 4200.00, TRUE);

INSERT INTO build_component (build_id, component_id) VALUES
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM components WHERE name='Core i9-14900KS')),
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM components WHERE name='GeForce RTX 4090')),
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM components WHERE name='Z790 Maximus Hero')),
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM components WHERE name='Dominator Platinum 64GB')),
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM components WHERE name='Samsung 990 Pro 4TB')),
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM components WHERE name='SuperNOVA 1000 GT')),
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM components WHERE name='O11 Dynamic Evo')),
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM components WHERE name='Kraken Elite 360'));

INSERT INTO build (user_id, name, created_at, description, total_price, is_approved) VALUES
((SELECT id FROM users WHERE username='first_timer'), 'Snow White Build', '2024-11-20', 'First time building, went for looks', 1199.00, TRUE);

INSERT INTO build_component (build_id, component_id) VALUES
((SELECT id FROM build WHERE name='Snow White Build'), (SELECT id FROM components WHERE name='Ryzen 5 7600')),
((SELECT id FROM build WHERE name='Snow White Build'), (SELECT id FROM components WHERE name='GeForce RTX 4070 Super')),
((SELECT id FROM build WHERE name='Snow White Build'), (SELECT id FROM components WHERE name='B650M DS3H')),
((SELECT id FROM build WHERE name='Snow White Build'), (SELECT id FROM components WHERE name='Trident Z5 RGB 32GB')),
((SELECT id FROM build WHERE name='Snow White Build'), (SELECT id FROM components WHERE name='Crucial P3 1TB')),
((SELECT id FROM build WHERE name='Snow White Build'), (SELECT id FROM components WHERE name='RM750e')),
((SELECT id FROM build WHERE name='Snow White Build'), (SELECT id FROM components WHERE name='H5 Flow'));

INSERT INTO build (user_id, name, created_at, description, total_price, is_approved) VALUES
((SELECT id FROM users WHERE username='linux_fan'), 'Arch Linux Dev Box', '2024-10-15', 'Compilation beast, no Nvidia drivers needed', 920.00, TRUE);

INSERT INTO build_component (build_id, component_id) VALUES
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM components WHERE name='Core i5-13600K')),
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM components WHERE name='Radeon RX 7600')),
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM components WHERE name='B760M Bomber WiFi')),
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM components WHERE name='Ripjaws V 32GB')),
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM components WHERE name='Crucial P3 1TB')),
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM components WHERE name='RM750e')),
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM components WHERE name='Versa H18'));

INSERT INTO build (user_id, name, created_at, description, total_price, is_approved) VALUES
((SELECT id FROM users WHERE username='office_guy'), '1080p Gamer', '2025-01-05', 'Just for Fortnite and Apex', 810.00, TRUE);

INSERT INTO build_component (build_id, component_id) VALUES
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM components WHERE name='Core i3-13100F')),
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM components WHERE name='GeForce RTX 4060')),
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM components WHERE name='B760M Bomber WiFi')),
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM components WHERE name='Vengeance LPX 16GB')),
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM components WHERE name='Crucial P3 1TB')),
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM components WHERE name='Smart 500W')),
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM components WHERE name='Versa H18'));

INSERT INTO build (user_id, name, created_at, description, total_price, is_approved) VALUES
((SELECT id FROM users WHERE username='pc_wizard'), 'Silent Night', '2024-12-25', 'Zero RPM fan mode build', 2450.00, TRUE);

INSERT INTO build_component (build_id, component_id) VALUES
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM components WHERE name='Core i7-14700K')),
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM components WHERE name='GeForce RTX 4080 Super')),
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM components WHERE name='Z790 Maximus Hero')),
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM components WHERE name='Trident Z5 RGB 32GB')),
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM components WHERE name='WD Black SN850X 2TB')),
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM components WHERE name='SuperNOVA 1000 GT')),
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM components WHERE name='4000D Airflow')),
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM components WHERE name='Peerless Assassin 120 SE'));

INSERT INTO build (user_id, name, created_at, description, total_price, is_approved) VALUES
((SELECT id FROM users WHERE username='rgb_lover'), 'Radeon Ultimate', '2025-03-10', '4K Gaming without Nvidia tax', 2850.00, TRUE);

INSERT INTO build_component (build_id, component_id) VALUES
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM components WHERE name='Ryzen 9 7950X')),
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM components WHERE name='Radeon RX 7900 XTX')),
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM components WHERE name='X670E AORUS Master')),
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM components WHERE name='Dominator Platinum 64GB')),
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM components WHERE name='Samsung 990 Pro 4TB')),
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM components WHERE name='SuperNOVA 1000 GT')),
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM components WHERE name='O11 Dynamic Evo')),
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM components WHERE name='Kraken Elite 360'));

-- Ratings & Reviews
INSERT INTO rating_build (build_id, user_id, value) VALUES (1, 2, 5);
INSERT INTO review (build_id, user_id, content, created_at) VALUES (1, 2, 'Still runs everything in 2025!', CURRENT_DATE);

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM users WHERE username='rgb_lover'), 3),
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM users WHERE username='pc_wizard'), 4);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM users WHERE username='rgb_lover'), 'No RGB, 3 stars.', '2024-12-05'),
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM users WHERE username='pc_wizard'), 'Solid entry-level build. Beats PS5 performance per dollar.', '2024-12-02'); -- ADDED

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Pro Streaming Rig'), (SELECT id FROM users WHERE username='pc_wizard'), 5);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='Pro Streaming Rig'), (SELECT id FROM users WHERE username='pc_wizard'), 'Zero dropped frames at 1440p/144Hz. Encoder handles everything.', '2025-01-16');

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM users WHERE username='budget_king'), 5),
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM users WHERE username='first_timer'), 4);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM users WHERE username='budget_king'), 'Best FPS per dollar.', '2025-02-12'),
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM users WHERE username='first_timer'), 'Great build guide for beginners. Assembly was straightforward.', '2025-02-14'); -- ADDED

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM users WHERE username='streamer_pro'), 5),
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM users WHERE username='budget_king'), 2);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM users WHERE username='budget_king'), 'Waaaaay too much money.', '2025-03-05'),
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM users WHERE username='streamer_pro'), 'Streams in 4K while gaming at max settings. Insane power!', '2025-03-06'); -- ADDED

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Snow White Build'), (SELECT id FROM users WHERE username='rgb_lover'), 5),
((SELECT id FROM build WHERE name='Snow White Build'), (SELECT id FROM users WHERE username='office_guy'), 4);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='Snow White Build'), (SELECT id FROM users WHERE username='rgb_lover'), 'Beautiful RGB setup with white theme. Looks amazing!', '2024-11-21'),
((SELECT id FROM build WHERE name='Snow White Build'), (SELECT id FROM users WHERE username='office_guy'), 'Clean aesthetic but a bit pricey for the performance.', '2024-11-22');

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM users WHERE username='linux_fan'), 5),
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM users WHERE username='first_timer'), 1);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM users WHERE username='first_timer'), 'Could not install Windows easily.', '2024-10-20'),
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM users WHERE username='linux_fan'), 'Compiles kernels like a beast. Perfect Linux workstation.', '2024-10-16'); -- ADDED

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM users WHERE username='streamer_pro'), 2),
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM users WHERE username='budget_king'), 3);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM users WHERE username='streamer_pro'), 'Stutters in Warzone.', '2025-01-10'),
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM users WHERE username='budget_king'), 'Decent 1080p performance but could use more GPU power.', '2025-01-12'); -- ADDED

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM users WHERE username='rgb_lover'), 2),
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM users WHERE username='office_guy'), 5);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM users WHERE username='rgb_lover'), 'Not enough RGB! Boring aesthetics.', '2024-12-26'),
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM users WHERE username='office_guy'), 'Whisper quiet even under full load. Perfect for my office!', '2024-12-27');

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM users WHERE username='pc_wizard'), 5),
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM users WHERE username='linux_fan'), 5);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM users WHERE username='pc_wizard'), 'Red team absolutely crushes 4K gaming. No regrets.', '2025-03-11'),
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM users WHERE username='linux_fan'), 'AMD drivers work flawlessly on Linux. Peak gaming experience.', '2025-03-12');

INSERT INTO case_storage_form_factors (case_id, form_factor, num_slots) VALUES
((SELECT id FROM components WHERE name = 'H5 Flow'), '3.5', 2),
((SELECT id FROM components WHERE name = '4000D Airflow'), '3.5', 2),
((SELECT id FROM components WHERE name = '5000D Airflow'), '3.5', 2),
((SELECT id FROM components WHERE name = 'O11 Dynamic Evo'), '3.5', 2),
((SELECT id FROM components WHERE name = 'Define 7'), '3.5', 4),
((SELECT id FROM components WHERE name = 'Meshify 2 Compact'), '3.5', 2),
((SELECT id FROM components WHERE name = 'Lancool 216'), '3.5', 2);

INSERT INTO case_storage_form_factors (case_id, form_factor, num_slots) VALUES
((SELECT id FROM components WHERE name = 'H5 Flow'), '2.5', 4),
((SELECT id FROM components WHERE name = '4000D Airflow'), '2.5', 2),
((SELECT id FROM components WHERE name = 'Versa H18'), '2.5', 2);

INSERT INTO suggestions (user_id, admin_id, link, admin_comment, description, status, component_type) VALUES
(1, 4, 'https://www.gigabyte.com/Graphics-Card/GV-N4070WF3OC-12GD-rev-10', NULL, 'Consider adding the NVIDIA RTX 4070', 'pending', 'gpu'),
(5, 4, 'https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-7000-series/amd-ryzen-5-7600x.html#amd_support_product_spec', NULL, 'Consider adding the Ryzen 5 7600x', 'pending', 'cpu'),
(11, NULL, 'https://www.corsair.com/us/en/p/pc-cases/cc-9011251-ww/3000d-tempered-glass-mid-tower-black-cc-9011251-ww', NULL, 'Please add the Corsair 3000D Airflow case', 'pending', 'case');`

const triggerSQL = `
CREATE OR REPLACE FUNCTION update_build_total_price()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
DECLARE
    target_build_id INT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_build_id := OLD.build_id;
    ELSE
        target_build_id := NEW.build_id;
    END IF;

    UPDATE "build"
    SET "total_price" = (
        SELECT COALESCE(SUM(c.price * bc.num_components), 0)
        FROM "build_component" bc
        JOIN "components" c ON bc.component_id = c.id
        WHERE bc.build_id = target_build_id
    )
    WHERE id = target_build_id;

    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trigger_auto_update_price ON "build_component";
CREATE TRIGGER trigger_auto_update_price
AFTER INSERT OR UPDATE OR DELETE ON "build_component"
FOR EACH ROW
EXECUTE FUNCTION update_build_total_price();



CREATE OR REPLACE FUNCTION check_review_validity()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
DECLARE
    build_owner_id INT;
BEGIN
    SELECT user_id INTO build_owner_id FROM "build" WHERE id = NEW.build_id;

    IF NEW.user_id = build_owner_id THEN
        RAISE EXCEPTION 'Cannot review own builds.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_check_self_review ON "review";
CREATE TRIGGER trigger_check_self_review
BEFORE INSERT ON "review"
FOR EACH ROW
EXECUTE FUNCTION check_review_validity();



CREATE OR REPLACE FUNCTION check_rating_validity()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
DECLARE
    build_owner_id INT;
BEGIN
    SELECT user_id INTO build_owner_id FROM "build" WHERE id = NEW.build_id;

    IF NEW.user_id = build_owner_id THEN
        RAISE EXCEPTION 'Cannot rate own builds.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_check_self_rating ON "rating_build";
CREATE TRIGGER trigger_check_self_rating
BEFORE INSERT ON "rating_build"
FOR EACH ROW
EXECUTE FUNCTION check_rating_validity();
`

const functionSQL = `
CREATE OR REPLACE FUNCTION get_report_top_components()
    RETURNS TABLE (
                      type TEXT,
                      brand TEXT,
                      name TEXT,
                      usage_count BIGINT,
                      avg_build_rating NUMERIC
                  )
    LANGUAGE sql
AS $$
SELECT
    c.type,
    c.brand,
    c.name,
    COUNT(bc.component_id) AS usage_count,
    AVG(rb.value) AS avg_build_rating
FROM components c
         JOIN build_component bc ON c.id = bc.component_id
         JOIN build b ON bc.build_id = b.id
         JOIN rating_build rb ON b.id = rb.build_id
WHERE b.created_at >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY c.type, c.brand, c.name
HAVING AVG(rb.value) >= 4.5
ORDER BY usage_count DESC, avg_build_rating DESC
LIMIT 15;
$$;



CREATE OR REPLACE FUNCTION get_report_user_reputation_leaderboard()
    RETURNS TABLE (
                      username TEXT,
                      email TEXT,
                      approved_builds_count BIGINT,
                      total_favorites_received BIGINT,
                      avg_rating_received NUMERIC,
                      reputation_score NUMERIC
                  )
    LANGUAGE sql
AS $$
WITH build_stats AS (
    SELECT
        b.id AS build_id,
        b.user_id,
        COUNT(DISTINCT fb.user_id) AS favorites_count,
        AVG(rb.value) AS avg_rating
    FROM build b
             LEFT JOIN favorite_build fb ON b.id = fb.build_id
             LEFT JOIN rating_build rb ON b.id = rb.build_id
    WHERE b.is_approved = TRUE
    GROUP BY b.id, b.user_id
),
     user_stats AS (
         SELECT
             user_id,
             COUNT(build_id) AS approved_builds_count,
             COALESCE(SUM(favorites_count), 0) AS total_favorites_received,
             AVG(avg_rating) AS avg_rating_received
         FROM build_stats
         GROUP BY user_id
     )
SELECT
    u.username,
    u.email,
    us.approved_builds_count,
    us.total_favorites_received,
    ROUND(CAST(COALESCE(us.avg_rating_received, 0) AS numeric), 2) AS avg_rating_received,
    (
        (us.approved_builds_count * 10) +
        (us.total_favorites_received * 5) +
        (COALESCE(us.avg_rating_received, 0) * 20)
        ) AS reputation_score
FROM user_stats us
         JOIN users u ON u.id = us.user_id
ORDER BY reputation_score DESC
LIMIT 10;
$$;



CREATE OR REPLACE FUNCTION get_report_price_to_performance()
    RETURNS TABLE (
                      build_name TEXT,
                      cpu_model TEXT,
                      gpu_model TEXT,
                      total_price NUMERIC,
                      performance_score NUMERIC,
                      price_to_performance_index NUMERIC
                  )
    LANGUAGE sql
AS $$
WITH cpu_per_build AS (
    SELECT
        b.id AS build_id,
        c.name AS cpu_model,
        cpu.cores,
        cpu.base_clock
    FROM build b
             JOIN build_component bc ON b.id = bc.build_id
             JOIN components c ON bc.component_id = c.id
             JOIN cpu ON c.id = cpu.component_id
    WHERE LOWER(c.type) = LOWER('CPU')
),
     gpu_per_build AS (
         SELECT
             b.id AS build_id,
             c.name AS gpu_model,
             gpu.vram
         FROM build b
                  JOIN build_component bc ON b.id = bc.build_id
                  JOIN components c ON bc.component_id = c.id
                  JOIN gpu ON c.id = gpu.component_id
         WHERE LOWER(c.type) = LOWER('GPU')
     )
SELECT
    b.name AS build_name,
    cpu.cpu_model,
    gpu.gpu_model,
    b.total_price,
    (cpu.cores * cpu.base_clock + gpu.vram * 100) AS performance_score,
    ROUND(
            CAST(
                    (cpu.cores * cpu.base_clock + gpu.vram * 100) / NULLIF(b.total_price, 0)
                AS numeric),
            4
    ) AS price_to_performance_index
FROM build b
         JOIN cpu_per_build cpu ON b.id = cpu.build_id
         JOIN gpu_per_build gpu ON b.id = gpu.build_id
WHERE b.total_price > 0
ORDER BY price_to_performance_index DESC
LIMIT 20;
$$;



CREATE OR REPLACE FUNCTION get_report_budget_tier_popularity()
    RETURNS TABLE (
                      price_tier TEXT,
                      builds_count BIGINT,
                      avg_favorites NUMERIC,
                      avg_rating NUMERIC,
                      unique_builders BIGINT,
                      engagement_score NUMERIC
                  )
    LANGUAGE sql
AS $$
WITH price_tier_builds AS (
    SELECT
        b.id AS build_id,
        b.user_id,
        b.total_price,
        CASE
            WHEN b.total_price < 500 THEN 'Budget'
            WHEN b.total_price < 1000 THEN 'Mid-Range'
            WHEN b.total_price < 2000 THEN 'High-End'
            ELSE 'Enthusiast'
            END AS price_tier
    FROM build b
    WHERE b.is_approved = TRUE
      AND b.created_at >= CURRENT_DATE - INTERVAL '6 months'
),
     favorites AS (
         SELECT
             build_id,
             COUNT(DISTINCT user_id) AS favorites_count
         FROM favorite_build
         GROUP BY build_id
     ),
     engagement_stats AS (
         SELECT
             ptb.price_tier,
             COUNT(DISTINCT ptb.build_id) AS builds_count,
             AVG(COALESCE(f.favorites_count, 0)) AS avg_favorites,
             AVG(rb.value) AS avg_rating,
             COUNT(DISTINCT ptb.user_id) AS unique_builders
         FROM price_tier_builds ptb
                  LEFT JOIN rating_build rb ON ptb.build_id = rb.build_id
                  LEFT JOIN favorites f ON ptb.build_id = f.build_id
         GROUP BY ptb.price_tier
     )
SELECT
    price_tier,
    builds_count,
    ROUND(CAST(avg_favorites AS numeric), 1) AS avg_favorites,
    ROUND(CAST(COALESCE(avg_rating, 0) AS numeric), 2) AS avg_rating,
    unique_builders,
    ROUND(
            CAST(
                    (builds_count * 2) +
                    (avg_favorites * 3) +
                    (COALESCE(avg_rating, 0) * 10) +
                    (unique_builders * 1.5)
                AS numeric),
            2
    ) AS engagement_score
FROM engagement_stats
ORDER BY engagement_score DESC
LIMIT 15;
$$;



CREATE OR REPLACE FUNCTION get_report_compatibility()
    RETURNS TABLE (
                      cpu_combo TEXT,
                      motherboard_chipset TEXT,
                      total_builds BIGINT,
                      avg_satisfaction NUMERIC,
                      success_rate NUMERIC
                  )
    LANGUAGE sql
AS $$
WITH cpu_mobo_pairs AS (
    SELECT
        cpu_comp.brand AS cpu_brand,
        cpu_comp.name AS cpu_model,
        mobo.chipset AS motherboard_chipset,
        b.id AS build_id,
        b.user_id,
        b.created_at
    FROM build b
             JOIN build_component bc_cpu ON b.id = bc_cpu.build_id
             JOIN components cpu_comp ON bc_cpu.component_id = cpu_comp.id
             JOIN cpu ON cpu.component_id = cpu_comp.id
             JOIN build_component bc_mobo ON b.id = bc_mobo.build_id
             JOIN components mobo_comp ON bc_mobo.component_id = mobo_comp.id
             JOIN motherboard mobo ON mobo.component_id = mobo_comp.id
    WHERE b.is_approved = TRUE
),
     recent_activity AS (
         SELECT DISTINCT build_id
         FROM review
         WHERE created_at >= CURRENT_DATE - INTERVAL '3 months'
     ),
     pair_metrics AS (
         SELECT
             cmp.cpu_brand,
             cmp.cpu_model,
             cmp.motherboard_chipset,
             COUNT(DISTINCT cmp.build_id) AS total_builds,
             AVG(COALESCE(rb.value, 0)) AS avg_satisfaction,
             COUNT(DISTINCT ra.build_id) AS active_builds
         FROM cpu_mobo_pairs cmp
                  LEFT JOIN rating_build rb ON cmp.build_id = rb.build_id
                  LEFT JOIN recent_activity ra ON cmp.build_id = ra.build_id
         GROUP BY
             cmp.cpu_brand,
             cmp.cpu_model,
             cmp.motherboard_chipset
         HAVING COUNT(DISTINCT cmp.build_id) >= 2
     )
SELECT
    CONCAT(cpu_brand, ' ', cpu_model) AS cpu_combo,
    motherboard_chipset,
    total_builds,
    ROUND(CAST(avg_satisfaction AS numeric), 2) AS avg_satisfaction,
    ROUND(
            CAST(
                    (avg_satisfaction / 5.0) * 0.6 +
                    (CAST(active_builds AS DECIMAL) / total_builds) * 0.4
                AS numeric),
            3
    ) AS success_rate
FROM pair_metrics
ORDER BY success_rate DESC, total_builds DESC
LIMIT 15;
$$;



CREATE OR REPLACE FUNCTION get_report_storage_optimization()
    RETURNS TABLE (
                      config_type TEXT,
                      ssd_brand TEXT,
                      builds_count BIGINT,
                      avg_storage_cost NUMERIC,
                      avg_total_capacity_gb NUMERIC,
                      avg_build_rating NUMERIC,
                      storage_cost_pct NUMERIC,
                      optimization_score NUMERIC
                  )
    LANGUAGE sql
AS $$
WITH storage_configs AS (
    SELECT
        b.id AS build_id,
        b.total_price,

        ssd_comp.brand AS ssd_brand,
        ssd_storage.capacity AS ssd_capacity,
        ssd_comp.price AS ssd_price,

        hdd_storage.capacity AS hdd_capacity,
        hdd_comp.price AS hdd_price,

        CASE
            WHEN hdd_storage.capacity IS NULL THEN 'SSD-Only'
            WHEN ssd_storage.capacity < 512 THEN 'SSD-Boot-HDD-Storage'
            ELSE 'SSD-Primary-HDD-Archive'
            END AS config_type
    FROM build b
             JOIN build_component bc_ssd ON b.id = bc_ssd.build_id
             JOIN components ssd_comp ON bc_ssd.component_id = ssd_comp.id
             JOIN storage ssd_storage ON ssd_storage.component_id = ssd_comp.id

             LEFT JOIN build_component bc_hdd ON b.id = bc_hdd.build_id
             LEFT JOIN components hdd_comp ON bc_hdd.component_id = hdd_comp.id
             LEFT JOIN storage hdd_storage ON hdd_storage.component_id = hdd_comp.id

    WHERE ssd_comp.type = 'storage'
      AND b.is_approved = TRUE
      AND b.created_at >= CURRENT_DATE - INTERVAL '1 year'

      AND (
        ssd_storage.type ILIKE '%nvme%'
            OR ssd_storage.type ILIKE '%ssd%'
            OR ssd_storage.type ILIKE '%m.2%'
            OR ssd_storage.form_factor ILIKE '%m.2%'
        )
      AND (
        hdd_storage.component_id IS NULL
            OR hdd_storage.type ILIKE '%hdd%'
            OR hdd_storage.form_factor ILIKE '%3.5%'
        )
),
     config_performance AS (
         SELECT
             sc.config_type,
             sc.ssd_brand,
             COUNT(sc.build_id) AS builds_count,
             AVG(sc.ssd_price + COALESCE(sc.hdd_price, 0)) AS avg_storage_cost,
             AVG(sc.ssd_capacity + COALESCE(sc.hdd_capacity, 0)) AS avg_total_capacity,
             AVG(rb.value) AS avg_build_rating,
             AVG((sc.ssd_price + COALESCE(sc.hdd_price, 0)) / NULLIF(sc.total_price, 0)) AS storage_cost_ratio
         FROM storage_configs sc
                  LEFT JOIN rating_build rb ON sc.build_id = rb.build_id
         GROUP BY sc.config_type, sc.ssd_brand
         HAVING COUNT(sc.build_id) >= 2
     )
SELECT
    config_type,
    ssd_brand,
    builds_count,
    ROUND(CAST(avg_storage_cost AS numeric), 2) AS avg_storage_cost,
    ROUND(CAST(avg_total_capacity AS numeric), 0) AS avg_total_capacity_gb,
    ROUND(CAST(COALESCE(avg_build_rating, 0) AS numeric), 2) AS avg_build_rating,
    ROUND(CAST(COALESCE(storage_cost_ratio, 0) * 100 AS numeric), 1) AS storage_cost_pct,
    ROUND(
            CAST(
                    (COALESCE(avg_build_rating, 0) / 5.0 * 40) +
                    (avg_total_capacity / NULLIF(avg_storage_cost, 0) * 0.5) +
                    ((1 - COALESCE(storage_cost_ratio, 0)) * 30) +
                    (LN(CAST(builds_count + 1 AS numeric)) * 5)
                AS numeric),
            2
    ) AS optimization_score
FROM config_performance
ORDER BY optimization_score DESC, builds_count DESC
LIMIT 15;
$$;
`

async function seed() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable not set');
    }

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();

        console.log('Checking if database needs seeding...');

        const result = await client.query('SELECT COUNT(*) as count FROM users');
        const count = parseInt(result.rows[0].count);

        if (count === 0) {
            console.log('Seeding initial data...');
            await client.query(dataSQL);
            console.log('Data seeded successfully.');
        } else {
            console.log('Database already contains data, skipping data seed.');
        }

        console.log('Applying Database Triggers...');
        await client.query(triggerSQL);

        console.log('Applying Database Functions...');
        await client.query(functionSQL);

        console.log('Database seeded successfully...');
    } catch (error) {
        console.error('Seed failed:', error);
        throw error;
    } finally {
        await client.end();
    }
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});