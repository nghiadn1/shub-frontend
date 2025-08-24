# Ứng dụng Báo cáo Dữ liệu Excel

Ứng dụng web xử lý dữ liệu giao dịch từ file Excel, cho phép lọc theo thời gian và tính tổng doanh thu.

## Tổng quan

Ứng dụng được phát triển để xử lý dữ liệu giao dịch từ file Excel của cửa hàng xăng dầu. Người dùng có thể upload file Excel, lọc dữ liệu theo khoảng thời gian và xem tổng doanh thu.

## Tính năng chính

- **Upload file Excel** (.xlsx)
- **Lọc theo thời gian** (giờ bắt đầu - giờ kết thúc)
- **Tính tổng doanh thu** tự động
- **Giao diện responsive** (desktop & mobile)
- **Xử lý client-side** (không upload file lên server)

## Công nghệ sử dụng

- **Next.js 15** - Framework React
- **TypeScript** - Ngôn ngữ lập trình
- **Tailwind CSS** - Styling
- **SheetJS** - Đọc file Excel

## Chạy ứng dụng

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm run dev
```

Truy cập: http://localhost:3000

## Hướng dẫn sử dụng

### 1. Chuẩn bị file Excel

File Excel cần có các cột:
- **STT**: Số thứ tự
- **Ngày**: Định dạng DD/MM/YYYY
- **Giờ**: Định dạng HH:mm:ss SA/CH
- **Mặt hàng**: Tên sản phẩm
- **Thành tiền (VNĐ)**: Số tiền

#### Định dạng thời gian:
- **SA** = Sáng (AM)
- **CH** = Chiều (PM)

**Ví dụ:**
- `10:33 SA` = 10:33 sáng
- `10:32 CH` = 10:32 chiều

**Lưu ý:** Ứng dụng sẽ tự động sắp xếp SA (sáng) trước CH (chiều) khi cùng giờ.

### 2. Sử dụng ứng dụng

1. **Upload file Excel** (.xlsx)
2. **Chọn giờ bắt đầu** và **giờ kết thúc**
3. **Click "Lọc dữ liệu"**
4. **Xem kết quả** trong bảng
5. **Click "Đặt lại"** để xem toàn bộ dữ liệu

## Cấu trúc dự án

```
├── app/
│   ├── page.tsx          # Giao diện chính
│   ├── layout.tsx        # Layout
│   └── globals.css       # CSS
├── components/ui/        # UI components
├── lib/utils.ts          # Utility functions
└── package.json          # Dependencies
```

## Đặc điểm kỹ thuật

- **Tự động phát hiện header** trong file Excel
- **Xử lý lỗi** thông báo rõ ràng
- **Responsive design** tối ưu cho mọi thiết bị
- **Performance tốt** với xử lý client-side
- **Sắp xếp thông minh** SA (sáng) trước CH (chiều)

