'use client'
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/appwrite";

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  discountPercentage: number;
  imageUrl: string;
  hoverImageUrl: string;
  description: string;
  image: string;
  stock: number;
  inStock: boolean;
  tags: string;
}

const useFetchProducts = (tags?: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let productData = await fetchProducts(); 
        
        
        if (tags) {
          productData = productData.filter((product: any) => product.tags === tags);
        }

        const formattedProducts = productData.map((product: any) => ({
          id: product.$id,
          name: product.name,
          price: product.price,
          discountedPrice: product.discountedPrice,
          discountPercentage: product.discountPercentage,
          imageUrl: product.imageUrl,
          description: product.description,
          image: product.image,
          hoverImageUrl: product.hoverImageUrl,
          stock: product.stock,
          inStock: product.inStock,
          tags: product.tags,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [tags]);

  return { loading, products };
};

export default useFetchProducts;