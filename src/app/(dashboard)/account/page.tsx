"use client";

import Image from "next/image";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useEffect } from "react";

const Accounts = () => {
  const user = auth.currentUser;
  const router = useRouter()
  const { loggedUser, userLoading } = useAuth();
  
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
  
  

  if (!user) {
    return (
        <div className="flex justify-center items-center w-full h-screen">
            <Loader2 className="animate-spin text-foreground"/>
        </div>
    )
  }
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Account Information</h1>
      <div className="flex items-center space-x-4">
        <Image
          src={user.photoURL || "/default-profile.png"}
          alt="Profile Picture"
          width={64}
          height={64}
          className="rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.displayName || "User"}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <div>
            <Button
            onClick={handleLogout}
            >
                Logout
            </Button>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
