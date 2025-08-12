import { Outlet } from "react-router";
import Sidebar from "../components/layout/Sidebar";

export default function AdminLayout() {
  return (
    <div className="min-w-screen min-h-screen flex">
      <div className="md:w-1/4 w-0">
        <Sidebar />
      </div>
      <div className="p-4 md:w-3/4 w-screen">
        <Outlet />
      </div>
    </div>
  );
}
