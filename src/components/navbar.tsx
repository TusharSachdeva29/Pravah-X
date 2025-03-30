// In Navbar.tsx, replace the Button with:
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import DayNightToggleButton from "@/components/ui/dark-mode-button";
// ...other imports

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(theme === "dark");
  
  useEffect(() => {
    setMounted(true);
    setDark(theme === "dark");
  }, [theme]);
  
  // Handle toggle
  useEffect(() => {
    setTheme(dark ? "dark" : "light");
  }, [dark, setTheme]);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        {/* ...existing code... */}
        
        <nav className="flex items-center gap-2">
          <DayNightToggleButton dark={dark} setDark={setDark} />
        </nav>
      </div>
    </header>
  );
}