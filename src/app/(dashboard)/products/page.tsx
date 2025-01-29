'use client'
import ProductsTable from "@/components/Products/ProductTable";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProductsPage() {
  const { loggedUser, userLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && (!loggedUser || loggedUser.role !== "admin")) {
      router.push("/sign-in");
    }
  }, [loggedUser, userLoading, router]);

  if (userLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
          <Loader2 className="animate-spin text-foreground"/>
      </div>
    ) 
  }
  if (!loggedUser || loggedUser.role !== "admin") return null;


    return (
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Products</h1> */}
        <ProductsTable />
      </div>
    );
  }
  