-- Insert Sample Customers
INSERT INTO customers (id, name, email, password, phone) VALUES 
(1, 'John Doe', 'john@example.com', 'password123', '1234567890'),
(2, 'Jane Smith', 'jane@example.com', 'password123', '0987654321');

-- Insert Sample Products
INSERT INTO products (id, name, description, price, rating, category) VALUES 
(1, 'Smartphone X', 'Latest model with high-res display', 999.00, 4.5, 'Electronics'),
(2, 'Wireless Headphones', 'Noise-cancelling over-ear headphones', 199.99, 4.8, 'Electronics'),
(3, 'Running Shoes', 'Lightweight comfortable running shoes', 79.99, 4.2, 'Sports'),
(4, 'Coffee Maker', 'Premium drip coffee maker', 49.99, 4.0, 'Home'),
(5, 'Gaming Laptop', 'High performance laptop for gaming', 1499.00, 4.7, 'Electronics'),
(6, 'Yoga Mat', 'Non-slip exercise mat', 25.00, 4.5, 'Sports');

-- Insert Sample Addresses
INSERT INTO addresses (customer_id, street, city, state, zip_code, country) VALUES
(1, '123 Main St', 'New York', 'NY', '10001', 'USA'),
(2, '456 Oak Ave', 'Los Angeles', 'CA', '90001', 'USA');

-- Insert Sample Payment Methods
INSERT INTO payment_methods (customer_id, bank_name, account_number, account_holder_name) VALUES
(1, 'Chase', '123456789', 'John Doe');

-- Insert Sample Product Images
INSERT INTO product_images (product_id, image_url) VALUES
(1, 'https://placehold.co/400x400/png?text=Smartphone'),
(2, 'https://placehold.co/400x400/png?text=Headphones'),
(3, 'https://placehold.co/400x400/png?text=Shoes'),
(4, 'https://placehold.co/400x400/png?text=Coffee'),
(5, 'https://placehold.co/400x400/png?text=Laptop'),
(6, 'https://placehold.co/400x400/png?text=Yoga');
