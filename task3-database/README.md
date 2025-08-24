# Gas Station Management System Database

## Mô tả
Hệ thống quản lý trạm xăng với 4 bảng chính: trạm xăng, hàng hóa, trụ bơm, và giao dịch. Thiết kế theo chuẩn enterprise với tối ưu hiệu suất và tính toàn vẹn dữ liệu.

## ERD Diagram
![ERD](./erd.png)

## Yêu cầu hệ thống
- **Database**: MySQL 8.0+
- **Encoding**: UTF-8
- **Storage Engine**: InnoDB (mặc định)

## Cấu trúc Files

### 1. `schema.sql`
**Mô tả**: Định nghĩa cấu trúc database (DDL - Data Definition Language)
- **4 bảng chính**: `gas_stations`, `products`, `fuel_pumps`, `transactions`
- **Mối quan hệ**: 1-N giữa các bảng (station → pumps, products → pumps, etc.)
- **Constraints**: Primary keys, Foreign keys, Unique constraints
- **Indexes**: Tối ưu truy vấn theo ngày và station_id
- **Điểm nổi bật**: `total_amount` được định nghĩa là GENERATED COLUMN

### 2. `data.sql`
**Mô tả**: Dữ liệu mẫu cho testing (DML - Data Manipulation Language)
- **4 trạm xăng** với thông tin đầy đủ
- **5 loại hàng hóa** (A95, E5, DO, etc.)
- **13 trụ bơm** phân bố tại các trạm
- **20+ giao dịch** trong 30 ngày gần đây
- **Đa dạng case**: cash/card payment, individual/corporate customers, active/inactive status

### 3. `queries.sql`
**Mô tả**: Các truy vấn thống kê theo yêu cầu đề bài (DQL - Data Query Language)
- **Query 1**: Transactions by station & date range
- **Query 2**: Daily revenue by pump
- **Query 3**: Daily revenue by station  
- **Query 4**: Top 3 best-selling products (by liters) at station in month

## Cách sử dụng

### Setup Database
```bash
# 1. Tạo database và schema
mysql -u username -p < schema.sql

# 2. Chèn dữ liệu mẫu
mysql -u username -p < data.sql
```

### Test Queries
```bash
# Chạy tất cả queries
mysql -u username -p gas_station_management < queries.sql

# Test từng query riêng biệt
mysql -u username -p gas_station_management -e "SELECT * FROM gas_stations;"
```

### Quick Test Examples
```bash
# Test query 1: Transactions by station
mysql -u username -p gas_station_management -e "
SELECT t.transaction_id, t.transaction_date, p.product_name, t.total_amount 
FROM transactions t 
JOIN products p ON t.product_id = p.product_id 
WHERE t.station_id = 1 
LIMIT 5;"

# Test query 2: Daily revenue
mysql -u username -p gas_station_management -e "
SELECT DATE(transaction_date) as date, SUM(total_amount) as revenue 
FROM transactions 
WHERE station_id = 1 
GROUP BY DATE(transaction_date) 
ORDER BY date DESC 
LIMIT 7;"
```