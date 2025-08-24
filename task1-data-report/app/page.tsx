"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import * as XLSX from "xlsx"

interface Transaction {
  STT: number
  Ngày: string
  Giờ: string
  "Mặt hàng": string
  "Thành tiền (VNĐ)": number
}

export default function DataReportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (!uploadedFile) return

    if (!uploadedFile.name.endsWith(".xlsx")) {
      alert("Vui lòng chọn file Excel (.xlsx)")
      return
    }

    setFile(uploadedFile)
    setIsProcessing(true)

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

      // Find the header row that contains "STT", "Ngày", "Giờ", etc.
      let headerRowIndex = -1
      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i]
        if (row && row.some((cell) => cell && cell.toString().includes("STT"))) {
          headerRowIndex = i
          break
        }
      }

      if (headerRowIndex === -1) {
        alert("Không tìm thấy bảng dữ liệu với header STT, Ngày, Giờ...")
        return
      }

      // Extract headers and data
      const headers = rawData[headerRowIndex]
      const dataRows = rawData.slice(headerRowIndex + 1)

      // Convert to transaction objects
      const parsedTransactions: Transaction[] = []

      for (const row of dataRows) {
        if (!row || row.length === 0) continue

        const transaction: any = {}
        headers.forEach((header, index) => {
          if (header && row[index] !== undefined) {
            transaction[header] = row[index]
          }
        })

        // Only include rows that have required fields
        if (transaction["STT"] && transaction["Ngày"] && transaction["Giờ"] && transaction["Mặt hàng"]) {
          // Convert "Thành tiền (VNĐ)" to number if it's a string
          const amount = transaction["Thành tiền (VNĐ)"]
          if (typeof amount === "string") {
            transaction["Thành tiền (VNĐ)"] = Number.parseFloat(amount.replace(/[^\d.-]/g, "")) || 0
          }
          parsedTransactions.push(transaction as Transaction)
        }
      }

      // Sort transactions by date and time
      const sortedTransactions = parsedTransactions.sort((a, b) => {
        const dateA = new Date(`${a["Ngày"]} ${a["Giờ"]}`)
        const dateB = new Date(`${b["Ngày"]} ${b["Giờ"]}`)
        return dateA.getTime() - dateB.getTime()
      })

      setTransactions(sortedTransactions)
      setFilteredTransactions(sortedTransactions)

      // Calculate initial total
      const total = sortedTransactions.reduce((sum, transaction) => sum + (transaction["Thành tiền (VNĐ)"] || 0), 0)
      setTotalAmount(total)
    } catch (error) {
      console.error("Lỗi khi đọc file Excel:", error)
      alert("Có lỗi xảy ra khi đọc file Excel")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTimeFilter = () => {
    if (!startTime || !endTime) {
      alert("Vui lòng nhập đầy đủ giờ bắt đầu và giờ kết thúc")
      return
    }

    const filtered = transactions.filter((transaction) => {
      const transactionTime = transaction["Giờ"]
      if (!transactionTime) return false

      // Convert time strings to comparable format (HH:MM:SS)
      const transactionDateTime = new Date(`1970-01-01 ${transactionTime}`)
      const startDateTime = new Date(`1970-01-01 ${startTime}:00`)
      const endDateTime = new Date(`1970-01-01 ${endTime}:00`)

      return transactionDateTime >= startDateTime && transactionDateTime <= endDateTime
    })

    setFilteredTransactions(filtered)

    // Calculate filtered total
    const total = filtered.reduce((sum, transaction) => sum + (transaction["Thành tiền (VNĐ)"] || 0), 0)
    setTotalAmount(total)
  }

  const resetFilter = () => {
    setFilteredTransactions(transactions)
    const total = transactions.reduce((sum, transaction) => sum + (transaction["Thành tiền (VNĐ)"] || 0), 0)
    setTotalAmount(total)
    setStartTime("")
    setEndTime("")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Báo cáo dữ liệu giao dịch</h1>
        <p className="text-muted-foreground">Upload file Excel chứa danh sách giao dịch và lọc theo khoảng thời gian</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* File Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload File Excel</CardTitle>
            <CardDescription>Chọn file .xlsx chứa dữ liệu giao dịch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="text-sm text-muted-foreground">{file ? file.name : "Nhấp để chọn file Excel"}</p>
                  </div>
                  <Input type="file" accept=".xlsx" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
              {isProcessing && <p className="text-sm text-muted-foreground text-center">Đang xử lý file...</p>}
            </div>
          </CardContent>
        </Card>

        {/* Time Filter Card */}
        <Card>
          <CardHeader>
            <CardTitle>Lọc theo thời gian</CardTitle>
            <CardDescription>Nhập khoảng thời gian để lọc giao dịch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-time">Giờ bắt đầu</Label>
                  <Input 
                    id="start-time" 
                    type="time" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)} 
                  />
                </div>
                <div>
                  <Label htmlFor="end-time">Giờ kết thúc</Label>
                  <Input 
                    id="end-time" 
                    type="time" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)} 
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleTimeFilter} className="flex-1">
                  Lọc dữ liệu
                </Button>
                <Button variant="outline" onClick={resetFilter}>
                  Đặt lại
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {transactions.length > 0 && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tổng kết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Giao dịch được lọc</p>
                  <p className="text-2xl font-bold">{filteredTransactions.length}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Từ tổng số</p>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                </div>
                <div className="text-center p-4 bg-primary text-primary-foreground rounded-lg">
                  <p className="text-sm opacity-90">Tổng thành tiền</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách giao dịch</CardTitle>
              <CardDescription>{filteredTransactions.length} giao dịch được hiển thị</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>STT</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Giờ</TableHead>
                      <TableHead>Mặt hàng</TableHead>
                      <TableHead className="text-right">Thành tiền (VNĐ)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{transaction["STT"]}</TableCell>
                        <TableCell>{transaction["Ngày"]}</TableCell>
                        <TableCell>{transaction["Giờ"]}</TableCell>
                        <TableCell>{transaction["Mặt hàng"]}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(transaction["Thành tiền (VNĐ)"] || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
