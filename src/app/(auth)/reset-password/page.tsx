"use client";

import { useState, useEffect, Suspense } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { confirmPasswordReset } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your new password below.
        </p>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        <form onSubmit={handleResetPassword} className="space-y-4">
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/sign-in" className="text-blue-500 text-sm">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
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
