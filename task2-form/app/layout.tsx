import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Transaction Form',
  description: 'Form nhập giao dịch',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
              <body className="font-sans antialiased" suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
