"use client";

import { useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/lib/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Success",
        description: "Password reset email sent. Check your inbox.",
        variant: "default",
      });
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please wait for some time.",
        variant: "destructive",
      });
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex-center size-full flex flex-col justify-start items-center sm:justify-center min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-6 space-y-4 bg-white shadow-md rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <Image src="/Logo/logoPlus.png" width={50} height={50} alt="Logo" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-600">
            Enter your email, and we'll send you a reset link.
          </p>
        </div>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        <form onSubmit={handleResetPassword} className="space-y-6 text-left">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <Button
            type="submit"
            className="w-full px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Send Reset Email"
            )}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Back to
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline ml-2"
          >
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;