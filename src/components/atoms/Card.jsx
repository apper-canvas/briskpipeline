import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children,
  variant = "default",
  padding = "default",
  hover = false,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    elevated: "bg-white border border-gray-200 shadow-lg",
    glass: "bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl",
    gradient: "bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 shadow-md"
  };

  const paddings = {
    none: "",
    sm: "p-4",
    default: "p-6",
    lg: "p-8"
  };

  const hoverStyles = hover ? "hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-200" : "";

  return (
    <div
      className={cn(
        "rounded-xl",
        variants[variant],
        paddings[padding],
        hoverStyles,
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;