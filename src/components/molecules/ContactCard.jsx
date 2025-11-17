import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ContactCard = ({ 
  contact, 
  onClick,
  className,
  showActions = false,
  onEdit,
  onDelete,
  ...props 
}) => {
  return (
    <Card
      hover
      className={cn(
        "cursor-pointer transition-all duration-200",
        className
      )}
      onClick={() => onClick?.(contact)}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar
            initials={contact.name}
            size="lg"
            className="flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {contact.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {contact.position} at {contact.company}
            </p>
            <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
              <ApperIcon name="Mail" size={14} />
              <span className="truncate">{contact.email}</span>
            </div>
            {contact.phone && (
              <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                <ApperIcon name="Phone" size={14} />
                <span>{contact.phone}</span>
              </div>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(contact);
              }}
              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <ApperIcon name="Edit" size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(contact);
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Trash2" size={16} />
            </button>
          </div>
        )}
      </div>

      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {contact.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="primary" size="sm">
              {tag}
            </Badge>
          ))}
          {contact.tags.length > 3 && (
            <Badge variant="default" size="sm">
              +{contact.tags.length - 3} more
            </Badge>
          )}
        </div>
      )}

      {contact.notes && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 line-clamp-2">
            {contact.notes}
          </p>
        </div>
      )}
    </Card>
  );
};

export default ContactCard;