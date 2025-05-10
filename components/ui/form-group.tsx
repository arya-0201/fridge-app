"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mb-2 bg-[#f3f4f6] rounded-lg p-4 border border-transparent transition-all duration-200 focus-within:border-[#0077ff] focus-within:bg-white",
          className
        )}
        {...props}
      />
    )
  }
)
FormGroup.displayName = "FormGroup"

export { FormGroup } 