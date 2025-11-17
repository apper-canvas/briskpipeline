import React from "react";
import { cn } from "@/utils/cn";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow, format } from "date-fns";

const ActivityItem = ({ 
  activity, 
  contact,
  deal,
  className,
  showDetails = true,
  ...props 
}) => {
  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail", 
      meeting: "Calendar",
      note: "FileText",
      task: "CheckSquare",
      demo: "Play"
    };
    return icons[type] || "Activity";
  };

  const getActivityColor = (type) => {
    const colors = {
      call: "text-blue-600 bg-blue-100",
      email: "text-green-600 bg-green-100",
      meeting: "text-purple-600 bg-purple-100",
      note: "text-gray-600 bg-gray-100",
      task: "text-orange-600 bg-orange-100",
      demo: "text-indigo-600 bg-indigo-100"
    };
    return colors[type] || "text-gray-600 bg-gray-100";
  };

  const getActivityLabel = (type) => {
    const labels = {
      call: "Call",
      email: "Email",
      meeting: "Meeting", 
      note: "Note",
      task: "Task",
      demo: "Demo"
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className={cn("flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors", className)} {...props}>
      {/* Activity Icon */}
      <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center", getActivityColor(activity.type))}>
        <ApperIcon name={getActivityIcon(activity.type)} size={16} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="default" size="sm">
                {getActivityLabel(activity.type)}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-900 leading-relaxed mb-2">
              {activity.description}
            </p>

            {/* Related Info */}
            {showDetails && (contact || deal) && (
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {contact && (
                  <div className="flex items-center space-x-1">
                    <Avatar initials={contact.name} size="xs" />
                    <span>{contact.name}</span>
                  </div>
                )}
                {deal && (
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Target" size={12} />
                    <span>{deal.title}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Timestamp Detail */}
          <div className="text-xs text-gray-400 ml-4 flex-shrink-0">
            {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;