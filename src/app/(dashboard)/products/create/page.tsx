"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createMedicalDetails, createProduct, fetchCategories, uploadImage } from "@/lib/appwrite";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/AlertModal";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateProductPage = () => {
  const router = useRouter();

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    inStock: "true",
    description: "",
    discountPercentage: 0,
    category: "",
    tags: "",
    imageUrl: "",
    hoverImageUrl: "",
  });


  const [medicalDetails, setMedicalDetails] = useState({
    name: "",
    description: "",
    features: [""],
    medicalUses: "",
    precautions: [""],
    manufacturer: "",
    dosage: "",
    expiryDate: "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>(["Bestsellers", "Featured"]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [hoverImageFile, setHoverImageFile] = useState<File | null>(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
  }, []);

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

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleHoverImageChange = (e: any) => {
    const file = e.target.files[0];
    setHoverImageFile(file);
  };

  const handleMedicalDetailsChange = (e: any) => {
    const { name, value } = e.target;
    setMedicalDetails((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (saveLoading) return;

    setSaveLoading(true);
    try {
      let imageUrl = "";
      let hoverImageUrl = "";

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
      } else {
        imageUrl = "https://cloud.appwrite.io/v1/storage/buckets/67672b62001d09d89565/files/67672b72002bb9a01efc/view?project=6759c0fe00002886bb8b&project=6759c0fe00002886bb8b&mode=admin";
      }
      if(!hoverImageFile) {
        hoverImageUrl = imageUrl
      }

      const newProduct = {
        ...product,
        price: parseInt(product.price as any, 10),
        stock: parseInt(product.stock as any, 10),
        discountPercentage: parseInt(product.discountPercentage as any, 10),
        imageUrl,
        hoverImageUrl,
        inStock: product.inStock === "true",
      };

      const createdProduct =  await createProduct(newProduct);

      const medicalDetailsWithProductId = {
        ...medicalDetails,
        productId: createdProduct.$id,
      };

      await createMedicalDetails(medicalDetailsWithProductId);

      openAlert("Success", "Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      openAlert("Error", "Failed to create the product.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <Button
        onClick={() => router.push("/products")}
        className="flex items-center space-x-2 px-2 py-2 rounded-md  hover:bg-accent"
        variant={"outline"}
      >
        <ArrowLeft size={18} />
        {/* <span>Back to Products</span> */}
      </Button>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold my-4">Create Product</h1>
        <Button
          type="button"
          onClick={handleSave}
          disabled={saveLoading}
          className={`px-4 py-2 rounded ${saveLoading ? "opacity-50" : ""}`}
        >
          {saveLoading ? (
            <Loader2 className="animate-spin w-5 h-5 inline" />
          ) : (
            "Create"
          )}
        </Button>
      </div>
      <form>
        <div className="mb-4">
          <label className="block">Name</label>
          <Input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            disabled={saveLoading}
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
          />
        </div>
        <div className="mb-4">
          <label className="block">Available</label>
          <Select
            name="inStock"
            value={product.inStock}
            onValueChange={(value) =>
              setProduct((prev) => ({ ...prev, inStock: value }))
            }
            disabled={saveLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <label className="block">Description</label>
          <Textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            disabled={saveLoading}
            className=" p-2 w-full rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block">Discount Percentage</label>
          <Input
            type="number"
            name="discountPercentage"
            value={product.discountPercentage}
            onChange={handleInputChange}
            disabled={saveLoading}
          />
        </div>

        <div className="mb-4">
          <label className="block">Category</label>
          <Select
            value={product.category}
            onValueChange={(value) =>
              setProduct((prev) => ({ ...prev, category: value }))
            }
            disabled={saveLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Select a Category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.$id} value={category.$id}>
                  {category.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block">Tags</label>
          <Select
            value={product.tags}
            onValueChange={(value) =>
              setProduct((prev) => ({ ...prev, tags: value }))
            }
            disabled={saveLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Select a Tag</SelectItem>
              {tags.map((tag, index) => (
                <SelectItem key={index} value={tag.toLocaleLowerCase()}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:flex sm:flex-row sm:gap-2 sm:justify-between">
        <div className="mb-4">
          <label className="block">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={saveLoading}
            className="border p-2"
          />
          {imageFile && (
            <Image
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="h-24 w-24 object-cover mt-2"
              width={80}
              height={80}
            />
          )}
        </div>

        <div className="mb-4">
          <label className="block">Hover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleHoverImageChange}
            disabled={saveLoading}
            className="border p-2"
          />
          {hoverImageFile && (
            <Image
              src={URL.createObjectURL(hoverImageFile)}
              alt="Preview"
              className="h-24 w-24 object-cover mt-2"
              width={80}
              height={80}
            />
          )}
        </div>
        </div>


         {/* Medical Details Inputs */}
         <div className="shadow p-4 border">
            <h1 className="text-center text-2xl font-bold">Medical Details</h1>

         <div className="mb-4">
          <label className="block">Medical Details Name</label>
          <Input
            type="text"
            name="name"
            value={medicalDetails.name}
            onChange={handleMedicalDetailsChange}
            disabled={saveLoading}
          />
        </div>

        <div className="mb-4">
          <label className="block">Description</label>
          <Textarea
            name="description"
            value={medicalDetails.description}
            onChange={handleMedicalDetailsChange}
            disabled={saveLoading}
          />
        </div>


        {/* Features */}
        <div className="mb-4">
          <label className="block">Features (comma separated)</label>
          <Input
            type="text"
            name="features"
            placeholder="Fast-acting pain relief, Non-greasy formula, Recommended by doctors"
            value={medicalDetails.features.join(", ")}
            onChange={(e) => {
              const features = e.target.value.split(",").map((feature) => feature.trim());
              setMedicalDetails((prev) => ({ ...prev, features }));
            }}
            disabled={saveLoading}
          />
        </div>

        {/* Medical Uses */}
        <div className="mb-4">
          <label className="block">Medical Uses</label>
          <Input
            type="text"
            name="medicalUses"
            value={medicalDetails.medicalUses}
            onChange={handleMedicalDetailsChange}
            disabled={saveLoading}
          />
        </div>

        {/* Precautions */}
        <div className="mb-4">
          <label className="block">Precautions (comma separated)</label>
          <Input
            type="text"
            name="precautions"
            placeholder="Do not use on open wounds, Keep away from children, Consult a doctor if irritation occurs"
            value={medicalDetails.precautions.join(", ")}
            onChange={(e) => {
              const precautions = e.target.value.split(",").map((precaution) => precaution.trim());
              setMedicalDetails((prev) => ({ ...prev, precautions }));
            }}
            disabled={saveLoading}
          />
        </div>

        {/* Manufacturer */}
        <div className="mb-4">
          <label className="block">Manufacturer</label>
          <Input
            type="text"
            name="manufacturer"
            value={medicalDetails.manufacturer}
            onChange={handleMedicalDetailsChange}
            disabled={saveLoading}
          />
        </div>

        {/* Dosage */}
        <div className="mb-4">
          <label className="block">Dosage</label>
          <Input
            type="text"
            name="dosage"
            placeholder="Apply twice daily or as directed by a physician."
            value={medicalDetails.dosage}
            onChange={handleMedicalDetailsChange}
            disabled={saveLoading}
          />
        </div>

        {/* Expiry Date */}
        <div className="mb-4">
          <label className="block">Expiry Date</label>
          <Input
            type="date"
            name="expiryDate"
            value={medicalDetails.expiryDate}
            onChange={handleMedicalDetailsChange}
            disabled={saveLoading}
            className="w-[150px] dark:[color-scheme:dark]"
          />
        </div>

        </div>
        <Button
          type="button"
          onClick={handleSave}
          disabled={saveLoading}
          className={`px-4 py-2 mt-4 rounded ${saveLoading ? "opacity-50" : ""}`}
        >
          {saveLoading ? (
            <Loader2 className="animate-spin w-5 h-5 inline" />
          ) : (
            "Create"
          )}
        </Button>
      </form>
      <AlertModal
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        onClose={() => router.push("/products")}
      />
    </div>
  );
};

export default CreateProductPage;