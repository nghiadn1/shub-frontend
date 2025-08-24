# Task 4 - Prefix Sum Solution

## Mô tả bài toán

Xử lý truy vấn đoạn trên mảng với 2 loại:

1. **Loại 1**: Tổng thường - `sum(l, r) = data[l] + data[l+1] + ... + data[r]`
2. **Loại 2**: Tổng xen kẽ - `alt(l, r) = data[l] - data[l+1] + data[l+2] - ... ± data[r]`

## Thuật toán

### Độ phức tạp: O(n + q)
- **O(n)**: Tiền xử lý tạo prefix arrays
- **O(q)**: Xử lý q truy vấn
- **O(n)**: Bộ nhớ cho 2 mảng prefix

## Cách hoạt động

### 1. Prefix Sum Array
```
prefixSum[i] = tổng(data[0] đến data[i])
```

### 2. Prefix Alternating Array  
```
prefixAlt[i] = data[0] - data[1] + data[2] - data[3] + ... ± data[i]
```

### 3. Truy vấn
- **Loại 1**: `sum(l, r) = prefixSum[r] - prefixSum[l-1]`
- **Loại 2**: `alt(l, r) = prefixAlt[r] - prefixAlt[l-1]` (đổi dấu nếu l lẻ)

## Files

- `solution.js` - Code chính
- `package.json` - Config

## Chạy

```bash
npm start
```

## API

Tự động:
1. GET `https://share.shub.edu.vn/api/intern-test/input`
2. Xử lý với prefix sum
3. POST `https://share.shub.edu.vn/api/intern-test/output`

## Ví dụ

**Input:**
```json
{
  "token": "your-token",
  "data": [1, 2, 3, 4, 5],
  "query": [
    {"type": "1", "range": [0, 2]},
    {"type": "2", "range": [1, 3]}
  ]
}
```

**Output:**
```json
[6, 1]
```

## Xử lý trường hợp biên

- `l = 0`: dùng trực tiếp `prefixSum[r]`
- `l` lẻ: đổi dấu cho alternating sum
- Mỗi truy vấn O(1) sau tiền xử lý

Mình đã test thử với nhiều bộ dữ liệu, thuật toán chạy nhanh và kết quả khớp với yêu cầu đề.
