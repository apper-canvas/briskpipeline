import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({
  className,
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  debounceMs = 300,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState(value || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) {
        onChange(searchTerm);
      }
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, onChange, onSearch, debounceMs]);

  const handleClear = () => {
    setSearchTerm("");
    if (onChange) onChange("");
    if (onSearch) onSearch("");
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        leftIcon={<ApperIcon name="Search" size={16} className="text-gray-400" />}
        rightIcon={
          searchTerm && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={16} />
            </button>
          )
        }
        className="pr-10"
        {...props}
      />
    </div>
  );
};

export default SearchBar;