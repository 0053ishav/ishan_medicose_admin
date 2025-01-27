"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import { User } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const router = useRouter();

  const user = auth.currentUser;

  const toggleUserProfile = () => setIsUserProfileOpen(!isUserProfileOpen);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const goToAccounts = () => {
    router.push("/account");
  };

  return (
    <header className="h-20 flex items-center justify-between px-4 py-2 border-b">
      {/* Left Section: Logo */}
      <div className="flex items-center">
        <Link href={"/"} className="cursor-pointer">
          <Image
            src={"/Logo/logo-no-background.svg"}
            alt="Ishan Medicose Pharmacy Logo"
            width={160}
            height={160}
            className="hidden lg:block"
          />
        </Link>
        <Link href={"/"} className="text-xl font-semibold ml-4">
          Admin Dashboard
        </Link>
      </div>

      {/* Right Section: User Profile */}
      <div className="relative">
        <button
          onClick={toggleUserProfile}
          className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent"
          aria-label="User Profile"
        >
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt={`${user.displayName || "User"}'s Profile`}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <User className="w-5 h-5 cursor-pointer" />
          )}
          <span className="hidden sm:block text-sm font-medium">
            {user?.displayName || "User"}
          </span>
        </button>

        {/* User Profile Modal */}
        {isUserProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 shadow-lg rounded-md bg-accent">
            <div className="p-4 border-b border-black dark:border-b-foreground">
              <h3 className="text-sm font-medium">{user?.displayName}</h3>
              <p className="text-xs">{user?.email}</p>
            </div>
            {!user && (
              <ul className="py-2">
                <li>
                  <button className="block w-full text-left px-4 py-2 hover:bg-accent text-sm">
                    <Link href={"/sign-in"}>Sign In</Link>
                  </button>
                </li>
                <li>
                  <button className="block w-full text-left px-4 py-2 hover:bg-accent text-sm">
                    <Link href={"/sign-up"}>Sign Up</Link>
                  </button>
                </li>
              </ul>
            )}
            {user && (
              <ul className="py-2">
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-accent text-sm"
                    onClick={goToAccounts}
                  >
                    Account Settings
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-accent text-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;