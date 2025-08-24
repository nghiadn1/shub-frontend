"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Calendar } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

const transactionSchema = z.object({
  datetime: z.string().min(1, "Thời gian không được bỏ trống"),
  quantity: z.string().min(1, "Số lượng không được bỏ trống"),
  pump: z.string().min(1, "Vui lòng chọn trụ bơm"),
  unitPrice: z.string().min(1, "Đơn giá không được bỏ trống"),
  revenue: z.string().min(1, "Doanh thu không được bỏ trống"),
})

type TransactionFormData = z.infer<typeof transactionSchema>

export default function TransactionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [showTimeMessage, setShowTimeMessage] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [successData, setSuccessData] = useState<any>(null)
  
  // Separate state for each input field
  const [soLuong, setSoLuong] = useState("")
  const [donGia, setDonGia] = useState("")
  const [doanhThu, setDoanhThu] = useState("")
  const [isDoanhThuManual, setIsDoanhThuManual] = useState(false)

  // Set initial date after component mounts to avoid hydration mismatch
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      datetime: "",
      quantity: "",
      pump: "",
      unitPrice: "",
      revenue: "",
    },
  })

  const onSubmit = async (data: TransactionFormData) => {
    console.log("Form submitted with data:", data)
    setIsSubmitting(true)

    try {
      // Validate all fields using Zod schema
      const validationResult = transactionSchema.safeParse(data)
      console.log("Validation result:", validationResult)
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors
        const firstError = errors[0]
        console.log("Validation errors:", errors)
        
        toast({
          title: "Lỗi validation!",
          description: firstError.message,
          variant: "destructive",
        })
        return
      }

      // Additional validation for numeric fields
      const quantity = parseFloat(data.quantity)
      const unitPrice = parseFloat(data.unitPrice)
      const revenue = parseFloat(data.revenue)

      if (isNaN(quantity) || quantity <= 0) {
        toast({
          title: "Lỗi validation!",
          description: "Số lượng phải là số dương",
          variant: "destructive",
        })
        return
      }

      if (isNaN(unitPrice) || unitPrice <= 0) {
        toast({
          title: "Lỗi validation!",
          description: "Đơn giá phải là số dương",
          variant: "destructive",
        })
        return
      }

      if (isNaN(revenue) || revenue <= 0) {
        toast({
          title: "Lỗi validation!",
          description: "Doanh thu phải là số dương",
          variant: "destructive",
        })
        return
      }

      // Validate calculation accuracy (optional check) - only warn, don't block
      const expectedRevenue = Math.round(quantity * unitPrice)
      console.log("Calculation check:", { quantity, unitPrice, revenue, expectedRevenue, diff: Math.abs(revenue - expectedRevenue) })
      if (Math.abs(revenue - expectedRevenue) > 1) {
        console.log("Revenue calculation mismatch, but allowing submission")
        // Don't block submission, just log the mismatch
      }

      // Validate date format
      if (!data.datetime || isNaN(new Date(data.datetime).getTime())) {
        toast({
          title: "Lỗi validation!",
          description: "Thời gian không hợp lệ",
          variant: "destructive",
        })
        return
      }

      // Validate pump selection
      const validPumps = ["tru-1", "tru-2", "tru-3", "tru-4", "tru-5"]
      console.log("Pump value:", data.pump, "Valid pumps:", validPumps)
      if (!validPumps.includes(data.pump)) {
        toast({
          title: "Lỗi validation!",
          description: "Vui lòng chọn trụ hợp lệ",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Success popup with detailed information
      const pumpDisplayNames: { [key: string]: string } = {
        "tru-1": "Trụ 1",
        "tru-2": "Trụ 2", 
        "tru-3": "Trụ 3",
        "tru-4": "Trụ 4",
        "tru-5": "Trụ 5"
      }
      
      // Set success data and show popup
      console.log("Setting success data and showing popup")
      setSuccessData({
        pump: pumpDisplayNames[data.pump] || data.pump,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        revenue: data.revenue,
        datetime: data.datetime
      })
      setShowSuccessPopup(true)

      console.log("Transaction data:", data)
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: "Có lỗi xảy ra khi cập nhật giao dịch.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return ""
    const date = new Date(dateTimeString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
    if (date) {
      const isoString = date.toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:mm
      setValue("datetime", isoString)
    } else {
      setValue("datetime", "")
    }
    setIsDatePickerOpen(false)
    setShowTimeMessage(false) // Hide message when date is selected
  }



  // Handle quantity input independently
  const handleQuantityChange = (value: string) => {
    const formattedValue = formatNumber(value, true) // Allow decimal for quantity
    setSoLuong(formattedValue)
    setValue("quantity", formattedValue)
  }

  // Handle unit price input independently  
  const handleUnitPriceChange = (value: string) => {
    const formattedValue = formatNumber(value, false) // No decimal for unit price
    setDonGia(formattedValue)
    setValue("unitPrice", formattedValue)
  }

  // Handle revenue input independently
  const handleRevenueChange = (value: string) => {
    const formattedValue = formatNumber(value, false) // No decimal for revenue
    setDoanhThu(formattedValue)
    setValue("revenue", formattedValue)
    setIsDoanhThuManual(true) // Mark as manually entered
  }

  // Auto-calculate when user finishes typing (blur event)
  const handleQuantityBlur = () => {
    if (soLuong && donGia && !isDoanhThuManual) {
      const quantityNum = parseFloat(soLuong)
      const unitPriceNum = parseFloat(donGia)
      if (!isNaN(quantityNum) && !isNaN(unitPriceNum) && quantityNum > 0 && unitPriceNum > 0) {
        const calculatedRevenue = quantityNum * unitPriceNum
        const roundedRevenue = Math.round(calculatedRevenue)
        setDoanhThu(roundedRevenue.toString())
        setValue("revenue", roundedRevenue.toString())
      }
    }
  }

  const handleUnitPriceBlur = () => {
    if (soLuong && donGia && !isDoanhThuManual) {
      const quantityNum = parseFloat(soLuong)
      const unitPriceNum = parseFloat(donGia)
      if (!isNaN(quantityNum) && !isNaN(unitPriceNum) && quantityNum > 0 && unitPriceNum > 0) {
        const calculatedRevenue = quantityNum * unitPriceNum
        const roundedRevenue = Math.round(calculatedRevenue)
        setDoanhThu(roundedRevenue.toString())
        setValue("revenue", roundedRevenue.toString())
      }
    }
  }

  // Format number inputs for better UX
  const formatNumber = (value: string, allowDecimal: boolean = true) => {
    if (allowDecimal) {
      return value.replace(/[^0-9.]/g, '')
    } else {
      return value.replace(/[^0-9]/g, '')
    }
  }

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isDatePickerOpen && !target.closest('.date-picker-container')) {
        setIsDatePickerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDatePickerOpen])

  return (
    <div className="w-full max-w-2xl relative overflow-hidden pt-4">
      {/* Header (trắng) */}
      <div className="flex items-center justify-between pl-4 pr-6 py-4 bg-white z-20 relative">
        <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-600 hover:bg-gray-100 mt-2 -mb-2 ml-2">
          <ArrowLeft className="h-3 w-3" />
          <span className="ml-0 text-xs font-medium">Đóng</span>
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-sm h-10 mt-2"
        >
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </div>

      {/* Title */}
      <div className="px-6">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight -mt-2 mb-4">
          Nhập giao dịch
        </h1>
      </div>

      {/* BACKDROP + CONTENT */}
      <div className="relative">
        {/* Khối nền xám chỉ bao input thời gian */}
        <div className="bg-gradient-to-b from-gray-100 to-white px-6 pt-2 pb-2">
          {/* --- Thời gian --- */}
          <div className="space-y-2 mt-2">
            <div className="relative">
              <Input
                id="datetime"
                type="text"
                value={isClient && selectedDate ? formatDateTime(selectedDate.toISOString()) : ""}
                readOnly
                onFocus={(e) => {
                  (e.target as HTMLInputElement).select()
                }}
                onClick={(e) => {
                  (e.target as HTMLInputElement).select()
                  setShowTimeMessage(true)
                  // Hide message after 3 seconds
                  setTimeout(() => setShowTimeMessage(false), 3000)
                }}
                className="w-full p-4 pt-8 border border-gray-200 rounded-md bg-white text-[17px] font-medium text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
                placeholder="DD/MM/YYYY HH:mm:ss"
              />
              <Label htmlFor="datetime" className="absolute top-2 left-3 text-xs text-gray-500 bg-white px-1 z-10">
                Thời gian
              </Label>
              
              <button
                type="button"
                onClick={() => {
                  setIsDatePickerOpen(!isDatePickerOpen)
                  setShowTimeMessage(false) // Hide message when clicking icon
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600 hover:text-gray-400 transition-colors cursor-pointer"
              >
                <Calendar className="h-5 w-5" />
              </button>
              
              {/* DatePicker popup */}
              {isClient && isDatePickerOpen && (
                <div className="absolute top-full right-0 mt-1 z-50 date-picker-container">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-gray-900">Chọn thời gian</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date()
                          setSelectedDate(now)
                          const isoString = now.toISOString().slice(0, 16)
                          setValue("datetime", isoString)
                          setIsDatePickerOpen(false)
                          setShowTimeMessage(false) // Hide message when current time is selected
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                      >
                        Hiện tại
                      </button>
                    </div>
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={1}
                      dateFormat="dd/MM/yyyy HH:mm:ss"
                      timeCaption="Thời gian"
                      placeholderText="DD/MM/YYYY HH:mm:ss"
                      className="w-full p-4 pt-8 border border-gray-200 rounded-md bg-white text-[17px] font-medium text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      customInput={<Input />}
                      locale="vi"
                      popperClassName="z-50"
                      inline
                    />
                  </div>
                </div>
              )}
            </div>
            {showTimeMessage && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Vui lòng ấn icon để chọn thời gian
                </p>
              </div>
            )}
            {errors.datetime && <p className="text-sm text-red-500 mt-1">{errors.datetime.message}</p>}
          </div>
        </div>

        {/* Các field còn lại ở nền trắng */}
        <div className="px-6 pb-6 space-y-6 pt-4">
          {/* --- Số lượng --- */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="quantity"
                type="text"
                onChange={(e) => handleQuantityChange(e.target.value)}
                onBlur={handleQuantityBlur}
                onFocus={(e) => (e.target as HTMLInputElement).select()}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="w-full p-4 pt-8 border border-gray-200 rounded-md bg-white text-[17px] font-medium text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="0.00"
                value={soLuong}
              />
              <Label htmlFor="quantity" className="absolute top-2 left-3 text-xs text-gray-500 bg-white px-1">
                Số lượng
              </Label>
            </div>
            {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>}
          </div>

          {/* --- Trụ --- */}
          <div className="space-y-2">
            <div className="relative">
              <Select onValueChange={(value) => setValue("pump", value)} value={watch("pump")}>
                <SelectTrigger className="w-full p-4 pt-8 border border-gray-200 rounded-md bg-white text-[17px] font-medium text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tru-1">Trụ 1</SelectItem>
                  <SelectItem value="tru-2">Trụ 2</SelectItem>
                  <SelectItem value="tru-3">Trụ 3</SelectItem>
                  <SelectItem value="tru-4">Trụ 4</SelectItem>
                  <SelectItem value="tru-5">Trụ 5</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="pump" className="absolute top-2 left-3 text-xs text-gray-500 bg-white px-1 pointer-events-none">
                Trụ
              </Label>
            </div>
            {errors.pump && <p className="text-sm text-red-500 mt-1">{errors.pump.message}</p>}
          </div>

          {/* --- Doanh thu --- */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="revenue"
                type="text"
                onChange={(e) => handleRevenueChange(e.target.value)}
                onFocus={(e) => (e.target as HTMLInputElement).select()}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="w-full p-4 pt-8 border border-gray-200 rounded-md bg-white text-[17px] font-medium text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="0"
                value={doanhThu}
              />
              <Label htmlFor="revenue" className="absolute top-2 left-3 text-xs text-gray-500 bg-white px-1">
                Doanh thu
              </Label>
            </div>
            {errors.revenue && <p className="text-sm text-red-500 mt-1">{errors.revenue.message}</p>}
          </div>

          {/* --- Đơn giá --- */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="unitPrice"
                type="text"
                onChange={(e) => handleUnitPriceChange(e.target.value)}
                onBlur={handleUnitPriceBlur}
                onFocus={(e) => (e.target as HTMLInputElement).select()}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="w-full p-4 pt-8 border border-gray-200 rounded-md bg-white text-[17px] font-medium text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="0"
                value={donGia}
              />
              <Label htmlFor="unitPrice" className="absolute top-2 left-3 text-xs text-gray-500 bg-white px-1">
                Đơn giá
              </Label>
            </div>
            {errors.unitPrice && <p className="text-sm text-red-500 mt-1">{errors.unitPrice.message}</p>}
          </div>
        </div>
      </div>

      {/* Success Popup */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Thành công!
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Giao dịch đã được cập nhật thành công.
            </DialogDescription>
          </DialogHeader>
          
          {successData && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Thời gian:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {successData.datetime ? formatDateTime(successData.datetime) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Trụ:</span>
                  <span className="text-sm font-medium text-gray-900">{successData.pump}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Số lượng:</span>
                  <span className="text-sm font-medium text-gray-900">{successData.quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Đơn giá:</span>
                  <span className="text-sm font-medium text-gray-900">{successData.unitPrice}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm font-medium text-gray-900">Doanh thu:</span>
                  <span className="text-sm font-bold text-green-600">{successData.revenue}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowSuccessPopup(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Đóng
                </Button>
                <Button 
                  onClick={() => {
                    setShowSuccessPopup(false)
                    // Reset form
                    setSoLuong("")
                    setDonGia("")
                    setDoanhThu("")
                    setSelectedDate(null)
                    setIsDoanhThuManual(false)
                    // Reset form values
                    setValue("datetime", "")
                    setValue("quantity", "")
                    setValue("pump", "")
                    setValue("unitPrice", "")
                    setValue("revenue", "")
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  Nhập mới
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
