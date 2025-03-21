"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";

export default function SignInPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Redirect to  if already signed in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSignIn = async (provider: "google" | "github" | "credentials") => {
    setIsLoading(true);
    setError("");

    try {
      if (provider === "credentials") {
        if (!formData.email || !formData.password) {
          setError("Please enter both email and password.");
          setIsLoading(false);
          return;
        }

        const res = await signIn("credentials", { ...formData, redirect: false });

        if (res?.error) {
          setError("Invalid email or password.");
          setIsLoading(false);
          return;
        }

        router.push("/"); // Redirect to 
      } else {
        await signIn(provider, { callbackUrl: "/" }); // Ensure correct callback URL
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Sign In</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Please sign in</p>
        </div>

        <div className="grid gap-4">
          <Button variant="outline" type="button" disabled={isLoading} onClick={() => handleSignIn("google")} className="flex items-center gap-2">
            <FcGoogle className="text-xl" /> Continue with Google
          </Button>

          <Button variant="outline" type="button" disabled={isLoading} onClick={() => handleSignIn("github")} className="flex items-center gap-2">
            <FaGithub className="text-xl text-gray-900 dark:text-white" /> Continue with GitHub
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or sign in with email</span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn("credentials");
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="m@example.com" 
                type="email" 
                autoComplete="email" 
                disabled={isLoading} 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              />
            </div>

            <PasswordInput
              password={formData.password}
              setPassword={(value) => setFormData({ ...formData, password: value })}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
