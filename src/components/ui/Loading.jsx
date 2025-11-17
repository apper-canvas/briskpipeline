import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default", ...props }) => {
  const variants = {
    default: "min-h-96",
    page: "min-h-screen",
    card: "min-h-48",
    inline: "h-8"
  };

  return (
    <div className={cn("flex items-center justify-center", variants[variant], className)} {...props}>
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-primary mx-auto"></div>
          <div className="w-8 h-8 border-4 border-transparent rounded-full animate-spin border-t-secondary absolute top-2 left-2"></div>
        </div>
        <div className="space-y-2">
          <div className="text-gray-600 font-medium">Loading...</div>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse animation-delay-100"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse animation-delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoadingSkeleton = ({ className, ...props }) => (
  <div className={cn("animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded", className)} {...props} />
);

export const LoadingCard = ({ className, children, ...props }) => (
  <div className={cn("bg-white rounded-xl shadow-sm border p-6 space-y-4", className)} {...props}>
    {children || (
      <>
        <div className="flex items-center space-x-3">
          <LoadingSkeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <LoadingSkeleton className="h-3 w-full" />
          <LoadingSkeleton className="h-3 w-2/3" />
        </div>
      </>
    )}
  </div>
);

export const LoadingTable = ({ rows = 5, cols = 4, className, ...props }) => (
  <div className={cn("bg-white rounded-xl shadow-sm border overflow-hidden", className)} {...props}>
    <div className="p-6 border-b">
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-6 w-48" />
        <LoadingSkeleton className="h-10 w-32" />
      </div>
    </div>
    <div className="divide-y">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4 flex items-center space-x-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <LoadingSkeleton
              key={colIndex}
              className={cn(
                "h-4",
                colIndex === 0 ? "w-1/4" : colIndex === cols - 1 ? "w-16" : "w-1/3"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Loading;