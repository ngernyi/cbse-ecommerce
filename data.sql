-- ==========================================
-- 1. Create Core Data (Products & Customers)
-- ==========================================

-- Products
INSERT INTO products (id, name, description, price, rating, category, variants) VALUES 
(1, 'Smartphone X', 'Latest model', 999.00, 4.8, 'Electronics', '{"color":["Black","Silver"]}'),
(2, 'Laptop Pro', 'High perf laptop', 1500.00, 4.9, 'Electronics', '{"ram":["16GB","32GB"]}'),
(3, 'Running Shoes', 'Comfortable sneakers', 80.00, 4.5, 'Sports', '{"size":["9","10","11"]}'),
(4, 'T-Shirt', 'Cotton basic tee', 20.00, 4.2, 'Fashion', '{"size":["M","L"],"color":["White","Blue"]}'),
(5, 'Coffee Maker', 'Automatic brewer', 120.00, 4.6, 'Home', NULL);

-- Customers
INSERT INTO customers (id, name, email, password, phone) VALUES 
(1, 'John Doe', 'john@example.com', 'password123', '1234567890'),
(2, 'Jane Smith', 'jane@example.com', 'pass456', '0987654321');

-- ==========================================
-- 2. Populate Cart (For testing "Checkout")
-- ==========================================
-- John Doe has 2 items in cart
INSERT INTO cart_items (customer_id, product_id, quantity) VALUES 
(1, 1, 1), -- 1x Smartphone
(1, 3, 2); -- 2x Shoes

-- ==========================================
-- 3. Create Completed Orders (History)
-- ==========================================

-- Order 1: Completed (Delivered/Done)
INSERT INTO orders (id, customer_id, order_date, status, total_amount) VALUES 
(101, 1, '2023-10-01 10:00:00', 'COMPLETED', 1520.00);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES 
(101, 2, 1, 1500.00), -- Laptop
(101, 4, 1, 20.00);   -- T-Shirt

-- Order 2: Cancelled
INSERT INTO orders (id, customer_id, order_date, status, total_amount) VALUES 
(102, 1, '2023-10-05 14:30:00', 'CANCELLED', 80.00);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES 
(102, 3, 1, 80.00); -- Shoes

-- Order 3: Processing (Active)
INSERT INTO orders (id, customer_id, order_date, status, total_amount) VALUES 
(103, 1, CURRENT_TIMESTAMP, 'PROCESSING', 999.00);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES 
(103, 1, 1, 999.00); -- Smartphone


-- Order 4: Delivered (Another completed one)
INSERT INTO orders (id, customer_id, order_date, status, total_amount) VALUES 
(104, 1, '2023-11-15 09:00:00', 'SHIPPED', 120.00);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES 
(104, 5, 1, 120.00); -- Coffee Maker
