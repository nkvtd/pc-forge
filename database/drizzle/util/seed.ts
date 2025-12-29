import pg from 'pg';

const seedSQL = `
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
('Ryzen 5 5600X', 'AMD', 199.99, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-5-5600.png'),          
('RTX 3060', 'NVIDIA', 329.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-3060.png'),           
('16GB DDR4 Kit', 'Corsair', 79.99, 'memory', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),       
('650W PSU', 'EVGA', 89.99, 'power_supply', 'https://cdn.brandfetch.io/iddPf9bbl3/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),               
('Mid Tower Case', 'NZXT', 119.99, 'case', 'https://nzxt.com/cdn/shop/files/h5-elite-hero-black.png?v=1744789660&width=2000'),      
('Air Cooler', 'Noctua', 69.99, 'cooler', 'https://cdn.brandfetch.io/idSeoCDyH9/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),           
('B550 Motherboard', 'ASUS', 149.99, 'motherboard', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),      
('1TB NVMe SSD', 'Samsung', 129.99, 'storage', 'https://cdn.brandfetch.io/iduaw_nOnR/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),       
('Sound Card', 'Creative', 59.99, 'sound_card', NULL),        
('Network Card', 'Intel', 39.99, 'network_card', 'https://cdn.brandfetch.io/idTGhLyv09/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),         
('Network Adapter', 'TP-Link', 29.99, 'network_adapter', 'https://cdn.brandfetch.io/idfUqCiOVX/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),     
('Optical Drive', 'LG', 19.99, 'optical_drive', 'https://cdn.brandfetch.io/idEI6u48uh/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),           
('Memory Card', 'SanDisk', 15.99, 'memory_card', 'https://cdn.brandfetch.io/idM3tf3Iq8/w/800/h/800/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),        
('Cables Pack', 'Corsair', 9.99, 'cables', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('Ryzen 5 7600', 'AMD', 229.00, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-5-7600.png'),
('Ryzen 7 7800X3D', 'AMD', 399.00, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-7-7800x3d.png'),
('Ryzen 9 7950X', 'AMD', 599.00, 'cpu', 'https://static.hardwaredb.net/badges/ryzen-9-7950x.png'),
('Core i3-13100F', 'Intel', 119.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i3-13100.png'),
('Core i5-13600K', 'Intel', 319.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i5-13600k.png'),
('Core i7-14700K', 'Intel', 409.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i7-14700k.png'),
('Core i9-14900KS', 'Intel', 689.99, 'cpu', 'https://static.hardwaredb.net/badges/core-i9-14900ks.png'),
('Radeon RX 6600', 'PowerColor', 199.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-6600.png'),
('Radeon RX 7600', 'Sapphire', 269.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-7600.png'),
('Radeon RX 7800 XT', 'XFX', 499.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-7800-xt.png'),
('Radeon RX 7900 XTX', 'Sapphire', 999.99, 'gpu', 'https://static.hardwaredb.net/badges/radeon-rx-7900-xtx.png'),
('GeForce RTX 3050', 'MSI', 229.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-3050.png'),
('GeForce RTX 4060', 'Zotac', 299.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-4060.png'),
('GeForce RTX 4070 Super', 'ASUS', 599.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-4070-super.png'),
('GeForce RTX 4080 Super', 'Gigabyte', 999.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-4080-super.png'),
('GeForce RTX 4090', 'NVIDIA', 1599.99, 'gpu', 'https://static.hardwaredb.net/badges/geforce-rtx-4090.png'),
('B650M DS3H', 'Gigabyte', 149.99, 'motherboard', 'https://images.seeklogo.com/logo-png/39/1/gigabyte-logo-png_seeklogo-398170.png'),
('X670E AORUS Master', 'Gigabyte', 459.99, 'motherboard', 'https://images.seeklogo.com/logo-png/39/1/gigabyte-logo-png_seeklogo-398170.png'),
('B760M Bomber WiFi', 'MSI', 129.99, 'motherboard', 'https://images.seeklogo.com/logo-png/30/1/msi-logo-png_seeklogo-304877.png'),
('Z790 Maximus Hero', 'ASUS', 599.99, 'motherboard', 'https://cdn.brandfetch.io/idGnlhbTXH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Vengeance LPX 16GB', 'Corsair', 39.99, 'memory', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('Ripjaws V 32GB', 'G.Skill', 69.99, 'memory', 'https://cdn.brandfetch.io/id8HgeVn1l/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Trident Z5 RGB 32GB', 'G.Skill', 114.99, 'memory', 'https://cdn.brandfetch.io/id8HgeVn1l/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Dominator Platinum 64GB', 'Corsair', 289.99, 'memory', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('Crucial P3 1TB', 'Crucial', 64.99, 'storage', 'https://cdn.brandfetch.io/idcQwroMOv/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('WD Black SN850X 2TB', 'Western Digital', 159.99, 'storage', 'https://cdn.brandfetch.io/id6bAnMJ1y/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Samsung 990 Pro 4TB', 'Samsung', 349.99, 'storage', 'https://cdn.brandfetch.io/iduaw_nOnR/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('H5 Flow', 'NZXT', 94.99, 'case', 'https://nzxt.com/cdn/shop/files/h5-flow-rgb-h5-flow-rgb-primary-lg.png?v=1744863470&width=2000'),
('4000D Airflow', 'Corsair', 104.99, 'case', 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Cases/base-4000d-airflow-config/Gallery/4000D_AF_BLACK_01.webp'),
('O11 Dynamic Evo', 'Lian Li', 159.99, 'case', 'https://www.pbtech.co.nz/imgprod/C/H/CHALAN2074__1.jpg?h=2971221114'),
('Versa H18', 'Thermaltake', 49.99, 'case', 'https://cdn.mwave.com.au/images/400/AC11503_2.jpg'),
('Smart 500W', 'Thermaltake', 39.99, 'power_supply', 'https://cdn.brandfetch.io/idkwuFYTlH/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('RM750e', 'Corsair', 99.99, 'power_supply', 'https://cwsmgmt.corsair.com/press/CORSAIRLogo2020_stack_W.png'),
('SuperNOVA 1000 GT', 'EVGA', 169.99, 'power_supply', 'https://cdn.brandfetch.io/iddPf9bbl3/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B'),
('Peerless Assassin 120 SE', 'Thermalright', 33.90, 'cooler', 'https://cdn.brandfetch.io/id2Wov4r9a/w/339/h/339/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B'),
('Kraken Elite 360', 'NZXT', 279.99, 'cooler', 'https://cdn.brandfetch.io/id6LxRitGO/w/1080/h/1080/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B');

INSERT INTO cpu (component_id, socket, cores, threads, base_clock, boost_clock, tdp) VALUES
(1, 'AM4', 6, 12, 3.7, 4.6, 65),
((SELECT id FROM components WHERE name='Ryzen 5 7600'), 'AM5', 6, 12, 3.8, 5.1, 65),
((SELECT id FROM components WHERE name='Ryzen 7 7800X3D'), 'AM5', 8, 16, 4.2, 5.0, 120),
((SELECT id FROM components WHERE name='Ryzen 9 7950X'), 'AM5', 16, 32, 4.5, 5.7, 170),
((SELECT id FROM components WHERE name='Core i3-13100F'), 'LGA1700', 4, 8, 3.4, 4.5, 58),
((SELECT id FROM components WHERE name='Core i5-13600K'), 'LGA1700', 14, 20, 3.5, 5.1, 125),
((SELECT id FROM components WHERE name='Core i7-14700K'), 'LGA1700', 20, 28, 3.4, 5.6, 125),
((SELECT id FROM components WHERE name='Core i9-14900KS'), 'LGA1700', 24, 32, 3.2, 6.2, 150);

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
((SELECT id FROM components WHERE name='GeForce RTX 4090'), 24, 450, 2.2, 2.5, 'RTX 4090', 340);

INSERT INTO motherboard (component_id, socket, chipset, form_factor, ram_type, num_ram_slots, max_ram_capacity, pci_express_slots) VALUES
(7, 'AM4', 'B550', 'ATX', 'DDR4', 4, 128, 3), 
((SELECT id FROM components WHERE name='B650M DS3H'), 'AM5', 'B650', 'Micro-ATX', 'DDR5', 4, 128, 2),
((SELECT id FROM components WHERE name='X670E AORUS Master'), 'AM5', 'X670E', 'ATX', 'DDR5', 4, 192, 3),
((SELECT id FROM components WHERE name='B760M Bomber WiFi'), 'LGA1700', 'B760', 'Micro-ATX', 'DDR4', 2, 64, 1),
((SELECT id FROM components WHERE name='Z790 Maximus Hero'), 'LGA1700', 'Z790', 'ATX', 'DDR5', 4, 192, 3);

INSERT INTO memory (component_id, type, speed, capacity, modules) VALUES
(3, 'DDR4', 3200, 16, 2),
((SELECT id FROM components WHERE name='Vengeance LPX 16GB'), 'DDR4', 3200, 16, 2),
((SELECT id FROM components WHERE name='Ripjaws V 32GB'), 'DDR4', 3600, 32, 2),
((SELECT id FROM components WHERE name='Trident Z5 RGB 32GB'), 'DDR5', 6000, 32, 2),
((SELECT id FROM components WHERE name='Dominator Platinum 64GB'), 'DDR5', 6400, 64, 2);

INSERT INTO storage (component_id, type, capacity, form_factor) VALUES
(8, 'NVMe', 1000, 'M.2'),
((SELECT id FROM components WHERE name='Crucial P3 1TB'), 'NVMe', 1000, 'M.2'),
((SELECT id FROM components WHERE name='WD Black SN850X 2TB'), 'NVMe', 2000, 'M.2'),
((SELECT id FROM components WHERE name='Samsung 990 Pro 4TB'), 'NVMe', 4000, 'M.2');

INSERT INTO pc_case (component_id, cooler_max_height, gpu_max_length) VALUES
(5, 165, 300),
((SELECT id FROM components WHERE name='H5 Flow'), 165, 365),
((SELECT id FROM components WHERE name='4000D Airflow'), 170, 360),
((SELECT id FROM components WHERE name='O11 Dynamic Evo'), 167, 422),
((SELECT id FROM components WHERE name='Versa H18'), 155, 350);

INSERT INTO case_mobo_form_factors (case_id, form_factor) VALUES
(5, 'ATX'), (5, 'Micro-ATX');

INSERT INTO case_mobo_form_factors (case_id, form_factor) VALUES
  ((SELECT id FROM components WHERE name = 'H5 Flow'), 'ATX'),
  ((SELECT id FROM components WHERE name = 'H5 Flow'), 'Micro-ATX'),
  ((SELECT id FROM components WHERE name = '4000D Airflow'), 'ATX'),
  ((SELECT id FROM components WHERE name = '4000D Airflow'), 'Micro-ATX'),
  ((SELECT id FROM components WHERE name = 'O11 Dynamic Evo'), 'ATX'),
  ((SELECT id FROM components WHERE name = 'O11 Dynamic Evo'), 'Micro-ATX'),
  ((SELECT id FROM components WHERE name = 'Versa H18'), 'Micro-ATX');

INSERT INTO case_storage_form_factors (case_id, form_factor, num_slots) VALUES
  (5, 'M.2', 2),
  ((SELECT id FROM components WHERE name = 'H5 Flow'), 'M.2', 3),
  ((SELECT id FROM components WHERE name = '4000D Airflow'), 'M.2', 3),
  ((SELECT id FROM components WHERE name = 'O11 Dynamic Evo'), 'M.2', 4),
  ((SELECT id FROM components WHERE name = 'Versa H18'), 'M.2', 2);

INSERT INTO power_supply (component_id, type, wattage, form_factor) VALUES
(4, 'Modular', 650, 'ATX'),
((SELECT id FROM components WHERE name='Smart 500W'), 'Non-Modular', 500, 'ATX'),
((SELECT id FROM components WHERE name='RM750e'), 'Fully Modular', 750, 'ATX'),
((SELECT id FROM components WHERE name='SuperNOVA 1000 GT'), 'Fully Modular', 1000, 'ATX');

INSERT INTO cooler (component_id, type, height, max_tdp_supported) VALUES
(6, 'Air', 158, 150),
((SELECT id FROM components WHERE name='Peerless Assassin 120 SE'), 'Air', 155, 245),
((SELECT id FROM components WHERE name='Kraken Elite 360'), 'Liquid', 55, 300);

INSERT INTO cooler_cpu_sockets (cooler_id, socket) VALUES
(6, 'AM4'), (6, 'AM5');

INSERT INTO cooler_cpu_sockets (cooler_id, socket) VALUES
  ((SELECT id FROM components WHERE name = 'Peerless Assassin 120 SE'), 'AM4'),
  ((SELECT id FROM components WHERE name = 'Peerless Assassin 120 SE'), 'AM5'),
  ((SELECT id FROM components WHERE name = 'Peerless Assassin 120 SE'), 'LGA1700');

INSERT INTO cooler_cpu_sockets (cooler_id, socket) VALUES
  ((SELECT id FROM components WHERE name = 'Kraken Elite 360'), 'AM4'),
  ((SELECT id FROM components WHERE name = 'Kraken Elite 360'), 'AM5'),
  ((SELECT id FROM components WHERE name = 'Kraken Elite 360'), 'LGA1700');

INSERT INTO case_ps_form_factors (case_id, form_factor) VALUES
  (5, 'ATX'),
  ((SELECT id FROM components WHERE name = 'H5 Flow'), 'ATX'),
  ((SELECT id FROM components WHERE name = '4000D Airflow'), 'ATX'),
  ((SELECT id FROM components WHERE name = 'O11 Dynamic Evo'), 'ATX'),
  ((SELECT id FROM components WHERE name = 'Versa H18'), 'ATX');

INSERT INTO sound_card (component_id, sample_rate, bit_depth, chipset, interface, channel) VALUES (9, 192000, 24, 'SoundCore', 'PCIe', '7.1');
INSERT INTO network_card (component_id, num_ports, speed, interface) VALUES (10, 2, 1000, 'PCIe');
INSERT INTO network_adapter (component_id, wifi_version, interface, num_antennas) VALUES (11, 'WiFi 6', 'PCIe', 3);
INSERT INTO optical_drive (component_id, form_factor, type, interface, write_speed, read_speed) VALUES (12, '5.25"', 'DVD-RW', 'SATA', 16, 16);
INSERT INTO memory_card (component_id, num_slots, interface) VALUES (13, 1, '2.5');
INSERT INTO cables (component_id, length_cm, type) VALUES (14, 50, 'SATA');

INSERT INTO build (user_id, name, created_at, description, total_price, is_approved) VALUES
(1, 'Gaming Build', CURRENT_DATE, 'Mid-range gaming PC', 1139.92, TRUE);
INSERT INTO build_component (build_id, component_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8);

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

INSERT INTO rating_build (build_id, user_id, value) VALUES (1, 2, 5);
INSERT INTO review (build_id, user_id, content, created_at) VALUES (1, 2, 'Still runs everything in 2025!', CURRENT_DATE);

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM users WHERE username='rgb_lover'), 3),
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM users WHERE username='pc_wizard'), 4);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='Console Killer 2025'), (SELECT id FROM users WHERE username='rgb_lover'), 'No RGB, 3 stars.', '2024-12-05');

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Pro Streaming Rig'), (SELECT id FROM users WHERE username='pc_wizard'), 5);

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM users WHERE username='budget_king'), 5),
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM users WHERE username='first_timer'), 4);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='Team Red Value King'), (SELECT id FROM users WHERE username='budget_king'), 'Best FPS per dollar.', '2025-02-12');

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM users WHERE username='streamer_pro'), 5),
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM users WHERE username='budget_king'), 2);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='God Tier 4090 Build'), (SELECT id FROM users WHERE username='budget_king'), 'Waaaaay too much money.', '2025-03-05');

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Snow White Build'), (SELECT id FROM users WHERE username='rgb_lover'), 5),
((SELECT id FROM build WHERE name='Snow White Build'), (SELECT id FROM users WHERE username='office_guy'), 4);

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM users WHERE username='linux_fan'), 5),
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM users WHERE username='first_timer'), 1);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='Arch Linux Dev Box'), (SELECT id FROM users WHERE username='first_timer'), 'Could not install Windows easily.', '2024-10-20');

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM users WHERE username='streamer_pro'), 2),
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM users WHERE username='budget_king'), 3);
INSERT INTO review (build_id, user_id, content, created_at) VALUES
((SELECT id FROM build WHERE name='1080p Gamer'), (SELECT id FROM users WHERE username='streamer_pro'), 'Stutters in Warzone.', '2025-01-10');

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM users WHERE username='rgb_lover'), 2),
((SELECT id FROM build WHERE name='Silent Night'), (SELECT id FROM users WHERE username='office_guy'), 5);

INSERT INTO rating_build (build_id, user_id, value) VALUES
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM users WHERE username='pc_wizard'), 5),
((SELECT id FROM build WHERE name='Radeon Ultimate'), (SELECT id FROM users WHERE username='linux_fan'), 5);

INSERT INTO suggestions (user_id, admin_id, link, admin_comment, description, status, component_type) VALUES
(1, 4, 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-family/', NULL, 'Consider adding RTX 4070', 'pending', 'gpu'); 
`

async function main() {
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

        if (count > 0) {
            console.log('Database already seeded, skipping...');
            return;
        }

        console.log('Seeding database...');

        await client.query(seedSQL);

        console.log('Database seeded successfully...');
    } catch (error) {
        console.error('Seed failed:', error);
        throw error;
    } finally {
        await client.end();
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});