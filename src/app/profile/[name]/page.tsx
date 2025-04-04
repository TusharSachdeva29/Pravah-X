"use client";
import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Logo } from "@/components/logo";
import Link from "next/link";
import DayNightToggleButton from "@/components/ui/dark-mode-button";
import { Menu, X } from "lucide-react"; // Import icons for mobile menu
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
  CFContest,
} from "@/lib/codeforces-api";
import { UserStats } from "@/components/dashboard/user-stats";
import { UpcomingContests } from "@/components/dashboard/upcoming-contests";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function Dashboard({ params }: { params: { name: string } }) {
  const unwrappedParams = use(params);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [handle, setHandle] = useState("");
  const [contests, setContests] = useState<CFContest[]>([]);
  const [userData, setUserData] = useState<CFUserInfo | null>(null);
  const [submissions, setSubmissions] = useState<CFSubmission[]>([]);
  const [ratingHistory, setRatingHistory] = useState<CFRatingChange[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch user data
        const user = await getUserInfo(unwrappedParams.name);
        setUserData(user);

        // Fetch user submissions
        const subs = await getUserSubmissions(unwrappedParams.name);
        setSubmissions(subs);

        // Fetch rating history
        const ratings = await getUserRatingHistory(unwrappedParams.name);
        setRatingHistory(ratings);

        // Fetch upcoming contests
        const contests = await getContests();
        setContests(contests.slice(0, 5)); // Show only next 5 contests
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch Codeforces data"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [unwrappedParams.name]);

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
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="translate-x-[-5px]"
            >
              <Link href="/explore">Explore</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="translate-x-[-15px]"
            >
              <Link href="/community">Community</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="translate-x-[-25px]"
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
      <div className="container px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User info section */}
        <div className="md:col-span-2 bg-card rounded-lg shadow-md p-6">
          <UserStats
            userData={userData}
            submissions={submissions}
            loading={loading}
            error={error}
          />
        </div>

        {/* Upcoming contests section */}
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Upcoming Contests</h2>
          <UpcomingContests contests={contests} loading={loading} />
        </div>

        {/* Activity Heatmap */}
        <div className="md:col-span-2 bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Activity</h2>
          {loading ? (
            <div className="animate-pulse h-40 bg-muted rounded-md"></div>
          ) : error ? (
            <div className="text-destructive">Failed to load activity data</div>
          ) : (
            <ActivityHeatmap submissions={submissions} />
          )}
        </div>

        {/* Recent Submissions */}
        <div className="bg-card rounded-lg shadow-md p-6">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl font-bold">
                Recent Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse h-12 bg-muted rounded-md"
                    ></div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-destructive">
                  Failed to load submissions
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-muted-foreground">
                  No recent submissions found
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.slice(0, 5).map((submission, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 rounded-md hover:bg-muted transition-colors"
                    >
                      <div>
                        <div className="font-medium line-clamp-1">
                          {submission.problem.name}
                        </div>
                        <div className="text-xs flex gap-2 text-muted-foreground">
                          <span>
                            {new Date(
                              submission.creationTimeSeconds * 1000
                            ).toLocaleDateString()}
                          </span>
                          <span
                            className={
                              submission.verdict === "OK"
                                ? "text-green-500 dark:text-green-400"
                                : "text-red-500 dark:text-red-400"
                            }
                          >
                            {submission.verdict === "OK"
                              ? "Accepted"
                              : submission.verdict || "Unknown"}
                          </span>
                        </div>
                      </div>
                      <a
                        href={`https://codeforces.com/contest/${submission.contestId}/submission/${submission.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a
                        href={`https://codeforces.com/submissions/${unwrappedParams.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View All Submissions{" "}
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
