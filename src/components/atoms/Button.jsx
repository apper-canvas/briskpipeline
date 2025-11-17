import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl border-0 transform hover:scale-105",
    secondary: "bg-white hover:bg-gray-50 text-gray-900 shadow-sm border border-gray-300 hover:border-gray-400 hover:shadow-md",
    outline: "bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 border-0",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl border-0 transform hover:scale-105",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl border-0 transform hover:scale-105"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm font-medium rounded-lg h-8",
    md: "px-4 py-2 text-sm font-medium rounded-lg h-10",
    lg: "px-6 py-3 text-base font-semibold rounded-xl h-12",
    xl: "px-8 py-4 text-lg font-semibold rounded-xl h-14"
  };

  const disabledStyles = "opacity-50 cursor-not-allowed transform-none hover:scale-100 hover:shadow-none";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100",
        variants[variant],
        sizes[size],
        disabled && disabledStyles,
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;