-- =====================================================
-- GAS STATION MANAGEMENT SYSTEM - SAMPLE DATA
-- =====================================================
-- Mô tả: Dữ liệu mẫu cho hệ thống quản lý trạm xăng
-- =====================================================

USE gas_station_management;

-- =====================================================
-- CHÈN DỮ LIỆU MẪU
-- =====================================================

-- Chèn dữ liệu mẫu cho các trạm xăng
INSERT INTO gas_stations (station_name, address, phone, email, manager_name, opening_hours) VALUES
('Petrolimex Station 1', '123 Nguyen Van Linh, District 7, HCMC', '028-1234-5678', 'station1@petrolimex.vn', 'Nguyen Van A', '06:00-22:00'),
('Petrolimex Station 2', '456 Le Van Viet, District 9, HCMC', '028-1234-5679', 'station2@petrolimex.vn', 'Tran Thi B', '24/7'),
('Shell Station 1', '789 Vo Van Kiet, District 1, HCMC', '028-1234-5680', 'station1@shell.vn', 'Le Van C', '06:00-23:00'),
('Mobil Station 1', '321 Tran Phu, District 5, HCMC', '028-1234-5681', 'station1@mobil.vn', 'Pham Van D', '05:00-24:00');

-- Chèn dữ liệu mẫu cho các loại hàng hóa
INSERT INTO products (product_name, product_code, product_type, octane_rating, description) VALUES
('RON 95-III', 'A95', 'gasoline', 95, 'Premium gasoline with 95 octane rating'),
('RON 92-III', 'A92', 'gasoline', 92, 'Regular gasoline with 92 octane rating'),
('E5 RON 92-III', 'E5', 'gasoline', 92, 'Ethanol blended gasoline with 5% ethanol'),
('Diesel 0.05S', 'DO', 'diesel', NULL, 'Low sulfur diesel fuel'),
('Diesel 0.25S', 'DO25', 'diesel', NULL, 'Standard diesel fuel');

-- Chèn dữ liệu mẫu cho các trụ bơm
INSERT INTO fuel_pumps (station_id, pump_number, product_id, max_capacity, current_stock) VALUES
(1, 'P001', 1, 20000.00, 15000.00),
(1, 'P002', 1, 20000.00, 12000.00),
(1, 'P003', 2, 20000.00, 18000.00),
(1, 'P004', 4, 30000.00, 25000.00),
(2, 'P001', 1, 20000.00, 16000.00),
(2, 'P002', 3, 20000.00, 14000.00),
(2, 'P003', 4, 30000.00, 22000.00),
(3, 'P001', 1, 20000.00, 17000.00),
(3, 'P002', 2, 20000.00, 19000.00),
(3, 'P003', 4, 30000.00, 28000.00),
(4, 'P001', 1, 20000.00, 13000.00),
(4, 'P002', 3, 20000.00, 15000.00),
(4, 'P003', 5, 30000.00, 24000.00);

-- Chèn dữ liệu mẫu cho các giao dịch (30 ngày gần đây)
-- Lưu ý: total_amount sẽ được tự động tính từ quantity * unit_price
INSERT INTO transactions (station_id, pump_id, product_id, transaction_date, quantity, unit_price, payment_method, customer_type) VALUES
-- Station 1 transactions
(1, 1, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 25.50, 23500, 'card', 'individual'),
(1, 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 30.00, 23500, 'cash', 'corporate'),
(1, 2, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 20.00, 23500, 'mobile_payment', 'individual'),
(1, 3, 2, DATE_SUB(NOW(), INTERVAL 3 DAY), 35.00, 22500, 'card', 'corporate'),
(1, 4, 4, DATE_SUB(NOW(), INTERVAL 2 DAY), 50.00, 21500, 'cash', 'individual'),
(1, 1, 1, DATE_SUB(NOW(), INTERVAL 5 DAY), 15.00, 23500, 'card', 'individual'),
(1, 3, 2, DATE_SUB(NOW(), INTERVAL 4 DAY), 40.00, 22500, 'cash', 'corporate'),

-- Station 2 transactions
(2, 5, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 28.00, 23500, 'card', 'individual'),
(2, 6, 3, DATE_SUB(NOW(), INTERVAL 2 DAY), 22.00, 22000, 'mobile_payment', 'individual'),
(2, 7, 4, DATE_SUB(NOW(), INTERVAL 3 DAY), 45.00, 21500, 'cash', 'corporate'),
(2, 5, 1, DATE_SUB(NOW(), INTERVAL 4 DAY), 18.00, 23500, 'card', 'individual'),
(2, 6, 3, DATE_SUB(NOW(), INTERVAL 5 DAY), 32.00, 22000, 'cash', 'corporate'),

-- Station 3 transactions
(3, 8, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 26.00, 23500, 'card', 'individual'),
(3, 9, 2, DATE_SUB(NOW(), INTERVAL 2 DAY), 38.00, 22500, 'cash', 'corporate'),
(3, 10, 4, DATE_SUB(NOW(), INTERVAL 3 DAY), 42.00, 21500, 'mobile_payment', 'individual'),
(3, 8, 1, DATE_SUB(NOW(), INTERVAL 4 DAY), 19.00, 23500, 'card', 'individual'),
(3, 9, 2, DATE_SUB(NOW(), INTERVAL 5 DAY), 29.00, 22500, 'cash', 'corporate'),

-- Station 4 transactions
(4, 11, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 24.00, 23500, 'card', 'individual'),
(4, 12, 3, DATE_SUB(NOW(), INTERVAL 2 DAY), 36.00, 22000, 'cash', 'corporate'),
(4, 13, 5, DATE_SUB(NOW(), INTERVAL 3 DAY), 48.00, 21000, 'mobile_payment', 'individual'),
(4, 11, 1, DATE_SUB(NOW(), INTERVAL 4 DAY), 21.00, 23500, 'card', 'individual'),
(4, 12, 3, DATE_SUB(NOW(), INTERVAL 5 DAY), 33.00, 22000, 'cash', 'corporate');
