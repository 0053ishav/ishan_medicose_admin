'use client'
import React from "react";
import useFetchProducts from "@/lib/hooks/useFetchProducts";
import Image from "next/image";
import { Edit2, Eye, Loader2, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductsTable = () => {
  const { loading, products } = useFetchProducts();
  const router = useRouter();

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader2 className="animate-spin w-5 h-5"/>
      </div>
    )
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-accent">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Image</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Discounted Price</th>
            <th className="border border-gray-300 px-4 py-2">Discount</th>
            <th className="border border-gray-300 px-4 py-2">Stock</th>
            <th className="border border-gray-300 px-4 py-2">In Stock</th>
            <th className="border border-gray-300 px-4 py-2">Tags</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border border-gray-300 px-4 py-2">{product.name}</td>
              <td className="border border-gray-300 px-4 py-2 flex justify-center items-center">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="hover:scale-125"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">${product.price}</td>
              <td className="border border-gray-300 px-4 py-2">
                {product.discountedPrice
                  ? `$${product.discountedPrice}`
                  : "No Discount"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-primary">
                {product.discountPercentage
                  ? `${product.discountPercentage}%`
                  : "No Discount"}
              </td>
              <td className="border border-gray-300 px-4 py-2">{product.stock}</td>
              <td className={`border border-gray-300 px-4 py-2`}>{product.inStock}</td>
              <td className="border border-gray-300 px-4 py-2">{product.tags}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="bg-purple-500 text-white px-1 py-1 rounded mr-2"
                  onClick={() => router.push(`/products/details/${product.id}`)}
                >
                  <Eye size={"15"}/>
                </button>
                <button
                  className="bg-blue-500 text-white px-1 py-1 rounded mr-2"
                  onClick={() => router.push(`/products/edit/${product.id}`)}
                >
                  <Edit2 size={"15"}/>
                </button>
                <button
                  className="bg-red-500 text-white px-1 py-1 rounded"
                  onClick={() => {}}
                >
                  <Trash2Icon size={"15"}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;