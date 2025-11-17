import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ 
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  iconColor = "text-primary",
  className,
  formatter,
  ...props 
}) => {
  const formatValue = (val) => {
    if (formatter) return formatter(val);
    if (typeof val === 'number' && val >= 1000) {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(val);
    }
    return val;
  };

  const getChangeColor = (type) => {
    const colors = {
      positive: "text-success bg-success/10 border-success/20",
      negative: "text-error bg-error/10 border-error/20", 
      neutral: "text-gray-600 bg-gray-100 border-gray-200"
    };
    return colors[type] || colors.neutral;
  };

  const getChangeIcon = (type) => {
    const icons = {
      positive: "TrendingUp",
      negative: "TrendingDown",
      neutral: "Minus"
    };
    return icons[type] || icons.neutral;
  };

  return (
    <Card
      variant="gradient"
      hover
      className={cn("group", className)}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text mb-3">
            {formatValue(value)}
          </p>
          
          {change !== undefined && (
            <div className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
              getChangeColor(changeType)
            )}>
              <ApperIcon name={getChangeIcon(changeType)} size={12} className="mr-1" />
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>

        {icon && (
          <div className={cn(
            "flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200",
            iconColor
          )}>
            <ApperIcon name={icon} size={24} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;