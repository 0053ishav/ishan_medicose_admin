'use client';

import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  MegaphoneIcon,
  Home,
  User,
  BarChart3,
  Sun,
  Moon,
  PanelRightClose,
  PanelLeftClose,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const Sidebar = ({ isSidebarOpen, toggleSidebar }: { isSidebarOpen: boolean; toggleSidebar: () => void }) => {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const sideBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target as Node) && isSidebarOpen) {
        toggleSidebar();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isSidebarOpen]);

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

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: ShoppingBag },
    { name: "Banners", href: "/banners", icon: FileText },
    { name: "Announcements", href: "/announcement", icon: MegaphoneIcon },
    // { name: "Orders", href: "/orders", icon: Home },
    { name: "Categories", href: "/categories", icon: Tag },
    { name: "Users", href: "/users", icon: User },
    // { name: "Reports", href: "/reports", icon: BarChart3 },
  ];

  return (
    <aside
      ref={sideBarRef}
      className={`fixed h-screen lg:static top-0 left-0 bg-white dark:bg-black transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:w-52 w-64 z-50 border-r`}
    >
      <Button
        onClick={toggleSidebar}
        className="absolute top-1/2 z-10 lg:hidden -right-3 transform -translate-y-1/2 bg-primary p-2 rounded-full shadow-lg hover:bg-primary/80"
        aria-label="Open Sidebar"
      >
        {isSidebarOpen ? (
          <PanelLeftClose className="w-5 h-5" />
        ) : (
          <PanelRightClose className="w-5 h-5" />
        )}
      </Button>

      <div className="p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ishan Medicose</h1>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name} onClick={toggleSidebar}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent ${
                  pathname === item.href ? "bg-accent" : ""
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        <button
          className="flex items-center w-full space-x-3 px-3 py-2 rounded-md hover:bg-accent"
          onClick={toggleDarkMode}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="ml-2">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;