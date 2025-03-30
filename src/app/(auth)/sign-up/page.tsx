"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { PasswordInput } from "@/components/ui/password-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Show success message
      setSuccess(true);
      
      // Redirect to sign-in page after a short delay
      setTimeout(() => {
        router.push("/sign-in?registered=true");
      }, 1500);
      
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Create an account</h1>
          <p className="text-sm text-muted-foreground">Sign up with a method of your choice</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-500/50">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              Account created successfully! Redirecting to sign in...
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          <Button variant="outline" type="button" disabled={isLoading} onClick={() => signIn("google")} className="flex items-center gap-2">
            <FcGoogle className="text-xl" /> Continue with Google
          </Button>

          <Button variant="outline" type="button" disabled={isLoading} onClick={() => signIn("github")} className="flex items-center gap-2">
            <FaGithub className="text-xl text-gray-900 dark:text-white" /> Continue with GitHub
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                type="text" 
                placeholder="John Doe" 
                disabled={isLoading || success} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="m@example.com" 
                disabled={isLoading || success} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                required
              />
            </div>

            <PasswordInput
              password={formData.password}
              setPassword={(value) => setFormData({ ...formData, password: value })}
              disabled={isLoading || success}
            />

            <Button type="submit" disabled={isLoading || success} className="w-full">
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/sign-in" className="underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
