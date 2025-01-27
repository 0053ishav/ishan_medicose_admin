'use client';

import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  MegaphoneIcon,
  Home,
  User,
  BarChart3,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDarkMode =
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (prefersDarkMode) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
    localStorage.setItem("theme", newTheme);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: ShoppingBag },
    { name: "Banners", href: "/banners", icon: FileText },
    { name: "Announcements", href: "/announcement", icon: MegaphoneIcon },
    { name: "Orders", href: "/orders", icon: Home },
    { name: "Users", href: "/users", icon: User },
    { name: "Reports", href: "/reports", icon: BarChart3 },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-52"
      } h-full border-r flex flex-col transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-2xl font-bold">Ishan Medicose</h1>}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-xl shadow hover:bg-accent -mr-7"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className={`${isCollapsed ? "p-0" : "p-4 flex-1"} h-full`}>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent active:bg-accent ${
                  pathname === item.href ? "bg-accent" : ""
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
  

      {/* Dark Mode Toggle */}
      <div
        className={`flex items-center justify-center p-4 ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <button
          className="flex items-center justify-center w-full py-2 rounded-md hover:bg-accent"
          onClick={toggleDarkMode}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!isCollapsed && (
            <span className="ml-2">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          )}
        </button>
      </div>    </nav>
    </aside>
  );
};

export default Sidebar;