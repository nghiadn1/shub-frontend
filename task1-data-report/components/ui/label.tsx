"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "flex items-center gap-2 text-sm leading-none font-medium select-none",
          className
        )}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
