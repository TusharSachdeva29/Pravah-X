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
import { Menu, X } from "lucide-react"; // Import icons for mobile menu

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rating = 0;

  useEffect(() => {
    setMounted(true);
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    setTheme(newDarkMode ? "dark" : "light");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 mr-10">
            <Button variant="ghost" size="sm" asChild
            
            className = "translate-x-[-5px]">
              <Link href="/explore">Explore</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild
            className = "translate-x-[-15px]"
            >
              <Link href="/community">Community</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild
            className = "translate-x-[-25px]"
            >
              <Link href="/profile/potd/rating">Problem of the Day</Link>
            </Button>

            {/* Dark mode toggle button - desktop */}
            <div className="fixed top-2 right-4 z-50 shadow-md rounded-full">
              <DayNightToggleButton
                dark={isDarkMode}
                setDark={toggleDarkMode}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Small screen dark mode toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-1 h-8 w-8"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-1"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border py-2 px-4 space-y-2 animate-in slide-in-from-top">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/explore">Explore</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/community">Community</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/profile/potd/rating">Problem of the Day</Link>
            </Button>
          </div>
        )}
      </nav>
    </div>
  );
}
