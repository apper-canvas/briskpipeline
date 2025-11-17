import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const DealCard = ({ 
  deal, 
  contact,
  className,
  isDragging = false,
  onEdit,
  onDelete,
  ...props 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStageColor = (stage) => {
    const colors = {
      "Lead": "#6B7280",
      "Qualified": "#3B82F6", 
      "Proposal": "#F59E0B",
      "Negotiation": "#7C3AED",
      "Closed Won": "#10B981",
      "Closed Lost": "#EF4444"
    };
    return colors[stage] || "#6B7280";
  };

  const getProbabilityVariant = (probability) => {
    if (probability >= 80) return "success";
    if (probability >= 60) return "warning";
    if (probability >= 40) return "info";
    return "default";
  };

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-200 border-l-4",
        isDragging && "dragging shadow-2xl",
        className
      )}
      style={{ borderLeftColor: getStageColor(deal.stage) }}
      {...props}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-primary transition-colors">
              {deal.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(deal.value)}
              </span>
              <Badge variant={getProbabilityVariant(deal.probability)} size="sm">
                {deal.probability}%
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(deal);
              }}
              className="p-1 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
            >
              <ApperIcon name="Edit" size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(deal);
              }}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <ApperIcon name="Trash2" size={14} />
            </button>
          </div>
        </div>

        {/* Contact */}
        {contact && (
          <div className="flex items-center space-x-2">
            <Avatar initials={contact.name} size="xs" />
            <span className="text-sm text-gray-600 truncate">{contact.name}</span>
          </div>
        )}

        {/* Expected Close Date */}
        {deal.expectedCloseDate && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ApperIcon name="Calendar" size={14} />
            <span>{format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')}</span>
          </div>
        )}

        {/* Notes */}
        {deal.notes && (
          <div className="text-xs text-gray-500 line-clamp-2 bg-gray-50 p-2 rounded">
            {deal.notes}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DealCard;