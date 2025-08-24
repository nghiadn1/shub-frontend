# Transaction Form

Ứng dụng web hiện đại được xây dựng với Next.js, React và TypeScript để nhập liệu giao dịch với validation tự động và tính toán doanh thu.

## Tính Năng Chính

- **Form Nhập Liệu**: 5 trường bắt buộc (Thời gian, Số lượng, Trụ, Đơn giá, Doanh thu)
- **Validation Tự Động**: Kiểm tra lỗi real-time với Zod
- **Tính Toán Tự Động**: Doanh thu = Số lượng × Đơn giá
- **Date Picker**: Chọn thời gian với format DD/MM/YYYY HH:mm:ss
- **Responsive Design**: Tương thích mobile và desktop
- **Success Popup**: Popup thông báo thành công với thông tin chi tiết

## Công Nghệ

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **Form**: React Hook Form, Zod validation
- **Date**: react-datepicker
- **Build**: npm/pnpm

## Cài Đặt Nhanh

```bash
# Cài đặt dependencies
npm install

# Chạy development
npm run dev

# Build production
npm run build
```

## Cấu Trúc Dự Án

```
task2-form/
├── app/                    # Next.js app router
├── components/             # React components
│   ├── ui/                # UI components (Button, Input, Label, Select, Dialog, Toast)
│   └── transaction-form.tsx # Main form component
├── hooks/                  # Custom hooks (use-toast)
├── lib/                    # Utilities (utils.ts)
└── public/                 # Static assets (empty)
```

## Thiết Kế Giao Diện

- **Design**: Modern UI với gradient background
- **Layout**: Form centered, responsive
- **Colors**: Blue primary (#3B82F6), Gray text (#111827)
- **Typography**: System fonts, clear hierarchy

## Quy Tắc Validation

- **Thời Gian**: Bắt buộc, format DD/MM/YYYY HH:mm:ss
- **Số Lượng**: Bắt buộc, hỗ trợ thập phân
- **Trụ**: Bắt buộc, dropdown (Trụ 1, 2, 3, 4, 5)
- **Đơn Giá**: Bắt buộc, số nguyên
- **Doanh Thu**: Bắt buộc, tự tính hoặc nhập thủ công

## Tùy Chỉnh

Dễ dàng tùy chỉnh:
- Validation rules trong `transactionSchema`
- Date format trong `formatDateTime()`
- Auto-calculation logic trong `handleQuantityBlur()`
- Success popup trong `onSubmit()`

## Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly interactions
- Optimized for all screen sizes

## Hiệu Suất

- Server-side rendering với Next.js
- Automatic code splitting
- Optimized images và assets
- Fast loading times


**Tech Stack**: Next.js 14.2.20 | React 18 | TypeScript | Tailwind CSS | Zod
