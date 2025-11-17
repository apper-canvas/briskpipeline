import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ 
  className,
  error = "Something went wrong",
  onRetry,
  showRetry = true,
  title = "Oops!",
  description,
  variant = "default",
  ...props 
}) => {
  const variants = {
    default: "min-h-96",
    page: "min-h-screen",
    card: "min-h-48",
    inline: "py-8"
  };

  const defaultDescription = "We encountered an issue while loading your data. Please try again or contact support if the problem persists.";

  return (
    <div className={cn("flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50", variants[variant], className)} {...props}>
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertTriangle" size={40} className="text-red-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center">
            <ApperIcon name="X" size={16} className="text-red-700" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description || defaultDescription}
          </p>
          {error && error !== "Something went wrong" && (
            <div className="bg-red-100 border border-red-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-red-800 font-medium">Error Details:</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          )}
        </div>

        {showRetry && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onRetry}
              variant="primary"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
            >
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Refresh Page
            </Button>
          </div>
        )}

        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" size={14} />
            <span>Just happened</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="HelpCircle" size={14} />
            <button className="hover:text-red-600 transition-colors underline">
              Get Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;