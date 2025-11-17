import React, { forwardRef, useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Avatar = forwardRef(({ 
  className,
  src,
  alt,
  size = "md",
  fallback,
  initials,
  ...props 
}, ref) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
    "2xl": "h-20 w-20 text-2xl"
  };

  const generateInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayInitials = initials || generateInitials(alt) || generateInitials(fallback) || "?";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold overflow-hidden border-2 border-white shadow-sm",
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : fallback ? (
        <span className="text-current">{fallback}</span>
      ) : (
        <span className="text-current font-bold">{displayInitials}</span>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;