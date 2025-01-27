"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  deleteImage,
  fetchCategories,
  fetchProductById,
  updateProduct,
  uploadImage,
} from "@/lib/appwrite";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/AlertModal";

const EditProductPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [hoverImageFile, setHoverImageFile] = useState<File | null>(null);

  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        try {
          const data = await fetchProductById(id as string);
          setProduct(data);
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }

    const loadCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
  }, [id]);

  const openAlert = (title: string, message: string) => {
    setAlert({ isOpen: true, title, message });
  };

  const closeAlert = () => {
    setAlert({ isOpen: false, title: "", message: "" });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setProduct((prev: any) => ({ ...prev, [name]: value }));
  };

  //   const handleArrayChange = (e: any) => {
  //     const { name, value } = e.target;
  //     const values = value.split(",").map((item: string) => item.trim());
  //     setProduct((prev: any) => ({ ...prev, [name]: values }));
  //   };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleHoverImageChange = (e: any) => {
    const file = e.target.files[0];
    setHoverImageFile(file);
  };

  const handleDeleteImage = async (type: "main" | "hover") => {
    try {
      const imageUrl =
        type === "main" ? product.imageUrl : product.hoverImageUrl;
      if (!imageUrl) return;

      const fileId = new URL(imageUrl).pathname.split("/").slice(-2, -1)[0]; // Extract file ID from URL
      await deleteImage(fileId as string);

      setProduct((prev: any) => ({
        ...prev,
        [type === "main" ? "imageUrl" : "hoverImageUrl"]: "",
      }));

      openAlert(
        "Success",
        `${type === "main" ? "Main" : "Hover"} image deleted successfully!`
      );
    } catch (error) {
      console.error(`Error deleting ${type} image:`, error);
      openAlert("Error", `Failed to delete ${type} image.`);
    }
  };

  const handleSave = async () => {
    if (saveLoading) return; // Prevent multiple submissions

    setSaveLoading(true); // Start loading
    try {
      let imageUrl = product.imageUrl;
      let hoverImageUrl = product.hoverImageUrl;

      if (imageFile) {
        if (hoverImageFile && hoverImageFile.name === imageFile.name) {
          // Upload the image once, since both are the same
          const fileId = await uploadImage(imageFile);
          const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/67672b62001d09d89565/files/${fileId}/view?project=6759c0fe00002886bb8b&project=6759c0fe00002886bb8b&mode=admin`;

          imageUrl = fileUrl;
          hoverImageUrl = fileUrl;
        } else {
          const fileId = await uploadImage(imageFile);
          imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/67672b62001d09d89565/files/${fileId}/view?project=6759c0fe00002886bb8b&project=6759c0fe00002886bb8b&mode=admin`;

          if (hoverImageFile) {
            const hoverFileId = await uploadImage(hoverImageFile);
            hoverImageUrl = `https://cloud.appwrite.io/v1/storage/buckets/67672b62001d09d89565/files/${hoverFileId}/view?project=6759c0fe00002886bb8b&project=6759c0fe00002886bb8b&mode=admin`;
          }
        }
      }

      if (!imageFile) {
        imageUrl = product.imageUrl;
      }

      if (!hoverImageFile) {
        hoverImageUrl = product.hoverImageUrl;
      }

      const updatedProduct = {
        imageUrl,
        hoverImageUrl,
        inStock: product.inStock === "true",
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        discountPercentage: product.discountPercentage || 0,
        category: product.category,
        tags: product.tags.toLowerCase(),
      };

      await updateProduct(id as string, updatedProduct);

      openAlert("Success", "Product updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
      openAlert("Error", "Failed to update the product.");
    } finally {
      setSaveLoading(false);
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
              <Button
        onClick={() => router.push("/products")}
        className="flex items-center space-x-2 px-2 py-2 rounded-md  hover:bg-accent"
        variant={"outline"}
      >
        <ArrowLeft size={18} />
        <span>Back to Products</span>
      </Button>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form>
        <div className="mb-4">
          <label className="block">Name</label>
          <Input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            disabled={saveLoading}
            className="border border-gray-300 p-2 w-full dark:bg-accent"
          />
        </div>
        <div className="mb-4">
          <label className="block">Price</label>
          <Input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            disabled={saveLoading}
            className="border border-gray-300 p-2 w-full dark:bg-accent"
          />
        </div>
        <div className="mb-4">
          <label className="block">Stock</label>
          <Input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleInputChange}
            disabled={saveLoading}
            className="border border-gray-300 p-2 w-full dark:bg-accent"
          />
        </div>
        <div className="mb-4">
          <label className="block">Available</label>
          <select
            name="inStock"
            value={product.inStock ? "true" : "false"}
            onChange={handleInputChange}
            className={`border border-gray-300 p-2 w-full dark:bg-accent rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none${
              saveLoading ? "opacity-50" : ""
            }`}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Description</label>
          <textarea
            name="description"
            value={product.description || "N/A"}
            onChange={handleInputChange}
            className={`border border-gray-300 p-2 w-full dark:bg-accent rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none${
              saveLoading ? "opacity-50" : ""
            }`}
          />
        </div>
        <div className="mb-4">
          <label className="block">Discount Percentage</label>
          <Input
            type="number"
            name="discountPercentage"
            value={product.discountPercentage || "N/A"}
            onChange={handleInputChange}
            disabled={saveLoading}
            className="border border-gray-300 p-2 w-full dark:bg-accent"
          />
        </div>
        <div className="mb-4">
          <label className="block">Category</label>
          <select
            name="category"
            value={product.category || "N/A"}
            onChange={handleInputChange}
            className={`border border-gray-300 p-2 w-full dark:bg-accent rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none${
              saveLoading ? "opacity-50" : ""
            }`}
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category.$id} value={category.$id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Tags</label>
          <select
            name="tags"
            value={product.tags || "N/A"}
            onChange={handleInputChange}
            className={`border border-gray-300 p-2 w-full dark:bg-accent rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none${
              saveLoading ? "opacity-50" : ""
            }`}
          >
            <option value="bestsellers">Bestsellers</option>
            <option value="featured">Featured</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Product Image</label>
          {product.imageUrl && (
            <div className="mb-2 flex items-center">
              <Image
                src={product.imageUrl}
                alt="Product"
                className="h-24 w-24 object-cover mr-4"
                width={80}
                height={80}
              />
              <button
                type="button"
                onClick={() => handleDeleteImage("main")}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none" />
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={saveLoading}
            className="border border-gray-300 p-2 w-full dark:bg-accent rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block">Hover Image</label>
          {product.hoverImageUrl && (
            <div className="mb-2 flex items-center">
              <Image
                src={product.hoverImageUrl}
                alt="Hover"
                className="h-24 w-24 object-cover mr-4"
                width={80}
                height={80}
              />
              <button
                type="button"
                onClick={() => handleDeleteImage("hover")}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none" />
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleHoverImageChange}
            disabled={saveLoading}
            className="border border-gray-300 p-2 w-full dark:bg-accent rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
          />
        </div>
        {/* <div className="mb-4">
          <label className="block">Additional Image URLs (comma separated)</label>
          <Input
            type="text"
            name="additionalImages"
            value={product.additionalImages?.join(", ") || "N/A"}
            onChange={handleArrayChange}
            disabled={saveLoading}
            className="border border-gray-300 p-2 w-full dark:bg-accent"
          />
        </div> */}

        {/* Save Button */}
        <Button
          type="button"
          onClick={handleSave}
          disabled={saveLoading}
          className={`  px-4 py-2 rounded ${
            saveLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {saveLoading ? (
            <Loader2 className="animate-spin w-5 h-5 inline" />
          ) : (
            "Save"
          )}{" "}
        </Button>
      </form>

      <AlertModal
        title={alert.title}
        isOpen={alert.isOpen}
        message={alert.message}
        onClose={closeAlert}
      />
    </div>
  );
};

export default EditProductPage;