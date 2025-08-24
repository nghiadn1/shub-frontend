import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Báo cáo dữ liệu Excel',
  description: 'Ứng dụng xử lý dữ liệu giao dịch từ file Excel',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
