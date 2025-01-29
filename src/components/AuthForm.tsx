"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, googleProvider } from "@/firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/lib/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const db = getFirestore();

const authFormSchema = (type: string) =>
  z
    .object({
      email: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      ...(type === "sign-up" && {
        confirmPassword: z
          .string()
          .min(6, "Password must be at least 6 characters"),
      }),
    })
    .superRefine((data, ctx) => {
      if (type === "sign-up" && data.confirmPassword !== data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "Passwords must match",
        });
      }
    });

const handleFirebaseError = (error: any, form: any, toast: any) => {
  if (error.code === "auth/user-not-found") {
    toast({
      title: "Error",
      description: "User not found!",
      variant: "destructive",
    });
    form.setError("email", {
      type: "manual",
      message: "No account found with this email.",
    });
  } else if (error.code === "auth/invalid-credential") {
    toast({
      title: "Invalid credentials",
      description: "Please check your credentials then try again!",
      variant: "destructive",
    });
  } else if (error.code === "auth/email-already-in-use") {
    toast({
      title: "Email exists",
      description: "Email is already in use. Please Sign In.",
      variant: "destructive",
      action: (
        <ToastAction altText="Sign In" className=" ">
          <Link href={"/sign-in"} className="">
            Sign In
          </Link>
        </ToastAction>
      ),
    });
    form.setError("email", {
      type: "manual",
      message: "Email is already in use.",
    });
  } else {
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  }
};

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(authFormSchema(type)),
    defaultValues: {
      email: "",
      password: "",
      ...(type === "sign-up" && { confirmPassword: "" }),
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (type === "sign-in") {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        toast({
          title: "Success",
          description: "Signed in successfully!",
          variant: "default",
        });

        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userRole = userDoc.data().role;
          if (userRole === "admin") {
            router.push("/");
          } else {
            toast({
              title: "Role Unavailable",
              description:
                "No role assigned for this user. Please contact to the owner.",
              variant: "destructive",
            });
            router.push("/sign-up");
          }
        }
      } else if (type === "sign-up") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        toast({
          title: "Success",
          description: "Account created successfully! Please sign in.",
          variant: "default",
        });
        router.push("/sign-in");
      }
    } catch (error: any) {
      handleFirebaseError(error, form, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "Success",
        description: "Signed in with Google successfully!",
        variant: "default",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Google authentication failed.",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <section className="flex flex-col justify-start items-center sm:justify-center min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-6 space-y-4 bg-white shadow-md rounded-lg">
        {/* Header */}
        <div className="flex flex-col items-center space-y-4">
          <Image src="/Logo/logoPlus.png" width={50} height={50} alt="Logo" />
          <h1 className="text-2xl font-semibold text-gray-800">
            {type === "sign-in" ? "Welcome Back!" : "Create an Account"}
          </h1>
          <p className="text-sm text-gray-600">
            {type === "sign-in"
              ? "Sign in to continue to your account"
              : "Sign up to get started"}
          </p>
        </div>
        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 text-left"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              placeholder="Enter your email"
              {...form.register("email")}
              className="mt-1"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...form.register("password")}
              className="mt-1"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}

            <div className={`${type === "sign-up" ? "hidden" : "mt-2"}`}>
              <Link href="/forgot-password" className="text-blue-500 text-sm">
                Forgot Password?
              </Link>
            </div>
          </div>
          {type === "sign-up" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="Confirm your password"
                {...form.register("confirmPassword")}
                className="mt-1"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 text-white rounded-lg"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Loading...
              </>
            ) : type === "sign-in" ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <span className="absolute inset-x-0 h-px bg-gray-300"></span>
          <span className="px-4 text-sm text-gray-600 bg-white z-10">or</span>
        </div>

        {/* Google Sign In */}
        <Button
          onClick={handleGoogleAuth}
          disabled={googleLoading}
          variant="outline"
          className="w-full py-2 border rounded-lg bg-transparent"
        >
          {googleLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <div className="flex items-center justify-center">
              <Image
                src="/Icons/google-icon.svg"
                alt="Google Icon"
                width={18}
                height={18}
                className="mr-2"
              />
              <span className="">Sign in with Google</span>
            </div>
          )}
        </Button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600">
          {type === "sign-in"
            ? "Don't have an account? "
            : "Already have an account? "}
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="font-medium text-primary hover:underline"
          >
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </section>
  );
};

export default AuthForm;