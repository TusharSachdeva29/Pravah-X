"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  getUserInfo,
  getUserSubmissions,
  getContests,
  getUserRatingHistory,
} from "@/lib/codeforces-api";
import type {
  CFUserInfo,
  CFSubmission,
  CFRatingChange,
} from "@/lib/codeforces-api";
import { Logo } from "@/components/logo";
import Link from "next/link";
import DayNightToggleButton from "@/components/ui/dark-mode-button";

export default function Dashboard({ params }: { params: { name: string } }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [handle, setHandle] = useState("");
  const [contests, setContests] = useState([]);
  const [userData, setUserData] = useState<CFUserInfo | null>(null);
  const [submissions, setSubmissions] = useState<CFSubmission[]>([]);
  const [ratingHistory, setRatingHistory] = useState<CFRatingChange[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    setTheme(newDarkMode ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/explore">Explore</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/community">Community</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/problem-of-the-day">Problem of the Day</Link>
            </Button>
            
            {/* Dark mode toggle button */}
            <div className="fixed top-2 right-4 z-50 shadow-md rounded-full">
              <DayNightToggleButton dark={isDarkMode} setDark={toggleDarkMode} />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
