-- =====================================================
-- GAS STATION MANAGEMENT SYSTEM - SCHEMA
-- =====================================================
-- Mô tả: Schema định nghĩa cấu trúc database quản lý trạm xăng
-- =====================================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS gas_station_management;
USE gas_station_management;

-- =====================================================
-- ĐỊNH NGHĨA CÁC BẢNG
-- =====================================================

-- 1. Bảng Trạm Xăng (Gas Stations)
CREATE TABLE gas_stations (
    station_id INT PRIMARY KEY AUTO_INCREMENT,
    station_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    manager_name VARCHAR(100),
    opening_hours VARCHAR(50),
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_station_status (status),
    INDEX idx_station_name (station_name)
);

-- 2. Bảng Hàng Hóa (Products - Gas/Diesel types)
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    product_code VARCHAR(20) UNIQUE NOT NULL,
    product_type ENUM('gasoline', 'diesel', 'other') NOT NULL,
    octane_rating INT,
    description TEXT,
    unit VARCHAR(10) DEFAULT 'liter',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_code (product_code),
    INDEX idx_product_type (product_type),
    INDEX idx_product_status (status)
);

-- 3. Bảng Trụ Bơm (Fuel Pumps)
CREATE TABLE fuel_pumps (
    pump_id INT PRIMARY KEY AUTO_INCREMENT,
    station_id INT NOT NULL,
    pump_number VARCHAR(20) NOT NULL,
    product_id INT NOT NULL,
    pump_status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    max_capacity DECIMAL(10,2),
    current_stock DECIMAL(10,2) DEFAULT 0,
    last_refill_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (station_id) REFERENCES gas_stations(station_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
    UNIQUE KEY unique_pump_station (station_id, pump_number),
    INDEX idx_pump_station (station_id),
    INDEX idx_pump_product (product_id),
    INDEX idx_pump_status (pump_status)
);

-- 4. Bảng Giao Dịch (Transactions)
CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    station_id INT NOT NULL,
    pump_id INT NOT NULL,
    product_id INT NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    payment_method ENUM('cash', 'card', 'mobile_payment') DEFAULT 'cash',
    customer_type ENUM('individual', 'corporate') DEFAULT 'individual',
    transaction_status ENUM('completed', 'cancelled', 'refunded') DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (station_id) REFERENCES gas_stations(station_id) ON DELETE RESTRICT,
    FOREIGN KEY (pump_id) REFERENCES fuel_pumps(pump_id) ON DELETE RESTRICT,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
    INDEX idx_transaction_station (station_id),
    INDEX idx_transaction_pump (pump_id),
    INDEX idx_transaction_product (product_id),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_transaction_status (transaction_status),
    INDEX idx_transaction_station_date (station_id, transaction_date)
);
