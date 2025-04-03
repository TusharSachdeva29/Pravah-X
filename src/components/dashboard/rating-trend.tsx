"use client";

import { CFUserInfo, CFRatingChange } from "@/lib/codeforces-api";
import {
  RATING_TIERS,
  getRankColor,
  getTierByRating,
} from "@/lib/rating-utils";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RatingTrendProps {
  userData: CFUserInfo | null;
  ratingHistory?: CFRatingChange[];
}

export function RatingTrend({
  userData,
  ratingHistory: initialRatingHistory,
}: RatingTrendProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Simple dark mode check – you may replace this with your theme context
  const isDarkMode =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  useEffect(() => {
    if (userData) {
      // If we already have rating history, use that
      if (initialRatingHistory && initialRatingHistory.length > 0) {
        processRatingHistory(initialRatingHistory);
        return;
      }

      // Otherwise fetch user rating history
      async function fetchRatingHistory() {
        setLoading(true);
        try {
          const response = await fetch(
            `https://codeforces.com/api/user.rating?handle=${userData.handle}`
          );
          const data = await response.json();

          if (data.status === "OK") {
            processRatingHistory(data.result);
          } else {
            createSampleData();
          }
        } catch (error) {
          console.error("Failed to fetch rating history:", error);
          createSampleData();
        } finally {
          setLoading(false);
        }
      }

      // Process rating history data into chart format
      function processRatingHistory(ratingHistory: any[]) {
        if (!ratingHistory || ratingHistory.length === 0) {
          createSampleData();
          return;
        }

        // Format dates as month names for x-axis
        const labels = ratingHistory.map((contest: any) => {
          const date = new Date(contest.ratingUpdateTimeSeconds * 1000);
          // Just return the month name (abbreviated)
          return date.toLocaleString("default", { month: "short" });
        });

        const ratings = ratingHistory.map((contest: any) => contest.newRating);

        // Set chart data
        setChartData({
          labels,
          datasets: [
            {
              label: "Rating",
              data: ratings,
              borderColor: getRankColor(userData.rank),
              backgroundColor: `${getRankColor(userData.rank)}20`, // Transparent version of rank color
              tension: 0.3,
              fill: true,
              pointBackgroundColor: getRankColor(userData.rank),
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        });
      }

      // Create sample data if we don't have actual data yet
      function createSampleData() {
        // Generate some sample data based on current rating
        const currentRating = userData.rating || 1500;
        const maxRating = userData.maxRating || currentRating;

        const sampleData = [];
        let rating = Math.max(currentRating - 300, 800); // Start a bit lower than current

        // Generate 10 sample points
        for (let i = 0; i < 10; i++) {
          // Random change between -100 and +150
          const change = Math.floor(Math.random() * 250) - 100;
          rating = Math.max(rating + change, 800); // Ensure rating doesn't go too low

          // Make sure the last point is the current rating
          if (i === 9) {
            rating = currentRating;
          }

          // Make sure max rating appears somewhere in the data
          if (i === 5) {
            rating = maxRating;
          }

          sampleData.push(rating);
        }

        // Generate month labels for the sample data
        const labels = [];
        const now = new Date();

        // Start from 9 months ago
        for (let i = 9; i >= 0; i--) {
          const date = new Date();
          date.setMonth(now.getMonth() - i);
          // Show abbreviated month name (Jan, Feb, etc.)
          labels.push(date.toLocaleString("default", { month: "short" }));
        }

        setChartData({
          labels,
          datasets: [
            {
              label: "Rating",
              data: sampleData,
              borderColor: getRankColor(userData.rank),
              backgroundColor: `${getRankColor(userData.rank)}20`, // Transparent version of rank color
              tension: 0.3,
              fill: true,
              pointBackgroundColor: getRankColor(userData.rank),
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        });
      }

      // Try to fetch real data first
      fetchRatingHistory();
    }
  }, [userData, initialRatingHistory]);

  if (!userData) return null;

  // Find the min and max ratings
  const minRating = chartData?.datasets[0]?.data?.reduce(
    (min: number, val: number) => (val < min ? val : min),
    chartData?.datasets[0]?.data?.[0] || 0
  );
  const maxRating = chartData?.datasets[0]?.data?.reduce(
    (max: number, val: number) => (val > max ? val : max),
    chartData?.datasets[0]?.data?.[0] || 3000
  );

  // Custom plugin to draw rating tier backgrounds - improved colors
  const ratingBackgroundsPlugin = {
    id: "ratingBackgrounds",
    beforeDraw: (chart: any) => {
      const ctx = chart.ctx;
      const yAxis = chart.scales.y;
      const chartArea = chart.chartArea;

      // Draw tier backgrounds with more accurate CF colors
      RATING_TIERS.forEach((tier) => {
        // Skip tiers that are completely out of the visible range
        if (tier.max < yAxis.min || tier.min > yAxis.max) return;

        // Calculate y positions for the tier
        const yMin = Math.max(yAxis.getPixelForValue(tier.min), chartArea.top);
        const yMax = Math.min(
          yAxis.getPixelForValue(tier.max),
          chartArea.bottom
        );

        // Use more accurate background colors from CF with transparency
        ctx.fillStyle = `${tier.bgColor}95`; // More accurate CF colors with higher opacity

        // Draw rectangle for this tier
        ctx.fillRect(
          chartArea.left,
          yMin,
          chartArea.right - chartArea.left,
          yMax - yMin
        );

        // Add a line at the tier boundary - thicker like CF
        ctx.beginPath();
        ctx.moveTo(chartArea.left, yMax);
        ctx.lineTo(chartArea.right, yMax);
        ctx.strokeStyle = tier.color; // Use the full color for tier boundary
        ctx.lineWidth = 1.5; // Slightly thicker line
        ctx.stroke();

        // Add tier name on the right side if there's enough space
        if (yMax - yMin > 20) {
          ctx.fillStyle = tier.color;
          ctx.font = "bold 11px Arial"; // Bold font like CF
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          ctx.fillText(tier.name, chartArea.right - 5, yMax - 3);
        }
      });
    },
  };

  return (
    <div className="bg-background/50 p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-4 flex items-center">
        <TrendingUp size={18} className="mr-2" />
        Rating History
      </h3>
      <div className="h-64 w-full">
        {chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: false,
                  min: Math.max(0, minRating - 200), // Ensure we don't go below 0
                  max: maxRating + 200, // Add some padding
                  grid: {
                    color: isDarkMode
                      ? "rgba(100, 100, 100, 0.2)"
                      : "rgba(200, 200, 200, 0.1)",
                    z: -1, // Draw grid lines behind data
                  },
                  border: {
                    dash: [4, 4],
                  },
                  ticks: {
                    callback: function (value) {
                      return value;
                    },
                    color: "rgba(200, 200, 200, 0.8)",
                    font: {
                      size: 12,
                    },
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: "rgba(200, 200, 200, 0.8)",
                    maxRotation: 0, // Don't rotate x-axis labels
                    autoSkip: true,
                    maxTicksLimit: 10, // Limit the number of ticks
                    font: {
                      size: 12,
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  backgroundColor: isDarkMode
                    ? "rgba(0, 0, 0, 0.8)"
                    : "rgba(255, 255, 255, 0.9)",
                  titleFont: {
                    size: 14,
                    weight: "bold",
                  },
                  bodyFont: {
                    size: 13,
                  },
                  padding: 10,
                  borderColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                  borderWidth: 1,
                  callbacks: {
                    title: (tooltipItems) => tooltipItems[0].label,
                    label: (context) => {
                      const rating = context.parsed.y;
                      const tier = RATING_TIERS.find(
                        (t) => rating >= t.min && rating <= t.max
                      );
                      return [
                        `Rating: ${rating}`,
                        `Rank: ${tier?.name || "Unknown"}`,
                      ];
                    },
                  },
                },
                ratingBackgrounds: ratingBackgroundsPlugin,
              },
              elements: {
                line: {
                  borderWidth: 2,
                  tension: 0.2, // Less curved lines like CF
                },
                point: {
                  radius: 3, // Smaller points by default
                  hoverRadius: 5, // Larger on hover
                },
              },
              interaction: {
                intersect: false,
                mode: "index",
              },
            }}
            plugins={[ratingBackgroundsPlugin]}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">
              {loading
                ? "Loading rating history..."
                : "No rating data available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
