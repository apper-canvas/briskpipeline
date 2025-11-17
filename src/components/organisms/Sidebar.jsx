import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className, ...props }) => {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "BarChart3",
      exact: true
    },
    {
      name: "Contacts",
      href: "/contacts",
      icon: "Users"
    },
    {
      name: "Pipeline",
      href: "/pipeline", 
      icon: "Target"
    },
    {
      name: "Activity",
      href: "/activity",
      icon: "Activity"
    }
  ];

  return (
    <div className={cn("h-full bg-white border-r border-gray-200 w-64 flex flex-col", className)} {...props}>
      {/* Logo */}
      <div className="flex items-center px-6 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Target" size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-primary to-secondary bg-clip-text">
              Pipeline Pro
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href) && item.href !== "/";
            
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-primary"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                size={20} 
                className={cn(
                  "mr-3 transition-transform duration-200",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-primary",
                  "group-hover:scale-110"
                )}
              />
              <span className="font-semibold">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-75"></div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Sparkles" size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">CRM Pro</p>
              <p className="text-xs text-gray-600 truncate">Sales Pipeline Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;