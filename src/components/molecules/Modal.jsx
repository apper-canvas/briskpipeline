import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  className,
  overlayClassName,
  ...props
}) => {
  const sizes = {
    xs: "max-w-xs",
    sm: "max-w-sm", 
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    full: "max-w-full mx-4"
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modal = (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        overlayClassName
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <div 
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl w-full animate-scale-in transform-gpu",
          sizes[size],
          className
        )}
        {...props}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 ml-4"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            )}
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default Modal;