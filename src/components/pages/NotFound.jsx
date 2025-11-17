import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Error Icon */}
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="AlertTriangle" size={64} className="text-red-600" />
          </div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-red-700">404</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            variant="primary"
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Go to Dashboard
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          >
            <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-8">
          <p className="text-sm text-gray-500 mb-4">Quick Navigation:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-primary hover:text-secondary underline transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/contacts")}
              className="text-sm text-primary hover:text-secondary underline transition-colors"
            >
              Contacts
            </button>
            <button
              onClick={() => navigate("/pipeline")}
              className="text-sm text-primary hover:text-secondary underline transition-colors"
            >
              Pipeline
            </button>
            <button
              onClick={() => navigate("/activity")}
              className="text-sm text-primary hover:text-secondary underline transition-colors"
            >
              Activity
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <ApperIcon name="HelpCircle" size={14} />
              <span>Need Help?</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="MessageCircle" size={14} />
              <span>Contact Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;