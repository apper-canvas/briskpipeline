import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2"
        >
          <ApperIcon name="Menu" size={20} />
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Target" size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 bg-gradient-to-r from-primary to-secondary bg-clip-text">
            Pipeline Pro
          </h1>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex flex-shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar 
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;