import { useState, useEffect } from "react";

import {
  FiHome,
  FiUsers,
  FiFileText,
  FiSettings,
  FiCalendar,
  FiTrendingUp,
  FiScissors,
  FiDollarSign,
  FiCreditCard,
} from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore";
import Button from "../ui/Button";
import { IoSparklesOutline } from "react-icons/io5";
import { LuPalette, LuRuler } from "react-icons/lu";

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: FiHome },
  { name: "Clients", href: "/clients", icon: FiUsers },
  { name: "Measurements", href: "/measurements", icon: LuRuler },
  { name: "Pattern Designer", href: "/patterns", icon: LuPalette },
  { name: "AI Patterns", href: "/ai-patterns", icon: IoSparklesOutline },
  { name: "Projects", href: "/projects", icon: FiFileText },
  { name: "Invoices", href: "/invoices", icon: FiDollarSign },
  { name: "Calendar", href: "/calendar", icon: FiCalendar },
  { name: "Analytics", href: "/analytics", icon: FiTrendingUp },
  { name: "Pricing", href: "/pricing", icon: FiCreditCard },
  { name: "Settings", href: "/settings", icon: FiSettings },
];

export default function Sidebar() {
  const [currentPathname, setCurrentPathname] = useState("");
  const { user } = useAuthStore();

  useEffect(() => {
    setCurrentPathname(window.location.pathname);

    const handleLocationChange = () => {
      setCurrentPathname(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const userDisplayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email || "Guest User";

  const userImage =
    user?.image ||
    "https://cdn.vectorstock.com/i/500p/45/59/profile-photo-placeholder-icon-design-in-gray-vector-37114559.jpg";

  let userDisplayPlan;
  if (user?.isAdmin) {
    userDisplayPlan = "Admin";
  } else if (user?.plan) {
    userDisplayPlan =
      user.plan.charAt(0).toUpperCase() + user.plan.slice(1) + " Plan";
  } else {
    userDisplayPlan = "Basic User";
  }

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg overflow-hidden justify-between min-h-screen">
      <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="flex items-center gap-2">
          <FiScissors className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">Kunibi</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = currentPathname === item.href;

          const buttonClasses = classNames(
            "w-full flex justify-start h-10 px-4 py-2 items-center gap-3 rounded-md text-sm font-medium transition-colors",
            isActive
              ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
              : "text-gray-700 hover:bg-gray-100"
          );

          const IconComponent = item.icon;
          return (
            <a key={item.name} href={item.href}>
              <Button className={buttonClasses}>
                <IconComponent className="h-4 w-4" />
                {item.name}
              </Button>
            </a>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <img src={userImage} className="w-7 h-7 rounded-full" alt="" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {userDisplayName}
            </p>
            <p className="text-xs text-gray-500">
              {user?.isAdmin ? "Admin" : userDisplayPlan}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
