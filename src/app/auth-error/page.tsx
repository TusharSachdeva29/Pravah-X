"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("Authentication error");

  useEffect(() => {
    const error = searchParams.get("error");
    
    if (error === "OAuthAccountNotLinked") {
      setErrorMessage(
        "This email is already associated with another sign-in method. Please use your original sign-in method."
      );
    } else if (error) {
      setErrorMessage(`Authentication error: ${error}`);
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md space-y-8 p-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold">Authentication Error</h1>
        </div>

        <div className="text-center">
          <p className="mb-6 text-muted-foreground">{errorMessage}</p>

          <div className="flex flex-col gap-2">
            <Link href="/sign-in" passHref>
              <Button className="w-full">Try Again with Different Method</Button>
            </Link>
            <Link href="/" passHref>
              <Button variant="outline" className="w-full">Return to Home</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
