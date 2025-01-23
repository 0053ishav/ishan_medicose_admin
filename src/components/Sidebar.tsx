import { Home, ShoppingBag, LayoutDashboard, MegaphoneIcon, User, BarChart3, FileText } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: ShoppingBag },
    { name: "Banners", href: "/banners", icon: FileText },
    { name: "Announcements", href: "/announcements", icon: MegaphoneIcon },
    { name: "Orders", href: "/orders", icon: Home },
    { name: "Users", href: "/users", icon: User },
    { name: "Reports", href: "/reports", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white h-full p-4">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Ishan Medicose Admin</h1>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 p-2 rounded-md"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
