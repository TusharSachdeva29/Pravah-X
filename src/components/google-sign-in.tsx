'use client';

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function GoogleSignIn() {
  return (
    <Button 
      variant="outline" 
      className="w-full"
      onClick={() => signIn('google', { callbackUrl: '/' })}
    >
      Continue with Google
    </Button>
  );
}
