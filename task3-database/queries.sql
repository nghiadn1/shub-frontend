-- =====================================================
-- GAS STATION MANAGEMENT SYSTEM - QUERIES
-- =====================================================
-- Mô tả: Các truy vấn thống kê theo yêu cầu đề bài
-- =====================================================

USE gas_station_management;

-- =====================================================
-- CÁC TRUY VẤN YÊU CẦU THEO ĐỀ BÀI
-- =====================================================

-- 1. Lấy tất cả giao dịch của 1 trạm trong khoảng ngày
-- Mô tả: Truy vấn lấy tất cả giao dịch của một trạm xăng trong khoảng thời gian cụ thể
-- Cách 1: Dùng tháng hiện tại (dynamic)
SELECT 
    t.transaction_id,
    t.transaction_date,
    p.product_name,
    fp.pump_number,
    t.quantity,
    t.unit_price,
    t.total_amount,
    t.payment_method,
    t.customer_type
FROM transactions t
JOIN fuel_pumps fp ON t.pump_id = fp.pump_id
JOIN products p ON t.product_id = p.product_id
WHERE t.station_id = 1 
    AND t.transaction_date BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW())
    AND t.transaction_status = 'completed'
ORDER BY t.transaction_date DESC;

-- Cách 2: Dùng tháng trước (dynamic)
-- SELECT 
--     t.transaction_id,
--     t.transaction_date,
--     p.product_name,
--     fp.pump_number,
--     t.quantity,
--     t.unit_price,
--     t.total_amount,
--     t.payment_method,
--     t.customer_type
-- FROM transactions t
-- JOIN fuel_pumps fp ON t.pump_id = fp.pump_id
-- JOIN products p ON t.product_id = p.product_id
-- WHERE t.station_id = 1 
--     AND t.transaction_date BETWEEN DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01') 
--         AND LAST_DAY(DATE_SUB(NOW(), INTERVAL 1 MONTH))
--     AND t.transaction_status = 'completed'
-- ORDER BY t.transaction_date DESC;

-- 2. Tổng doanh thu theo ngày cho 1 trụ bơm
-- Mô tả: Tính tổng doanh thu theo ngày cho một trụ bơm cụ thể
SELECT 
    DATE(t.transaction_date) as transaction_date,
    SUM(t.total_amount) as daily_revenue,
    SUM(t.quantity) as total_quantity,
    COUNT(*) as transaction_count
FROM transactions t
WHERE t.pump_id = 1 
    AND t.transaction_status = 'completed'
    AND t.transaction_date BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW())
GROUP BY DATE(t.transaction_date)
ORDER BY transaction_date DESC;

-- 3. Tổng doanh thu theo ngày cho 1 trạm
-- Mô tả: Tính tổng doanh thu theo ngày cho một trạm xăng cụ thể
SELECT 
    DATE(t.transaction_date) as transaction_date,
    SUM(t.total_amount) as daily_revenue,
    SUM(t.quantity) as total_quantity,
    COUNT(*) as transaction_count
FROM transactions t
WHERE t.station_id = 1 
    AND t.transaction_status = 'completed'
    AND t.transaction_date BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND LAST_DAY(NOW())
GROUP BY DATE(t.transaction_date)
ORDER BY transaction_date DESC;

-- 4. Lấy top 3 hàng hoá bán chạy nhất và tổng số lít tại một trạm trong tháng
-- Mô tả: Lấy top 3 sản phẩm bán chạy nhất và tổng số lít tại một trạm trong tháng
SELECT 
    p.product_name,
    p.product_code,
    SUM(t.quantity) as total_quantity_liters,
    SUM(t.total_amount) as total_revenue,
    COUNT(*) as transaction_count,
    AVG(t.unit_price) as avg_unit_price
FROM transactions t
JOIN products p ON t.product_id = p.product_id
WHERE t.station_id = 1 
    AND t.transaction_status = 'completed'
    AND YEAR(t.transaction_date) = YEAR(NOW())
    AND MONTH(t.transaction_date) = MONTH(NOW())
GROUP BY p.product_id, p.product_name, p.product_code
ORDER BY total_quantity_liters DESC
LIMIT 3;
