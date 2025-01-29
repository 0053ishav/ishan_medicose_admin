"use client";

import { useState, useEffect, Suspense } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { confirmPasswordReset } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ResetPasswordForm = ({ oobCode }: { oobCode: string | null }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!oobCode) {
      setError("Invalid or expired password reset link.");
    }
  }, [oobCode]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!oobCode) {
      setError("Invalid or missing reset code.");
      setLoading(false);
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => router.push("/sign-in"), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
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
          Reset Password
          </h1>
          <p className="text-sm text-gray-600">
          Enter your new password below.
          </p>
        </div>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        <form onSubmit={handleResetPassword} className="space-y-6 text-left">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <Button
            type="submit"
            className="w-full px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
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

const ResetPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordWithParams />
    </Suspense>
  );
};

const ResetPasswordWithParams = () => {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  return <ResetPasswordForm oobCode={oobCode} />;
};

export default ResetPassword;
