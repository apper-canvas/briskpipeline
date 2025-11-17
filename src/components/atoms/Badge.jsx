import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default",
  size = "md",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20",
    success: "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200",
    warning: "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200",
    info: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3 py-1.5 text-sm font-semibold"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;