"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DayNightToggleButton from "@/components/ui/dark-mode-button";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { name } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // CodeForces handle verification
  const [handle, setHandle] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    setMounted(true);
    setIsDarkMode(theme === 'dark');
    
    // Try to get saved handle from localStorage
    const savedHandle = localStorage.getItem('cfHandle');
    if (savedHandle) {
      setHandle(savedHandle);
    }
  }, [theme]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    setTheme(newDarkMode ? 'dark' : 'light');
  };

  const verifyHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) return;

    setVerifying(true);
    setError("");

    try {
      const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
      const data = await res.json();

      if (data.status === 'OK') {
        localStorage.setItem('cfHandle', handle);
        setError("");
      } else {
        setError(data.comment || 'Invalid handle');
      }
    } catch (err) {
      setError('Failed to verify handle');
    } finally {
      setVerifying(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center py-8 px-4">
      {/* Dark mode toggle button */}
      <div className="fixed top-4 right-4 z-50 shadow-md rounded-full">
        <DayNightToggleButton dark={isDarkMode} setDark={toggleDarkMode} />
      </div>
      
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Pravah-X</CardTitle>
          <CardDescription>Enter your Codeforces handle to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={verifyHandle} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Enter your Codeforces handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={verifying}>
              {verifying ? "Verifying..." : handle ? "Go Pravah" : "Add Handle"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

