import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  className,
  title = "No data found",
  description = "Get started by adding your first item.",
  icon = "Database",
  onAction,
  actionLabel = "Add New",
  showAction = true,
  variant = "default",
  ...props 
}) => {
  const variants = {
    default: "min-h-96",
    page: "min-h-screen", 
    card: "min-h-48",
    inline: "py-12"
  };

  return (
    <div className={cn("flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100", variants[variant], className)} {...props}>
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name={icon} size={48} className="text-blue-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-full flex items-center justify-center">
            <ApperIcon name="Plus" size={16} className="text-indigo-700" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {showAction && onAction && (
          <div className="space-y-4">
            <Button
              onClick={onAction}
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              {actionLabel}
            </Button>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Zap" size={14} />
                <span>Quick setup</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Shield" size={14} />
                <span>Secure data</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Sparkles" size={14} />
                <span>Easy to use</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Empty;