"use client";
import { useEffect, useState } from "react";
import useFetchProducts from "@/lib/hooks/useFetchProducts";
import Image from "next/image";
import { Edit2, Eye, Loader2, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteImage, deleteMedicalDetails, deleteProduct, searchProducts } from "@/lib/appwrite";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AlertModal from "@/components/AlertModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  discountPercentage: number;
  imageUrl: string;
  hoverImageUrl: string;
  description: string;
  stock: number;
  inStock: boolean;
  tags: string;
}

const ProductsTable = () => {
  const { loading, products } = useFetchProducts();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [load, setLoad] = useState(false);
  const [noProductsFound, setNoProductsFound] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const paginate = (products: Product[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const applyDiscount = (price: number, discountPercentage: number) => {
    return Math.round(price - (price * (discountPercentage / 100)));
  };

  // Debounce search input to optimize API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // Adjust debounce delay as needed
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch products based on debounced search query
  useEffect(() => {
    const fetchProducts = async () => {
      if (debouncedSearchQuery.trim() === "") {
        setFilteredProducts(products);
        setNoProductsFound(false);
        return;
      }
      setLoad(true);
      try {
        const response = await searchProducts(debouncedSearchQuery);
        const fetchedProducts = response.map((doc: any) => ({
          id: doc.$id,
          name: doc.name,
          description: doc.description,
          price: doc.price,
          discountedPrice: applyDiscount(doc.price, doc.discountPercentage),
          discountPercentage: doc.discountPercentage,
          imageUrl: doc.imageUrl,
          hoverImageUrl: doc.hoverImageUrl,
          stock: doc.stock,
          inStock: doc.inStock,
          tags: doc.tags,
        }));

        setFilteredProducts(fetchedProducts);
        setNoProductsFound(fetchedProducts.length === 0);
      } catch (error) {
        console.error("Error fetching products:", error);
        setNoProductsFound(true);
      } finally {
        setLoad(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchQuery, products]); // Trigger the effect when either debounced search or products change

  const extractFileId = (url: string): string | null => {
    const regex = /files\/([^/]+)\//;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleDeleteProduct = async (
    id: string,
    imageUrl: string,
    hoverImageUrl: string | null
  ) => {
    try {
      const imageFileId = extractFileId(imageUrl);
      const hoverImageFileId = hoverImageUrl
        ? extractFileId(hoverImageUrl)
        : null;

      if (imageFileId) {
        await deleteImage(imageFileId);
      }

      if (hoverImageFileId && hoverImageFileId !== imageFileId) {
        await deleteImage(hoverImageFileId);
      }

      await deleteMedicalDetails(id);
      await deleteProduct(id);
      setModal({
        isOpen: true,
        title: "Success",
        message: "Product deleted successfully!",
      });
    } catch (error) {
      setModal({
        isOpen: true,
        title: "Error",
        message: "An error occurred while deleting the product.",
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader2 className="animate-spin w-5 h-5" />
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          type="button"
          onClick={() => router.push("/products/create")}
          variant={"outline"}
        >
          Create
        </Button>
      </div>
      <div className="overflow-x-auto no-scrollbar">
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-accent">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Image</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">
              Discounted Price
            </th>
            <th className="border border-gray-300 px-4 py-2">Discount</th>
            <th className="border border-gray-300 px-4 py-2">Stock</th>
            <th className="border border-gray-300 px-4 py-2">In Stock</th>
            <th className="border border-gray-300 px-4 py-2">Tags</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {load ? (
            <tr>
              <td colSpan={9} className="text-center py-4">
                <Loader2 className="animate-spin w-5 h-5 mx-auto" />
              </td>
            </tr>
          ) : noProductsFound ? (
            <tr>
              <td colSpan={9} className="text-center py-4 text-red-500">
                No products found.
              </td>
            </tr>
          ) : (
            paginate(filteredProducts).map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    href={`products/details/${product.id}`}
                    className="cursor-pointer hover:text-primary"
                  >
                    {product.name}
                  </Link>
                </td>
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
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    product.inStock === true ? "text-primary" : "text-destructive"
                  }`}
                >
                  {product.inStock === true ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 px-4 py-2">{product.tags}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-purple-500 text-white px-1 py-1 rounded mr-2"
                    onClick={() => router.push(`/products/details/${product.id}`)}
                  >
                    <Eye size={"15"} />
                  </button>
                  <button
                    className="bg-blue-500 text-white px-1 py-1 rounded mr-2"
                    onClick={() => router.push(`/products/edit/${product.id}`)}
                  >
                    <Edit2 size={"15"} />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="bg-red-500 text-white px-1 py-1 rounded">
                        <Trash2Icon size={15} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this product? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleDeleteProduct(
                              product.id,
                              product.imageUrl,
                              product.hoverImageUrl
                            )
                          }
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
</div>
      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
        >
          Prev
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)
          }
        >
          Next
        </Button>
      </div>

      <AlertModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  );
};

export default ProductsTable;
