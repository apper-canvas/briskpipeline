import React from "react";
import { cn } from "@/utils/cn";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  title,
  subtitle,
  onSearch,
  onAdd,
  addLabel = "Add New",
  showSearch = true,
  showAdd = true,
  className,
  children,
  ...props 
}) => {
  return (
    <div className={cn("bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40", className)} {...props}>
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary to-secondary bg-clip-text">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4 ml-6">
          {showSearch && (
            <div className="hidden md:block">
              <SearchBar
                placeholder="Search..."
                onSearch={onSearch}
                className="w-80"
              />
            </div>
          )}
          
          {children}
          
          {showAdd && (
            <Button
              onClick={onAdd}
              variant="primary"
              className="shadow-lg hover:shadow-xl"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className="md:hidden mt-4">
          <SearchBar
            placeholder="Search..."
            onSearch={onSearch}
          />
        </div>
      )}
    </div>
  );
};

export default Header;