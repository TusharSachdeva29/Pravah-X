'use client';

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function GithubSignIn() {
  return (
    <Button 
      className="w-full" 
      variant="outline" 
      onClick={() => signIn('github', { callbackUrl: '/' })}
    >
      Continue with GitHub
    </Button>
  );
}
