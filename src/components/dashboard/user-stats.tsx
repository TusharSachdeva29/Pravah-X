import { CFUserInfo, CFSubmission } from "@/lib/codeforces-api";
import { getRankColor } from "@/lib/rating-utils";
import { useState, useEffect } from "react";
import { Calendar, Flame, TrendingUp } from "lucide-react";
import { LearningPathItem, LearningPathRoadmap } from "./learning-path";
import { RatingTrend } from "./rating-trend";

interface UserStatsProps {
  userData: CFUserInfo | null;
  submissions: CFSubmission[];
  loading: boolean;
  error: string | null;
}

export function UserStats({
  userData,
  submissions,
  loading,
  error,
}: UserStatsProps) {
  const [streak, setStreak] = useState(0);

  // Calculate streak from submissions
  useEffect(() => {
    if (submissions.length > 0) {
      // Simple algorithm to calculate consecutive days with submissions
      const sortedSubmissions = [...submissions].sort(
        (a, b) =>
          new Date(b.creationTimeSeconds * 1000).getTime() -
          new Date(a.creationTimeSeconds * 1000).getTime()
      );

      // Count unique days with submissions in the last 30 days
      const today = new Date();
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 30);

      const uniqueDays = new Set();
      sortedSubmissions.forEach((submission) => {
        const submissionDate = new Date(submission.creationTimeSeconds * 1000);
        if (submissionDate > last30Days) {
          uniqueDays.add(submissionDate.toDateString());
        }
      });

      setStreak(uniqueDays.size);
    }
  }, [submissions]);

  if (loading) {
    return <p className="text-center py-10">Loading user data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  if (!userData) {
    return <p className="text-center py-10">No user data available</p>;
  }

  const rankColor = getRankColor(userData.rank);

  return (
    <div className="space-y-6">
      {/* User Profile Header - More responsive for mobile */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <img
          src={userData.titlePhoto}
          alt={userData.handle}
          className="w-24 h-24 rounded-full border-4"
          style={{ borderColor: rankColor }}
        />
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold flex flex-wrap justify-center sm:justify-start items-center gap-2">
            <span style={{ color: rankColor }}>
              {userData.rank || "Unrated"}
            </span>
            <span style={{ color: rankColor }}>{userData.handle}</span>

            {/* Streak indicator */}
            {streak > 0 && (
              <div className="ml-2 flex items-center text-orange-500 text-sm bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                <Flame size={16} className="mr-1" />
                <span>{streak} day streak</span>
              </div>
            )}
          </h1>
          <p className="text-muted-foreground">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="font-medium">
            Rating: {userData.rating} (max: {userData.maxRating})
          </p>
        </div>
      </div>

      {/* User Stats Cards - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background/50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Contribution</h3>
          <p className="text-lg">{userData.contribution}</p>
        </div>
        <div className="bg-background/50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Friend of</h3>
          <p className="text-lg">{userData.friendOfCount}</p>
        </div>
        <div className="bg-background/50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Problems Solved</h3>
          <p className="text-lg">
            {
              submissions.filter((submission) => submission.verdict === "OK")
                .length
            }
          </p>
        </div>
        <div className="bg-background/50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Activity</h3>
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            <p>Last 30 days: {streak} days</p>
          </div>
        </div>
      </div>

      {/* Rating Trend Chart */}
      <RatingTrend userData={userData} />
    </div>
  );
}
