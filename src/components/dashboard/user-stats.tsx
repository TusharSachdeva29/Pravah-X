"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ArrowUp, Award, Code, Target, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type {
  CFUserInfo,
  CFSubmission,
  CFRatingChange,
} from "@/lib/codeforces-api";

interface UserStatsProps extends React.HTMLAttributes<HTMLDivElement> {
  userData: CFUserInfo;
  submissions: CFSubmission[];
  ratingHistory: CFRatingChange[];
}

export function UserStats({
  className,
  userData,
  submissions,
  ratingHistory,
  ...props
}: UserStatsProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate solved problems count
  const solvedProblems = new Set(
    submissions
      .filter((sub) => sub.verdict === "OK")
      .map((sub) => `${sub.contestId}${sub.problem.index}`)
  ).size;

  // Process rating history data
  const processRatingHistory = () => {
    if (!ratingHistory.length) return [];

    // Sort by time
    const sortedHistory = [...ratingHistory].sort(
      (a, b) => a.ratingUpdateTimeSeconds - b.ratingUpdateTimeSeconds
    );

    return sortedHistory.map((rating) => ({
      date: new Date(rating.ratingUpdateTimeSeconds * 1000).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
        }
      ),
      rating: rating.newRating,
      month: new Date(rating.ratingUpdateTimeSeconds * 1000).toLocaleDateString(
        "en-US",
        { month: "short" }
      ),
      contest: rating.contestName,
      change: rating.newRating - rating.oldRating,
      timestamp: rating.ratingUpdateTimeSeconds * 1000,
    }));
  };

  const ratingData = processRatingHistory();
  const currentRating = userData.rating || 0;
  const maxRating = userData.maxRating || 0;
  const ratingChange =
    ratingData.length > 1
      ? ratingData[ratingData.length - 1].rating -
        ratingData[ratingData.length - 2].rating
      : 0;

  // Get rating color and title
  const getRatingInfo = (rating: number) => {
    if (rating < 1200)
      return { color: "rating-newbie", title: "Newbie", textColor: "#808080" };
    if (rating < 1400)
      return { color: "rating-pupil", title: "Pupil", textColor: "#008000" };
    if (rating < 1600)
      return {
        color: "rating-specialist",
        title: "Specialist",
        textColor: "#03A89E",
      };
    if (rating < 1900)
      return { color: "rating-expert", title: "Expert", textColor: "#0000FF" };
    if (rating < 2100)
      return {
        color: "rating-candidate",
        title: "Candidate Master",
        textColor: "#AA00AA",
      };
    if (rating < 2400)
      return { color: "rating-master", title: "Master", textColor: "#FF8C00" };
    if (rating < 2600)
      return {
        color: "rating-grandmaster",
        title: "Grandmaster",
        textColor: "#FF0000",
      };
    if (rating < 3000)
      return {
        color: "rating-international",
        title: "International Grandmaster",
        textColor: "#FF0000",
      };
    return {
      color: "rating-legendary",
      title: "Legendary Grandmaster",
      textColor: "#FF0000",
    };
  };

  const ratingInfo = getRatingInfo(currentRating);

  // Define Codeforces exact rating divisions with colors - exactly like Codeforces
  const ratingDivisions = [
    {
      y: 1200,
      label: "Pupil",
      color: "#008000",
      range: [0, 1200],
      backgroundColor: "rgba(128, 128, 128, 0.1)",
      darkBackgroundColor: "rgba(128, 128, 128, 0.15)",
    },
    {
      y: 1400,
      label: "Specialist",
      color: "#03A89E",
      range: [1200, 1400],
      backgroundColor: "rgba(0, 128, 0, 0.1)",
      darkBackgroundColor: "rgba(0, 128, 0, 0.15)",
    },
    {
      y: 1600,
      label: "Expert",
      color: "#03A89E",
      range: [1400, 1600],
      backgroundColor: "rgba(3, 168, 158, 0.1)",
      darkBackgroundColor: "rgba(3, 168, 158, 0.15)",
    },
    {
      y: 1900,
      label: "Candidate Master",
      color: "#AA00AA",
      range: [1600, 1900],
      backgroundColor: "rgba(0, 0, 255, 0.1)",
      darkBackgroundColor: "rgba(0, 0, 255, 0.15)",
    },
  ];

  // Mock upcoming contests data (in a real app, this would come from props or an API)
  const upcomingContests = [
    {
      id: 1,
      name: "Codeforces Round #850 (Div. 2)",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      duration: "2 hours",
      link: "https://codeforces.com/contests",
    },
    {
      id: 2,
      name: "Educational Codeforces Round 155",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      duration: "2 hours",
      link: "https://codeforces.com/contests",
    },
    {
      id: 3,
      name: "Codeforces Round #851 (Div. 1 + Div. 2)",
      date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
      duration: "2.5 hours",
      link: "https://codeforces.com/contests",
    },
  ];

  // Custom tooltip similar to Codeforces
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const ratingInfoAtPoint = getRatingInfo(data.rating);

      return (
        <div className="bg-white dark:bg-gray-900 p-2 border border-gray-200 dark:border-gray-700 rounded shadow">
          <div
            className="text-center font-medium text-sm mb-1"
            style={{ color: ratingInfoAtPoint.textColor }}
          >
            {data.rating} ({ratingInfoAtPoint.title})
          </div>
          <div className="text-xs mb-1 text-muted-foreground">
            {data.contest}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(data.timestamp).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div
            className={cn(
              "text-xs font-medium mt-1",
              data.change > 0
                ? "text-green-500 dark:text-green-400"
                : data.change < 0
                ? "text-red-500 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {data.change > 0 ? "+" : ""}
            {data.change} points
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate appropriate Y-axis domain based on rating data
  const calculateYAxisDomain = () => {
    if (ratingData.length === 0) return [0, 2000]; // Adjust default range to include all desired ticks

    const minRating = Math.min(...ratingData.map((d) => d.rating));
    const maxRating = Math.max(...ratingData.map((d) => d.rating));

    // Add padding to make the chart look better - CF style
    // Ensure the domain includes our specific ticks
    const minDomain = Math.min(
      400,
      Math.max(0, Math.floor((minRating - 300) / 100) * 100)
    );
    const maxDomain = Math.max(1900, Math.ceil((maxRating + 300) / 100) * 100);

    return [minDomain, maxDomain];
  };

  const yAxisDomain = calculateYAxisDomain();

  // Define specific ticks we want to show on the Y-axis
  const specificTicks = [400, 800, 1200, 1400, 1900].filter(
    (tick) => tick >= yAxisDomain[0] && tick <= yAxisDomain[1]
  );

  // Function to render colored background areas - CF style
  const renderColoredAreas = () => {
    return ratingDivisions
      .filter(
        (div) =>
          div.range[1] >= yAxisDomain[0] && div.range[0] <= yAxisDomain[1]
      )
      .map((division, idx) => {
        const y1 = Math.max(division.range[0], yAxisDomain[0]);
        const y2 = Math.min(division.range[1], yAxisDomain[1]);

        return (
          <rect
            key={idx}
            x="0%"
            y={`${
              100 -
              ((y2 - yAxisDomain[0]) / (yAxisDomain[1] - yAxisDomain[0])) * 100
            }%`}
            width="100%"
            height={`${((y2 - y1) / (yAxisDomain[1] - yAxisDomain[0])) * 100}%`}
            fill={division.backgroundColor}
          />
        );
      });
  };

  // Determine which divisions to show
  const visibleDivisions = ratingDivisions.filter(
    (div) => div.y >= yAxisDomain[0] && div.y <= yAxisDomain[1]
  );

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>
              Codeforces statistics for {userData.handle}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`rating-badge ${ratingInfo.color.replace(
                "rating-",
                ""
              )}`}
            >
              {ratingInfo.title}
            </div>
            {ratingChange !== 0 && (
              <div
                className={cn(
                  "flex items-center text-xs px-2 py-1 rounded-full",
                  ratingChange > 0
                    ? "text-green-500 bg-green-50 dark:bg-green-950/30"
                    : "text-red-500 bg-red-50 dark:bg-red-950/30"
                )}
              >
                <TrendingUp
                  className={cn(
                    "mr-1 h-3 w-3",
                    ratingChange < 0 && "rotate-180"
                  )}
                />
                <span>
                  {ratingChange > 0 ? `+${ratingChange}` : ratingChange}
                </span>
              </div>
            )}
            ,
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4 bg-muted/50 p-1 w-full overflow-x-auto">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-background"
            >
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="overview"
            className="mt-0 space-y-4 animate-slide-up"
          >
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-2 md:p-3 shadow-sm">
                  <div className="flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/50 p-2">
                    <Code className="h-4 w-4 md:h-5 md:w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xl md:text-2xl font-bold">
                      {solvedProblems}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Problems Solved
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-2 md:p-3 shadow-sm">
                  <div className="flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/50 p-2">
                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xl md:text-2xl font-bold">
                      {userData.rating || "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Current Rating
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-2 md:p-3 shadow-sm">
                  <div className="flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/50 p-2">
                    <Award className="h-4 w-4 md:h-5 md:w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xl md:text-2xl font-bold">
                      {userData.maxRating || "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Max Rating
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Rating Trend</div>
                  {ratingChange !== 0 && (
                    <div
                      className={cn(
                        "flex items-center text-xs",
                        ratingChange > 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      <ArrowUp
                        className={cn(
                          "mr-1 h-3 w-3",
                          ratingChange < 0 && "rotate-180"
                        )}
                      />
                      <span>
                        {ratingChange > 0 ? `+${ratingChange}` : ratingChange}{" "}
                        last contest
                      </span>
                    </div>
                  )}
                </div>

                {mounted && ratingData.length > 0 ? (
                  <div className="h-[250px] w-full rating-graph">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={ratingData}
                        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                      >
                        {/* CF-style colored background with dark mode support */}
                        <defs>
                          <linearGradient
                            id="colorRating-light"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#AA00AA"
                              stopOpacity={0.1}
                            />
                            <stop
                              offset="25%"
                              stopColor="#0000FF"
                              stopOpacity={0.1}
                            />
                            <stop
                              offset="50%"
                              stopColor="#03A89E"
                              stopOpacity={0.1}
                            />
                            <stop
                              offset="75%"
                              stopColor="#008000"
                              stopOpacity={0.1}
                            />
                            <stop
                              offset="100%"
                              stopColor="#808080"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorRating-dark"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#AA00AA"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="25%"
                              stopColor="#0000FF"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="50%"
                              stopColor="#03A89E"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="75%"
                              stopColor="#008000"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="100%"
                              stopColor="#808080"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                        </defs>
                        <rect
                          x="0"
                          y="0"
                          width="100%"
                          height="100%"
                          className="fill-[url(#colorRating-light)] dark:fill-[url(#colorRating-dark)]"
                        />

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={true}
                          horizontal={true}
                          opacity={0.2}
                          className="stroke-gray-400 dark:stroke-gray-500"
                        />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 10 }}
                          axisLine={{ strokeWidth: 1 }}
                          tickLine={false}
                          interval="preserveStartEnd"
                          className="text-gray-900 dark:text-gray-300"
                          stroke="#888888"
                        />
                        <YAxis
                          domain={yAxisDomain}
                          allowDecimals={false}
                          ticks={specificTicks}
                          tick={{ fontSize: 10 }}
                          axisLine={{ strokeWidth: 1 }}
                          tickLine={false}
                          width={30}
                          className="text-gray-900 dark:text-gray-300"
                          stroke="#888888"
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ strokeDasharray: "3 3", stroke: "#666" }}
                        />

                        {/* Rating division reference lines with classification labels */}
                        {visibleDivisions.map((division) => (
                          <ReferenceLine
                            key={division.label}
                            y={division.y}
                            stroke={division.color}
                            strokeWidth={1}
                            strokeOpacity={1}
                            strokeDasharray="3 3"
                            label={{
                              position: "right",
                              value: division.label,
                              fill: division.color,
                              fontSize: 10,
                              className: "dark:font-medium",
                            }}
                          />
                        ))}

                        <Line
                          type="monotone"
                          dataKey="rating"
                          stroke="#000000"
                          strokeWidth={2}
                          className="dark:stroke-white"
                          dot={{
                            r: 3,
                            fill: "#000000",
                            className: "dark:fill-white",
                            strokeWidth: 1,
                            stroke: "#fff",
                            strokeOpacity: 1,
                          }}
                          activeDot={{
                            r: 5,
                            fill: "#000000",
                            className: "dark:fill-white",
                            strokeWidth: 1.5,
                            stroke: "#fff",
                            strokeOpacity: 1,
                          }}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
                    {mounted
                      ? "No rating history available"
                      : "Loading chart..."}
                  </div>
                )}

                {ratingData.length > 0 && (
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground border-t border-gray-100 dark:border-gray-800 pt-2">
                    <div className="flex items-center">
                      <span className="font-medium">Contests: </span>
                      <span className="ml-1">{ratingData.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Min: </span>
                      <span>
                        {Math.min(...ratingData.map((d) => d.rating))}
                      </span>
                      <span className="font-medium ml-2">Max: </span>
                      <span>
                        {Math.max(...ratingData.map((d) => d.rating))}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* New Upcoming Contests section */}
              <div className="rounded-lg border bg-card p-3 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium">Upcoming Contests</div>
                  <a
                    href="https://codeforces.com/contests"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View all
                  </a>
                </div>

                {upcomingContests.length > 0 ? (
                  <div className="space-y-2">
                    {upcomingContests.map((contest) => (
                      <div
                        key={contest.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {contest.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {contest.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            · {contest.duration}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span
                            className={cn(
                              "text-xs inline-flex items-center rounded-full px-2.5 py-0.5 font-medium",
                              new Date() > contest.date
                                ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            )}
                          >
                            {new Date() > contest.date ? "Ended" : "Upcoming"}
                          </span>
                          <a
                            href={contest.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-muted"
                          >
                            <Target className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center text-sm text-muted-foreground">
                    <div className="mb-2">No upcoming contests</div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
