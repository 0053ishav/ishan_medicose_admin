"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, ArrowLeft } from "lucide-react";
import { fetchCategory, fetchMedicalDetails, fetchProductById } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [medicalDetails, setMedicalDetails] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        try {
          const data = await fetchProductById(id as string);
          setProduct(data);
          const response = await fetchMedicalDetails(id as string);
          setMedicalDetails(response.documents);
          
          if (data) {
            const categoryData = await fetchCategory(data);
            setCategoryName(categoryData.categoryName || "N/A");
          }

        } catch (error) {
          throw new Error("Error fetching product.",);
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <p className="text-lg font-bold">Product not found!</p>
      </div>
    );
  }

  const mainImage = selectedImage || product.imageUrl;

  return (
    <div className="container mx-auto mt-8">
      <Button
        onClick={() => router.push("/products")}
        className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-accent"
        variant={"outline"}
      >
        <ArrowLeft size={18} />
        {/* <span>Back to Products</span> */}
      </Button>

      <div className="mt-8 p-6 border rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 relative">
            <div className="relative">
              <Image
                src={mainImage}
                alt={product.name}
                width={300}
                height={300}
                className="rounded-lg"
                priority
              />
              <Image
                src={product.hoverImageUrl}
                alt={`${product.name} hover`}
                width={300}
                height={300}
                className="rounded-lg absolute top-0 left-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            {product.additionalImages.length > 0 && (
                
              <div className="mt-4 grid grid-cols-3 gap-2 overflow-auto">
                {product.additionalImages.map(
                  (imgUrl: string, index: number) => (
                    <div key={index} className="cursor-pointer">
                      <Image
                        src={imgUrl}
                        alt={`Additional image ${index + 1}`}
                        width={100}
                        height={100}
                        className="rounded-lg"
                        onClick={() => setSelectedImage(imgUrl)}
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="md:ml-8 mt-4 md:mt-0">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="mt-2">{product.description}</p>
            <p className="mt-4 text-lg">
              <span className="font-semibold">Price: </span>${product.price}
            </p>
            {product.discountPercentage > 0 && (
              <p className="mt-2 text-lg text-green-600">
                <span className="font-semibold">Discount: </span>
                {product.discountPercentage}%
              </p>
            )}
            <p className="mt-2 text-lg">
              <span className="font-semibold">Stock: </span>
              {product.stock}{" "}
              {product.inStock ? "(In Stock)" : "(Out of Stock)"}
            </p>
            <p className="mt-2 text-lg">
              <span className="font-semibold">Category: </span>
              {categoryName || "N/A"}
            </p>
            <p className="mt-2 text-lg">
              <span className="font-semibold">Tags: </span>
              {product.tags || "N/A"}
            </p>
          </div>
        </div>

        {medicalDetails.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Medical Details</h2>
            <ul className="mt-4 space-y-2">
              {medicalDetails.map((detail: any, index: number) => (
                <div key={index}>
                  <li className="p-4 border rounded-lg shadow-sm">
                    <p className="text-lg font-semibold">{detail.name}</p>
                    <p>{detail.description}</p>
                  </li>

                  <div className="my-6">
                    <h2 className="text-xl font-semibold">Features</h2>
                    <ul className="list-disc list-inside mt-2">
                      {detail.features.map(
                        (feature: any, featureIndex: number) => (
                          <li key={featureIndex}>{feature}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Medical Uses</h2>
                    <p className="mt-2">{detail.medicalUses}</p>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Precautions</h2>
                    <ul className="list-disc list-inside mt-2">
                      {detail.precautions.map(
                        (precaution: any, precautionIndex: number) => (
                          <li key={precautionIndex}>{precaution}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">
                      Additional Details
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <span className="font-semibold">Manufacturer:</span>{" "}
                        {detail.manufacturer}
                      </div>
                      <div>
                        <span className="font-semibold">Dosage:</span>{" "}
                        {detail.dosage}
                      </div>
                      <div>
                        <span className="font-semibold">Expiry Date:</span>{" "}
                        {detail.expiryDate}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-6 bg-white shadow-md rounded-md text-center mt-12">
            <div className=" text-center text-2xl font-bold text-gray-800">
              Medical Details
            </div>
            <p className="text-red-500 text-xl font-semibold">
              No Details Available
            </p>
            <p className="text-gray-600 text-lg">
              Sorry, we couldn't find any details for the requested product.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;