'use client';

import ChartComponent from "@/components/ChartComponent";
import { fetchProductsCount, fetchSubsCount, fetchUsersCount } from "@/lib/appwrite";
import { Loader2, User, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [counts, setCounts] = useState({ total: 0, inStock: 0 });
  const [users, setUsers] = useState(0);
  const [subs, setSubs] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCountProducts = async () => {
      setLoading(true);
      try {
        const response = await fetchProductsCount();
        const result = await fetchUsersCount();
        const news = await fetchSubsCount();
        setUsers(result)
        setCounts(response);
        setSubs(news);
      } catch (error) {
        console.error("Error fetching product and user counts:", error);
      } finally {
        setLoading(false);
      }
    };
    getCountProducts();
  }, []);

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Dashboard Overview</h1>
      <p className="text-lg text-center mb-8">Track performance, manage inventory, and monitor orders here.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Products Card */}
        <div className="p-6 rounded-lg shadow-lg flex items-center justify-between bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105 transition-transform">
          <div>
            <h3 className="text-xl font-semibold text-white">Total Products</h3>
            <p className="text-2xl font-bold text-white">
              {loading ? <Loader2 className="animate-spin" /> : counts.total}
            </p>
          </div>
          <div className="bg-blue-500 p-4 rounded-full">
            <span className="text-xl">📦</span>
          </div>
        </div>

        {/* In Stock Products Card */}
        <div className="p-6 rounded-lg shadow-lg flex items-center justify-between bg-gradient-to-r from-green-400 to-yellow-400 hover:scale-105 transition-transform">
          <div>
            <h3 className="text-xl font-semibold text-white">In Stock</h3>
            <p className="text-2xl font-bold text-white">
              {loading ? <Loader2 className="animate-spin" /> : counts.inStock}
            </p>
          </div>
          <div className="bg-primary p-4 rounded-full">
            <span className="text-xl ">✅</span>
          </div>
        </div>

        {/* Out of Stock Products Card */}
        <div className="p-6 rounded-lg shadow-lg flex items-center justify-between bg-gradient-to-r from-red-400 to-red-600 hover:scale-105 transition-transform">
          <div>
            <h3 className="text-xl font-semibold text-white">Out of Stock</h3>
            <p className="text-2xl font-bold text-white">
              {loading ? <Loader2 className="animate-spin" /> : counts.total - counts.inStock}
            </p>
          </div>
          <div className="bg-red-500 p-4 rounded-full">
            <span className="text-xl text-white">
              <X />
            </span>
          </div>
        </div>

{/* Total Users Card */}
<div className="p-6 rounded-lg shadow-lg flex items-center justify-between bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 transition-transform">
  <div>
    <h3 className="text-xl font-semibold text-white">Total Users</h3>
    <p className="text-3xl font-bold text-white">
      {loading ? <Loader2 className="animate-spin text-white" /> : users}
    </p>
  </div>
  <div className="bg-white p-4 rounded-full shadow-md">
    <span className="text-2xl text-indigo-500"><User /></span>
  </div>
</div>

{/* Total Subs Card */}
<div className="p-6 rounded-lg shadow-lg flex items-center justify-between bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 hover:scale-105 transition-transform">
  <div>
    <h3 className="text-xl font-semibold text-white">Total Newsletter Subscribers</h3>
    <p className="text-3xl font-bold text-white">
      {loading ? <Loader2 className="animate-spin text-white" /> : subs}
    </p>
  </div>
  <div className="bg-white p-4 rounded-full shadow-md">
    <span className="text-2xl text-teal-500"><User /></span>
  </div>
</div>


      </div>

      <div className="mt-8">
        <ChartComponent
          data={{
            total: counts.total,
            inStock: counts.inStock,
            outOfStock: counts.total - counts.inStock,
          }}
        />
      </div>
    </div>
  );
}
