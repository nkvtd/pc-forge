import pg from 'pg';

const dataSQL = `
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