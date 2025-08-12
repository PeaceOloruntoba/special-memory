"use client";

import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/layout/Sidebar";
import { FiMenu, FiScissors, FiX } from "react-icons/fi";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-fit transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:w-64 md:flex-shrink-0`}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        {" "}
        <header className="md:hidden flex items-center h-16 bg-white shadow-sm px-4 border-b border-gray-200">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md p-1"
          >
            {isSidebarOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
          <div className="flex items-center gap-2 ml-4">
            <FiScissors className="h-7 w-7 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">Kunibi</span>
          </div>
        </header>
        <main className="flex-1 p-4 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
